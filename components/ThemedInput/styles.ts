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
  });
