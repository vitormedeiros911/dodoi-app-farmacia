import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

import { ThemedText } from "../ThemedText";
import { createStyles } from "./styles";

type ListItemProps = {
  onEditPress: () => void;
  onDeletePress: () => void;
  children: React.ReactNode;
  style: any;
};

export default function SwipeableListItem({
  children,
  style,
  onDeletePress,
  onEditPress,
}: ListItemProps) {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const getLeftContent = () => {
    return (
      <RectButton style={styles.leftContent} onPress={onEditPress}>
        <Ionicons name="create-outline" size={24} color={Colors.mainColor} />
        <ThemedText
          style={[
            styles.text,
            {
              color: Colors.mainColor,
            },
          ]}
        >
          Editar
        </ThemedText>
      </RectButton>
    );
  };

  const getRightContent = () => {
    return (
      <RectButton style={styles.rightContent} onPress={onDeletePress}>
        <Ionicons name="trash-outline" size={24} color={Colors.error} />
        <ThemedText
          style={[
            styles.text,
            {
              color: Colors.error,
            },
          ]}
        >
          Excluir
        </ThemedText>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderRightActions={getRightContent}
      renderLeftActions={getLeftContent}
      friction={2.5}
    >
      <View style={[styles.container, style]}>{children}</View>
    </Swipeable>
  );
}
