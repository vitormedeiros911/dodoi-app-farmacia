import { Colors } from "@/constants/Colors";
import { ColorSchemeName, StyleSheet } from "react-native";

export const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 6,
      padding: 12,
      backgroundColor: Colors[colorScheme ?? "light"].backgroundSecondary,
    },
    input: {
      flex: 1,
      color: colorScheme === "light" ? "#000" : "#fff",
      fontSize: 14,
      overflow: "hidden",
    },
    modalBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999999,
    },
    modalContainer: {
      backgroundColor: Colors[colorScheme ?? "light"].background,
      borderRadius: 8,
      width: "90%",
      maxHeight: "50%",
      padding: 16,
      zIndex: 10000,
    },
    option: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? "light"].lightText,
    },
    optionText: {
      color: Colors[colorScheme ?? "light"].text,
    },
    cancelButton: {
      padding: 12,
      alignItems: "center",
      backgroundColor: Colors.error,
      borderRadius: 4,
      marginTop: 10,
    },
    cancelButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
