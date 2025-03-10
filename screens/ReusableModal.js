import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Modals({
  visible,
  onRequestClose,
  title,
  placeholder,
  onConfirm,
  onCancel,
  inputValue,
  setInputValue,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={placeholder.toLowerCase().includes("password")}
            onChangeText={setInputValue}
            value={inputValue}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onCancel}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={onConfirm}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "45%",
    padding: 10,
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: "gray",
  },
  buttonConfirm: {
    backgroundColor: "green",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
