import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { colors } from "../../theme/colors";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "one",
    title: "Smart Bluetooth Attendance",
    text: "Attendance is marked automatically when you're near your lecturer's Bluetooth beacon.",
    logo: require("../../images/logo.png"),
    mainIcon: require("../../images/1.png"),
    backgroundColor: "#EEF1F9",
  },
  {
    key: "two",
    title: "Seamless and Fast",
    text: "No scanning or typing needed — your presence is detected securely within seconds.",
    logo: require("../../images/logo.png"),
    mainIcon: require("../../images/2.png"),
    backgroundColor: "#F5F5FA",
  },
  {
    key: "three",
    title: "Track & Analyze Instantly",
    text: "Lecturers can view analytics and students can track attendance history.",
    logo: require("../../images/logo.png"),
    mainIcon: require("../../images/3.png"),
    backgroundColor: "#EEF0FF",
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <Swiper
      loop={false}
      showsButtons={false}
      activeDotColor={colors.accent}
      dotColor="#C7C8CC"
      paginationStyle={{ bottom: 60 }}
    >
      {slides.map((slide, index) => (
        <View key={slide.key} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
          <View style={styles.logoContainer}>
            <Image source={slide.logo} style={styles.logoImage} resizeMode="contain" />
          </View>
          
          <View style={styles.mainIconContainer}>
            <Image source={slide.mainIcon} style={styles.mainIcon} resizeMode="contain" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>

            {index === slides.length - 1 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Landing" as never)}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  mainIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.5,
    marginBottom: 40,
  },
  mainIcon: {
    width: width * 0.7,
    height: height * 0.3,
  },
  textContainer: {
    position: "absolute",
    bottom: 120,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});