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

export default function Signup({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAlert = (alertMsg) => {
    Alert.alert('Error', alertMsg, [
      { text: 'OK' },
    ]);
  };

  const addUser = () => {
    fetch("http://192.168.1.192:3000/users/signup", {
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry={true}
        autoCapitalize={"none"}
      ></TextInput>
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
    margin: 30,
    height: 160,
  },
  text: {
    fontFamily: "inter",
    fontSize: 16,
    fontWeight: "light",
    margin: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 16,
    width: "80%",
    margin: 10,
    borderWidth: 2,
    borderColor: "#6DCD7D",
    borderRadius: 10,
    borderStyle: "solid",
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
