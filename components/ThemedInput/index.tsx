import React, { forwardRef } from "react";
import { ComponentProps } from "react";
import { TextInput, useColorScheme } from "react-native";

import { ThemedView } from "../ThemedView";
import { createStyles } from "./styles";
import { Colors } from "@/constants/Colors";

type ThemedInputProps = {
  style?: any;
} & ComponentProps<typeof TextInput>;

const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  ({ style, ...rest }, ref) => {
    const colorScheme = useColorScheme();
    const styles = createStyles(colorScheme);

    return (
      <ThemedView style={[styles.container, style]}>
        <TextInput
          ref={ref}
          style={styles.input}
          {...rest}
          multiline={rest.multiline ?? false}
          numberOfLines={rest.numberOfLines ?? 1}
          scrollEnabled={rest.multiline}
          placeholderTextColor={Colors[colorScheme ?? "light"].lightText}
        />
      </ThemedView>
    );
  }
);

export default ThemedInput;
