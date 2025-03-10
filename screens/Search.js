import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/user";


export default function Search({ navigation }) {
    const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    const [recipes, setRecipes] = useState([]);
    const [dietOptions, setDietOptions] = useState([...user.diets]);
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);

    const dietIcons = [
        { name: 'muscleGain', img: require("../assets/barbell.png") },
        { name: 'healthy', img: require("../assets/scale.png") },
        { name: 'glutenFree', img: require("../assets/no-gluten.png") },
        { name: 'pregnant', img: require("../assets/pregnant.png") },
        { name: 'vegetarian', img: require("../assets/vegeterian.png") }
    ];

    // Use effect: user.diets init or updated
    useEffect(() => {
        fetch(`http://${IPADRESS}:3000` + '/recipes/search?diets=' + user.diets.join(',') + '&name=' + searchInput)
            .then(response => response.json())
            .then(data => {
                if (data?.result) {
                    setRecipes(data.recipes)
                    setDietOptions([...user.diets])
                }
            })

    }, [user.diets]);

    // Use effect: dietOptions or seachInput initialized or updated
    useEffect(() => {
        const dietsStr = dietOptions.join();
        fetch(`http://${IPADRESS}:3000` + '/recipes/search?diets=' + dietsStr + '&name=' + searchInput)
            .then(response => response.json())
            .then(data => {
                if (data?.result) {
                    setRecipes(data.recipes)
                }
            })
    }, [dietOptions, searchInput]);

    // handlePressIconSearch : handle press on search icons (add or remove a diet from dietOptions)
    const handlePressIconSearch = (dietName) => {
        if (dietOptions.includes(dietName)) {
            setDietOptions(dietOptions.filter(diet => diet != dietName));
        } else {
            setDietOptions([...dietOptions, dietName]);
        }
    };

    // handlePressBookmark: handle press on bookmark icon
    const handlePressBookmark = (recipe) => {
        if (user.bookmarks.includes(recipe.id)) {
            fetch(`http://${IPADRESS}:3000/bookmarks/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: user.token, recipe_id: recipe.id })
            }).then(res => res.json())
                .then(data => {
                    data.result && dispatch(removeBookmark(recipe.id));
                })
        } else {
            fetch(`http://${IPADRESS}:3000/bookmarks/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: user.token, recipe_id: recipe.id })
            }).then(res => res.json())
                .then(data => {
                    data.result && dispatch(addBookmark(recipe.id));
                })
        }
    }

    // recipesContent: array of recipe
    const recipesContent = recipes.length == 0 ? <Text style={styles.loading}>Loading...</Text> : recipes.slice(0, page * 25).map((recipe, i) => {
        const icons = dietIcons.filter(diet => recipe[diet.name])
            .map((diet, i) => (<Image key={i} style={styles.recipeImage} source={diet.img} alt={diet.name} />))

        const colorBookmark = user.token && user.bookmarks.includes(recipe.id) ? "#6DCD7D" : "black";
        const bookmark = user.token ? <Icon name="bookmark" size={22} color={colorBookmark} style={styles.bookmarkIcon} onPress={() => handlePressBookmark(recipe)} /> : [];
        const name = recipe.name.length > 25 ? recipe.name.slice(0, 22) + '...' : recipe.name;
        return (
            <TouchableOpacity style={styles.recetteContent} key={i} onPress={() => navigation.navigate('Recipe', { id: recipe.id })}>
                <View style={styles.pictureContainer}>
                    <Image source={{ uri: recipe.picture }} style={styles.picture} ></Image>
                    <View style={styles.bookmarks}>
                        {bookmark}
                    </View>
                </View>
                <Text style={styles.text} >{name}</Text>
                <View style={styles.iconsContainer}>
                    <View style={styles.icons}>
                        {icons}
                    </View>
                </View>
            </TouchableOpacity>
        )
    })

    // searchIcons: array of icons jsx for search option
    const searchIcons = dietIcons.map((diet, i) => {
        const styleIcon = dietOptions.includes(diet.name) ? { ...styles.image, backgroundColor: '#6DCD7D' } : styles.image;

        return (
            <TouchableOpacity key={i} onPress={() => handlePressIconSearch(diet.name)}>
                <Image style={styleIcon} source={diet.img} alt={diet.name} onPress={() => handlePressIconSearch(diet.name)} />
            </TouchableOpacity>
        )
    });

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <>
            <View style={styles.searchContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="search" size={20} color="grey" style={styles.icon} />
                    <TextInput style={styles.textInput} placeholder="Search" onChangeText={value => setSearchInput(value)} value={searchInput}></TextInput>
                </View>
                <View style={styles.imageContainer}>
                    {searchIcons}
                </View>
            </View>
            <ScrollView>
                <View style={styles.recetteContainer}>
                    {recipesContent}
                </View>
                {recipes.length > page * 25 && (
                    <TouchableOpacity style={styles.handleLoadMoreButton} onPress={handleLoadMore}>
                        <Text style={styles.loadMoreText}> See more ... </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#EDF9EF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingLeft: '5%',
        backgroundColor: 'white',
        width: '90%',
        marginTop: '10%',
        marginLeft: '5%',
        borderWidth: 2,
        borderColor: '#6DCD7D',
        borderRadius: 10,
        borderStyle: 'solid',
    },
    icon: {
        marginRight: 0,
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: '2%',
        marginLeft: '5%',
        marginBottom: '5%',
    },
    image: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#6DCD7D',
        borderRadius: 10,
        borderStyle: 'solid',
        margin: 5,
    },
    textInput: {
        width: '95%',
    },
    loading: {
        marginLeft: 20,
    },
    picture: {
        width: 150,
        height: 150,
        borderRadius: 10,
        margin: 10,
    },
    recetteContainer: {
        flex: 1,
        backgroundColor: '#EDF9EF',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
    },
    recetteContent: {
        width: '45%',
        margin: 5,
        padding: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#6DCD7D',
        borderStyle: 'solid',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    pictureContainer: {
        flexDirection: 'row',
    },
    bookmarkIcon: {
        position: 'absolute',
        right: 120,
        top: '10%',
        backgroundColor: '#EDF9EF',
        padding: 5,
        borderWidth: 2,
    },
    icons: {
        flexDirection: 'row',
    },
    recipeImage: {
        width: 25,
        height: 25,
        margin: '2%',
    },
    handleLoadMoreButton: {
        backgroundColor: '#EDF9EF',
        paddingLeft: '60%',
        paddingBottom: '5%',
    },
    loadMoreText: {
        fontFamily: 'inter',
        fontWeight: '900',
        fontSize: 25,
        color: 'black',
        fontStyle: 'italic'
    }
})