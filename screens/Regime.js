import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from "react-native";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Regime() {
  const user = useSelector((state) => state.user.value);
	const IPADRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

  const [isActive, setIsActive] = useState(true);
  const [diet, setDiet] = useState(null);

  const dietIcons = {
    muscleGain: require("../assets/barbell.png"),
    healthy: require("../assets/scale.png"),
    glutenFree: require("../assets/no-gluten.png"),
    pregnant: require("../assets/pregnant.png"),
    vegetarian: require("../assets/vegeterian.png")
  };

  useEffect(() => {
    fetch(`http://${IPADRESS}:3000` + '/diets')
			.then(response => response.json())
			.then(data => {
				if (data?.result) {
          const diet = data.diets.find(diet => diet.prop == user.diet);
					setDiet(diet);
				}
			})
  }, [user.diet])


  let yesImage = <FontAwesome name="thumbs-o-up" size={40} color="#6DCD7D" />;
  let noImage = <FontAwesome name="thumbs-o-down" size={40} color="grey" />;
  let content = diet?.yes.map((food, i) => {
    return <Text key={i}>{food}</Text>;
  });
  if (!isActive) {
    yesImage = <FontAwesome name="thumbs-o-up" size={40} color="grey" />;
    noImage = <FontAwesome name="thumbs-o-down" size={40} color="#6DCD7D" />;
    content = diet?.no.map((food, i) => {
      return (
        <Text key={i} style={styles.food}>
          {food}
        </Text>
      );
    });
  }

  if (!diet) {
    return (<View style={styles.container}>
      <Text>Loading...</Text>
    </View>)
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Image source={dietIcons[diet.prop]} style={styles.icon}></Image>
        <Text style={styles.text}>{diet.name}</Text>
      </View>
      <View style={styles.onglets}>
        <TouchableOpacity
          style={styles.yesNoContainer}
          onPress={() => setIsActive(true)}
        >
          {yesImage}
          <Text style={styles.yesText}>{diet.yesString}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.yesNoContainer}
          onPress={() => setIsActive(false)}
        >
          {noImage}
          <Text style={styles.yesText}>{diet.noString}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.alimentsList}>{content}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF9EF",
    alignItems: "center",
  },
  icon: {
    height: 48,
    width: 48,
    resizeMode: "contain",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    margin: "20%",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "inter",
    paddingLeft: 10,
    textShadowColor: "#B4D4B9",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  yesNoContainer: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  onglets: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#B4D4B9",
    alignItems: "center",
    padding: 10,
  },
  yesText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "inter",
    color: "white",
    paddingLeft: "2%",
    paddingRight: "15%",
  },
  food: {
    fontFamily: "Inter",
  },
  image: {
    width: 50,
    height: 50,
  },
  alimentsList: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    margin: "10%",
    borderRadius: 10,
  },
});
