import React, { useState } from "react";
import { Text, TouchableOpacity, FlatList, Modal, View } from "react-native";
import { useColorScheme } from "react-native";
import { ThemedView } from "../ThemedView";
import { createStyles } from "./styles";
import { Colors } from "@/constants/Colors";

type Option = {
  label: string;
  value: string | number;
};

type ThemedSelectProps = {
  options: Option[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  style?: any;
};

const ThemedSelect = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Selecione uma opção",
  style,
}: ThemedSelectProps) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [isModalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find(
    (option) => option.value === selectedValue
  )?.label;

  return (
    <>
      <ThemedView style={[styles.container, style]}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ flex: 1 }}
        >
          <Text
            style={[
              styles.input,
              {
                color: selectedLabel
                  ? Colors[colorScheme ?? "light"].text
                  : Colors[colorScheme ?? "light"].lightText,
              },
            ]}
          >
            {selectedLabel || placeholder}
          </Text>
        </TouchableOpacity>
      </ThemedView>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
              borderRadius: 8,
              width: "90%",
              maxHeight: "50%",
              padding: 16,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors[colorScheme ?? "light"].lightText,
                  }}
                >
                  <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 12,
                alignItems: "center",
                backgroundColor: Colors.error,
                borderRadius: 4,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ThemedSelect;
