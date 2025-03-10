import { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import { login } from "../reducers/user";
import { useDispatch } from "react-redux";
import { FontAwesome } from "react-native-vector-icons";

export default function Signup({ navigation }) {

  const dispatch = useDispatch();
  const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const createAlert = (alertMsg) => {
    Alert.alert('Error', alertMsg, [
      { text: 'OK' },
    ]);
  };

  const addUser = () => {
    fetch(`http://${IPADRESS}:3000/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ username: data.username, token: data.token }));
          setUsername("");
          setEmail("");
          setPassword("");
          navigation.navigate("Restriction");
        } else {
          if (typeof data.error == "object") {
            createAlert(data.error[0].msg);
          } else {
            createAlert(data.error);
          }
        }
      });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/bonhome.jpg")}
      ></Image>
      <Text style={styles.text}>
        Ceate an account to save your restrictions and favorite recipes!
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(value) => setUsername(value)}
        value={username}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        keyboardType="email-address"
      ></TextInput>
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry={!showPassword}
        autoCapitalize={"none"}
      >
      </TextInput>
      <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="grey" />
        </TouchableOpacity>
        </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => addUser()}
      >
        <Text style={styles.textButton}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF9EF",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    margin: 20,
    height: 160,
  },
  text: {
      fontFamily: 'inter',
      fontSize: 20,
      fontWeight: 'medium',
      margin: 40,
      textAlign: 'center',
      paddingLeft: 10,
      textShadowColor: '#B4D4B9',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
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
    backgroundColor: "#1A6723",
    width: "80%",
    padding: 16,
    borderRadius: 10,
    margin: 50,
  },
  textButton: {
    color: "white",
    textAlign: "center",
  },
});
