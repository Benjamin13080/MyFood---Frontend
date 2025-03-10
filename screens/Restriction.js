import React, { use } from "react";
import { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggleDiet } from "../reducers/user";



export default function Restriction({ navigation }) {
	const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
	const dispatch = useDispatch();
	const username = useSelector((state) => state.user.value.username);
	const user = useSelector((state) => state.user.value);
	const [diets, setDiets] = useState([]);

	useEffect(() => {
		fetch(`http://${IPADRESS}:3000` + '/diets')
			.then(response => response.json())
			.then(data => {
				if (data?.result) {
					setDiets(data.diets)
				}
			})
	}, []);

	const dietIcons = {
		muscleGain: require("../assets/barbell.png"),
		healthy: require("../assets/scale.png"),
		glutenFree: require("../assets/no-gluten.png"),
		pregnant: require("../assets/pregnant.png"),
		vegetarian: require("../assets/vegeterian.png")
	};

	const createAlert = (alertMsg) => {
		Alert.alert('Error', alertMsg, [
			{ text: 'OK' },
		]);
	};

	const handlePress = (dietName) => {
		dispatch(toggleDiet(dietName));
	}

	const handlePressContinue = () => {
		if (!user.token) {
			navigation.navigate('TabNavigator', { screen: 'Regime' });
			return;
		}
		const fieldsBody = user.diets.join(',');
		fetch(`http://${IPADRESS}:3000` + '/users/diets/' + user.token, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fields: fieldsBody }),
		})
			.then(response => response.json())
			.then(data => {
				if (data.result) {
					navigation.navigate('TabNavigator', { screen: 'Regime' });
				} else {
					createAlert(data.error);
				}
			})
			.catch(error => console.error(error));
	}



	dietsContent = diets.map((diet, i) => {
		const styleButton = user.diets.includes(diet.prop) ? [styles.buttonDiet, styles.active] : styles.buttonDiet;
		return (
			<TouchableOpacity key={i} style={styleButton} onPress={() => handlePress(diet.prop)}>
				<Image source={dietIcons[diet.prop]} style={{ width: 40, height: 40 }} />
				<Text style={styles.text}>{diet.name}</Text>
			</TouchableOpacity>
		)
	})

	const connected = () => {
		if (!user.token) {
			return <Text style={styles.title}>What are your dietary preferences?</Text>
				;
		} else {
			return <Text style={styles.title}>Welcome <Text style={styles.username}>{username}</Text>, what are your dietary preferences?</Text>;
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.logo}>
				<Image source={require("../assets/restriction-logo.png")} />
			</View>
			<View >
				{connected()}
			</View>
			<View style={styles.allButtons}>
				{dietsContent}
			</View>
			<TouchableOpacity style={styles.button} onPress={handlePressContinue}>
				<Text style={styles.textBtn}>Continue</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#eff9f0",
		alignItems: "center",
	},
	logo: {
		marginTop: '5%',
	},
	title: {
		fontFamily: 'inter',
		fontSize: 20,
		fontWeight: 'medium',
		margin: 30,
		textAlign: 'center',
		paddingLeft: 10,
		textShadowColor: '#B4D4B9',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 1,
	},
	username: {
		fontWeight: 'bold',
		fontSize: 25,
		fontStyle: 'italic',
	},
	allButtons: {
		alignItems: "center",
		width: '100%'
	},
	buttonDiet: {
		alignItems: "center",
		padding: 10,
		width: "80%",
		backgroundColor: "white",
		borderRadius: 5,
		margin: 8,
		flexDirection: "row",
		borderWidth: 2,
		borderColor: "#85cb85",
	},
	active: {
		backgroundColor: "#85cb85",
	},
	button: {
		alignItems: "center",
		padding: 10,
		width: "80%",
		backgroundColor: "#33652C",
		borderRadius: 5,
		margin: 10,
		flexDirection: "row",
		height: 56,
	},
	textBtn: {
		flex: 1,
		color: "white",
		fontFamily: "Inter",
		textAlign: 'center',
	},
	text: {
		flex: 1,
		color: "black",
		fontFamily: "Inter",
		textAlign: 'center',
		paddingRight: 35,
	},
	logoSize: {
		width: 50,
		height: 50,
		alignSelf: "flex-start",
	},
});
