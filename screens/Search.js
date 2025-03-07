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
    const [dietOptions, setDietOptions] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const dietIcons = [
        { name: 'muscleGain', img: require("../assets/barbell.png") },
        { name: 'healthy', img: require("../assets/scale.png") },
        { name: 'glutenFree', img: require("../assets/no-gluten.png") },
        { name: 'pregnant', img: require("../assets/pregnant.png") },
        { name: 'vegetarian', img: require("../assets/vegeterian.png") }
    ];

    // Use effect: mount
    useEffect(() => {
        const diets = user.diet ? user.diet : ''
        
        fetch(`http://${IPADRESS}:3000` + '/recipes/search?diets=' + diets)
            .then(response => response.json())
            .then(data => {
                if (data?.result) {
                    setRecipes(data.recipes)
                    user && setDietOptions([user.diet])
                }
            })
    }, [user.diet]);

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
    const recipesContent = recipes.length == 0 ? <Text style={styles.loading}>Loading...</Text> : recipes.map((recipe, i) => {
        const icons = dietIcons.filter(diet => recipe[diet.name])
            .map((diet, i) => (<Image key={i} style={styles.recipeImage} source={diet.img} alt={diet.name} />))

        const colorBookmark = user.token && user.bookmarks.includes(recipe.id) ? "#6DCD7D" : "black";
        const bookmark = user.token ? <Icon name="bookmark" size={22} color={colorBookmark} style={styles.icon} onPress={() => handlePressBookmark(recipe)} /> : [];
        const name = recipe.name.length > 25 ? recipe.name.slice(0, 22) + '...' : recipe.name;

        return (
            <TouchableOpacity key={i} style={styles.recetteContainer} onPress={() => navigation.navigate('Recipe', { id: recipe.id })}>
                <View style={styles.iconsContainer}>
                    {icons}
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.recette} numberOfLines={1}>{name}</Text>
                    {bookmark}
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
            <ScrollView style={styles.container}>
                {recipesContent}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#EDF9EF',
    },
    container: {
        flex: 1,
        backgroundColor: '#EDF9EF',
        overflow: 'scroll',
        paddingBottom: '10%',
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
    recetteContainer: {
        alignItems: 'space-between',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#1A6723',
        padding: '3%',
        borderRadius: 10,
        width: '90%',
        textAlign: 'center',
        margin: '3%',
    },
    recette: {
        fontFamily: 'Inter',
        color: 'white',
        fontWeight: 'medium',
    },
    recipeImage: {
        width: 25,
        height: 25,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconsContainer: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: '100%'
    },
    textInput: {
        width: '95%',
    },
    loading: {
        marginLeft: 20,
    }
})