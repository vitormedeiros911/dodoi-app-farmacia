import { Colors } from "@/constants/Colors";
import { ColorSchemeName, StyleSheet } from "react-native";

export const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    form: {
      flex: 1,
      paddingBottom: 20,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    inputContainer: {
      flex: 1,
      marginRight: 8,
    },

    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },

    label: {
      fontSize: 16,
      marginBottom: 5,
    },

    saveButton: {
      width: 120,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      marginVertical: 20,
      backgroundColor: Colors.mainColor,
      paddingHorizontal: 12,
      borderRadius: 6,
    },

    error: {
      color: Colors.error,
      fontSize: 12,
      marginBottom: 5,
    },
  });
