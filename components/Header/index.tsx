import defaultUserImg from "@/assets/images/defaultUserImg.png";
import { Colors } from "@/constants/Colors";
import { UserDto } from "@/dto/UserDto";
import { useHeader } from "@/hooks/useHeader";
import getFirstName from "@/utils/getFirstName";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Animated, TouchableOpacity, useColorScheme } from "react-native";

import ImageWithFallback from "../ImageWithFallback";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { createStyles } from "./styles";

type HeaderProps = {
  user: UserDto;
};

export default function Header({ user }: HeaderProps) {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const { headerContent, backIndicator } = useHeader();
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.firstRow}>
        {backIndicator ? (
          <TouchableOpacity onPress={() => router.replace("/(app)/(tabs)/")}>
            <Ionicons name="arrow-back" size={24} color={Colors.mainColor} />
          </TouchableOpacity>
        ) : (
          <ThemedView style={styles.userInfoContainer}>
            <TouchableOpacity onPress={() => router.navigate("/perfil-menu")}>
              <ImageWithFallback
                source={{ uri: user.avatar }}
                fallbackSource={defaultUserImg}
                style={styles.userImg}
              />
            </TouchableOpacity>
            <ThemedText style={styles.userName}>
              Olá, {getFirstName(user.nome)}
            </ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.menuItens}>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      {headerContent}
    </ThemedView>
  );
}
