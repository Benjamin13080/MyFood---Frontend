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
                console.log(data);
                data.result && setBookmarks(data.bookmarks);
            })

    }, []);

    const content = bookmarks.length == 0 ? <Text style={styles.loading}>Loading...</Text> : bookmarks.map((bookmark, i) => {
        console.log(bookmark);
        const icons = dietIcons.filter(diet => bookmark[diet.name])
            .map((diet, i) => (<Image key={i} style={styles.recipeImage} source={diet.img} alt={diet.name} />))

        const name = bookmark.recipe_name.length > 25 ? bookmark.recipe_name.slice(0, 22) + '...' : bookmark.recipe_name;

        return (
            <TouchableOpacity key={i} style={styles.recetteContainer} onPress={() => navigation.navigate('Recipe', { id: bookmark.id_recipe })}>
                <View style={styles.iconsContainer}>
                    {icons}
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.recette} numberOfLines={1}>{name}</Text>
                    <Icon name="bookmark" size={22} color="#6DCD7D" style={styles.icon} />
                </View>
            </TouchableOpacity>
        )
    })


    return (
        <View style={styles.container}>
            <ScrollView>
                {content}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#EDF9EF',
        overflow: 'scroll',
        paddingBottom: '10%',
    },
    recipeImage: {
        width: 25,
        height: 25,
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
    recette: {
        fontFamily: 'Inter',
        color: 'white',
        fontWeight: 'medium',
    },
});
