import { View, Text, StyleSheet } from "react-native";


export default function Settings({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Settings</Text>
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
})