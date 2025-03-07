import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../reducers/user";
import SavedRecipes from "./SavedRecipes";

export default function Profile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;
  const token = useSelector((state) => state.user.value.token);
  const diet = useSelector((state) => state.user.value.diet);
  const [modalDeleteAccount, setModalDeleteAccount] = useState(false);
  const [modalChangeEmail, setModalChangeEmail] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [bookmarksOpen, setBookmarksOpen] = useState(true);

  const handleClickTab = (tab) => {
    console.log("click", bookmarksOpen);
    tab == "bookmarks" ? setBookmarksOpen(true) : setBookmarksOpen(false);
  };

  {
    /* ----------------UPDATE PASSWORD--------------- */
  }
  const handleUpdatePassword = () => {
    fetch(`http://${IPADRESS}:3000/users/password/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Success", "Your password has been updated.", [
            {
              text: "OK",
            },
          ]);
        } else {
          Alert.alert("Error", data.error);
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Failed to update password. Please try again later."
        );
      });
  };
  {
    /* ----------------UPDATE EMAIL--------------- */
  }

  const handleUpdateEmail = () => {
    fetch(`http://${IPADRESS}:3000/users/email/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }), // Send the new email in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Success", "Your email has been updated.", [
            {
              text: "OK", //button of confirmation
            },
          ]);
        } else {
          Alert.alert("Error", data.error);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to update email. Please try again later.");
      });
  };

  {
    /* ----------------LOGOUT--------------- */
  }
  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({ index: 0, routes: [{ name: "Signin" }] });
  };
  {
    /* ----------------DELETE ACCOUNT--------------- */
  }
  const handleDeleteAccount = () => {
    fetch(`http://${IPADRESS}:3000/users/${token}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert("Success", "Your account has been deleted.", [
            {
              text: "OK",
              onPress: () => {
                // Change the user state in reducer to null
                dispatch(logout());
                // Navigate to the Signin page
                navigation.navigate("Signin");
              },
            },
          ]);
        } else {
          Alert.alert("Error", data.error);
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Failed to delete account. Please try again later."
        );
      });
  };

  return (
    <View style={styles.container}>
      {/* ----------------MODAL EDIT PASSWORD--------------- */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalChangePassword}
        onRequestClose={() => {
          setModalChangePassword(!modalChangePassword);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please enter your old password and new password to update
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Old password"
              secureTextEntry={true}
              onChangeText={(text) => setOldPassword(text)}
              value={oldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry={true}
              onChangeText={(text) => setNewPassword(text)}
              value={newPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalChangePassword(!modalChangePassword)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  setModalChangePassword(!modalChangePassword);
                  handleUpdatePassword();
                  setOldPassword("");
                  setNewPassword("");
                }}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ----------------MODAL EDIT EMAIL--------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalChangeEmail}
        onRequestClose={() => {
          setModalChangeEmail(!modalChangeEmail);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please enter your new email to update
            </Text>
            <TextInput
              style={styles.input}
              placeholder="New email"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalChangeEmail(!modalChangeEmail)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  setModalChangeEmail(!modalChangeEmail);
                  handleUpdateEmail();
                  setEmail("");
                }}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/*----------- MODAL DELETE ACCOUNT----------------  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDeleteAccount}
        onRequestClose={() => {
          setModalDeleteAccount(!modalDeleteAccount);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please enter your password to confirm
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalDeleteAccount(!modalDeleteAccount)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  setModalDeleteAccount(!modalDeleteAccount);
                  handleDeleteAccount();
                  setPassword("");
                }}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View>
        <Text style={styles.myProfile}>Profile</Text>
      </View>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => handleClickTab("bookmarks")}>
          {bookmarksOpen ? (
            <Text style={[styles.navBarText, styles.activeLink]}>
              Saved recipes
            </Text>
          ) : (
            <Text style={styles.navBarText}>Saved recipes</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClickTab("settings")}>
          {!bookmarksOpen ? (
            <Text style={[styles.navBarText, styles.activeLink]}>Settings</Text>
          ) : (
            <Text style={styles.navBarText}>Settings</Text>
          )}
        </TouchableOpacity>
      </View>
      {bookmarksOpen ? (
        <SavedRecipes />
      ) : (
        <>
          <View>
            <TouchableOpacity style={[styles.dietbtn, styles.active]}>
              <Image
                source={require("../assets/barbell.png")}
                style={styles.icon}
              />
              <Text style={styles.dietText}>Muscle gain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dietbtn}>
              <Image
                source={require("../assets/scale.png")}
                style={styles.icon}
              />
              <Text style={styles.dietText}>Healthy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dietbtn}>
              <Image
                source={require("../assets/no-gluten.png")}
                style={styles.icon}
              />
              <Text style={styles.dietText}>Gluten free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dietbtn}>
              <Image
                source={require("../assets/pregnant.png")}
                style={styles.logoSize}
              />
              <Text style={styles.dietText}>Pregnant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dietbtn}>
              <View>
                <Image
                  source={require("../assets/vegeterian.png")}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.dietText}>Vegetarian</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.allButtons}>
            <TouchableOpacity style={styles.button}>
              <Text
                style={styles.text}
                onPress={() => setModalChangeEmail(true)}
              >
                Edit mail
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalChangePassword(true)}
            >
              <Text style={styles.text}>Edit password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalDeleteAccount(true)}
            >
              <Text style={styles.text}>Delete account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EDF9EF",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },

  myProfile: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "inter",
    paddingLeft: 10,
    textShadowColor: "green",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  navBar: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#bad3bb",
  },
  navBarText: {
    fontWeight: "bold",
    color: "white",
    padding: 15,
  },
  activeLink: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
    paddingBottom: 5,
  },
  allButtons: {
    alignItems: "center",
    width: "100%",
  },
  button: {
    alignItems: "center",
    padding: 10,
    width: "80%",
    backgroundColor: "#33652C",
    borderRadius: 5,
    margin: 8,
    flexDirection: "row",
  },
  text: {
    flex: 1,
    color: "white",
    fontFamily: "Inter",
    textAlign: "center",
  },
  dietText: {
    flex: 1,
    color: "black",
    fontFamily: "Inter",
    textAlign: "center",
    paddingRight: 35,
  },
  logoSize: {
    width: 30,
    height: 30,
    alignSelf: "flex-start",
  },
  dietbtn: {
    alignItems: "center",
    padding: 5,
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
  icon: {
    width: 30,
    height: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: "100%",
    border: "1px solid grey",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonCancel: {
    backgroundColor: "#DDDDDD",
    marginRight: 10,
    flex: 1,
  },
  buttonConfirm: {
    backgroundColor: "#FF0000",
    flex: 1,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
