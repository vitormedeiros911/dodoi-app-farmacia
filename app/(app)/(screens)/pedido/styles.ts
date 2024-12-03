import { Colors } from "@/constants/Colors";
import { ColorSchemeName, StyleSheet } from "react-native";

export const createColorScheme = (
  colorScheme: ColorSchemeName,
  statusPedido: string
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      padding: 20,
    },

    subTitle: {
      fontSize: 16,
      marginTop: 10,
      fontWeight: "bold",
    },

    clientInfo: {
      fontSize: 14,
      lineHeight: 18,
      color: Colors[colorScheme ?? "light"].lightText,
    },

    list: {
      flex: 1,
      marginTop: 10,
    },

    listItem: {
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
    },

    listItemImage: {
      width: 90,
      height: 90,
      borderRadius: 10,
    },

    listItemDescription: {
      flex: 1,
      marginLeft: 16,
    },

    title: {
      fontSize: 24,
      fontWeight: "bold",
    },

    detailsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: 20,
    },

    detailsText: {
      fontSize: 14,
      lineHeight: 20,
    },

    footer: {
      backgroundColor: Colors[colorScheme ?? "light"].background,
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: Colors[colorScheme ?? "light"].border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        statusPedido === "EM_SEPARACAO" || "ENVIADO"
          ? "flex-end"
          : "space-between",
      position: "relative",
      bottom: 0,
      width: "100%",
    },

    footerText: {
      fontSize: 14,
      color: Colors[colorScheme ?? "light"].lightText,
    },

    cancelButton: {
      backgroundColor: Colors.error,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginRight: "auto",
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
