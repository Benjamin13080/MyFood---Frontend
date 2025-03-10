import { useState } from "react";
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { login, importBookmarks, toggleDiet, importDiets } from "../reducers/user";
import { FontAwesome } from "react-native-vector-icons";

export default function Signin({ navigation }) {
	const dispatch = useDispatch();
	const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const fields = ['muscleGain', 'healthy', 'pregnant', 'glutenFree', 'vegetarian'];

	const createAlert = (alertMsg) => {
		Alert.alert('Error', alertMsg, [
			{ text: 'OK' },
		]);
	};


	const handleConnection = () => {

		fetch(`http://${IPADRESS}:3000/users/signin`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					fetch(`http://${IPADRESS}:3000/bookmarks/${data.token}`)
						.then(response => response.json())
						.then(dataBookmarks => {
							// dispatch user login and token
							dispatch(login({ token: data.token, username: data.username }));
							// dispatch user bookmarks
							const bookmarks = dataBookmarks.bookmarks.map(bk => bk.id_recipe);
							dispatch(importBookmarks(bookmarks));
							// dispatch user diet
							const userDiets = fields.filter(field => data[field])
							dispatch(importDiets(userDiets));
							
							setEmail('');
							setPassword('');
							navigation.navigate('TabNavigator', { screen: 'Regime' });
						})
				} else {
					if (typeof data.error == "object") {
						createAlert(data.error[0].msg);
					} else {
						createAlert(data.error);
					}
				}
			})
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>MyFood</Text>
			<Text style={styles.connectionText}>Connection</Text>
			<Text style={styles.text}>Set your email and password</Text>
			<TextInput placeholder="Email" style={styles.input} onChangeText={(value) => setEmail(value)} value={email} keyboardType="email-address"></TextInput>
			<View style={styles.passwordContainer}>
				<TextInput
					placeholder="Password"
					style={styles.passwordInput}
					onChangeText={(value) => setPassword(value)}
					value={password}
					secureTextEntry={!showPassword}
					autoCapitalize={"none"}>
				</TextInput>
				<TouchableOpacity
					style={styles.showPasswordButton}
					onPress={() => setShowPassword(!showPassword)}
				>
					<FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="grey" />
				</TouchableOpacity>
			</View>
			<TouchableOpacity activeOpacity={0.8} style={styles.button}>
				<Text style={styles.textButton} onPress={() => handleConnection()}>Connect</Text>
			</TouchableOpacity>
			<View style={styles.link}>
				<TouchableOpacity >
					<Text style={styles.textLink} onPress={() => navigation.navigate('Signup')} >Create an account</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate('Restriction')}>
					<Text style={styles.textLink}>Continue without account</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EDF9EF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 80,
		fontWeight: 'bold',
		fontFamily: 'inter',
		textShadowColor: 'green',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 10,
		margin: 50,
	},
	connectionText: {
		fontFamily: 'inter',
		fontWeight: 'bold',
		fontSize: 16,
		margin: 10,
	},
	text: {
		fontFamily: 'inter',
		fontSize: 16,
		fontWeight: 'medium',
		margin: 5,
		fontStyle: 'italic',
	},
	input: {
		backgroundColor: 'white',
		padding: 16,
		width: '80%',
		margin: 10,
		borderWidth: 2,
		borderColor: '#6DCD7D',
		borderRadius: 10,
		borderStyle: 'solid',
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '80%',
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: '#6DCD7D',
		borderRadius: 10,
		margin: 10,
		padding: 7,
	},
	passwordInput: {
		flex: 1,
		padding: 9,
	},
	showPasswordButton: {
		padding: 10,
	},
	button: {
		backgroundColor: '#1A6723',
		width: '80%',
		padding: 16,
		borderRadius: 10,
		margin: 10,
	},
	textButton: {
		color: 'white',
		textAlign: 'center',
	},
	link: {
		flexDirection: 'row',
		padding: 10,
		margin: 10,
	},
	textLink: {
		padding: 30,
		fontFamily: 'inter',
		fontWeight: 'bold',
	}
})