import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function SavedRecipes() {
    const navigation = useNavigation();
    const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
    const user = useSelector((state) => state.user.value);
    const [bookmarks, setBookmarks] = useState([]);

    const dietIcons = [
        { name: 'muscleGain', img: require("../assets/barbell.png") },
        { name: 'healthy', img: require("../assets/scale.png") },
        { name: 'glutenFree', img: require("../assets/no-gluten.png") },
        { name: 'pregnant', img: require("../assets/pregnant.png") },
        { name: 'vegetarian', img: require("../assets/vegeterian.png") }
    ];


    // Use effect: mount
    useEffect(() => {
        fetch(`http://${IPADRESS}:3000` + '/bookmarks/infos/' + user.token)
            .then(response => response.json())
            .then(data => {
                data.result && setBookmarks(data.bookmarks);
            })

    }, [user.bookmarks]);

    const content = bookmarks.length == 0 ? <Text style={styles.loading}>No saved recipe.</Text> : bookmarks.map((bookmark, i) => {

        const icons = dietIcons.filter(diet => bookmark[diet.name])
            .map((diet, i) => (<Image key={i} style={styles.recipeImage} source={diet.img} alt={diet.name} />))

        const name = bookmark.recipe_name.length > 25 ? bookmark.recipe_name.slice(0, 22) + '...' : bookmark.recipe_name;

        return (
            <TouchableOpacity key={i} style={styles.recetteContent} onPress={() => navigation.navigate('Recipe', { id: bookmark.id_recipe })}>
                <View style={styles.pictureContainer}>
                    <Image source={{ uri: bookmark.recipe_picture }} style={styles.picture} ></Image>
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


    return (
        <ScrollView >
            <View style={styles.recetteContainer}>
                {content}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    recipeImage: {
        width: 25,
        height: 25,
        margin: '2%',
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
    iconsContainer: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    icons: {
        flexDirection: 'row',
    },
    recette: {
        fontFamily: 'Inter',
        color: 'black',
        fontWeight: 'medium',
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
});
