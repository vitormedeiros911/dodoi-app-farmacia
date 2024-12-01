import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PedidosTab from "./index";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const Tab = createMaterialTopTabNavigator();

const PedidosLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarActiveTintColor: Colors.mainColor,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          paddingTop: Platform.OS === "ios" ? 30 : 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.mainColor,
          height: 3,
        },
      }}
    >
      <Tab.Screen
        name="Pendentes"
        options={{
          tabBarLabel: "Em andamento",
        }}
        children={() => (
          <PedidosTab
            status={["PENDENTE", "EM_SEPARACAO", "ENVIADO"]}
            title="Pedidos em andamento"
          />
        )}
      />
      <Tab.Screen
        name="Histórico"
        options={{
          title: "Histórico",
        }}
        children={() => (
          <PedidosTab
            status={["ENTREGUE", "CANCELADO"]}
            title="Histórico de pedidos"
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default PedidosLayout;
