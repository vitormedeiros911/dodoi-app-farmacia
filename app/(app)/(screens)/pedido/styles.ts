import { Colors } from "@/constants/Colors";
import { ColorSchemeName, StyleSheet } from "react-native";

export const createColorScheme = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },

    list: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    listItem: {
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
    },

    listItemImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
    },

    listItemDescription: {
      flex: 1,
      marginLeft: 16,
    },

    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20,
      marginLeft: 20,
    },

    detailsTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },

    detailsText: {
      fontSize: 14,
    },

    footer: {
      backgroundColor: Colors[colorScheme ?? "light"].background,
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: Colors[colorScheme ?? "light"].border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      bottom: 0,
      width: "100%",
    },

    cancelButton: {
      backgroundColor: Colors.error,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },

    acceptButton: {
      backgroundColor: Colors.mainColor,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },

    buttonText: {
      textAlign: "center",
      fontSize: 14,
      color: "white",
    },
  });
