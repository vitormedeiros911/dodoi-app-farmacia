import ImageWithFallback from "@/components/ImageWithFallback";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { formatBRL } from "@/utils/formatBRL";
import { showToast } from "@/utils/showToast";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";

import { createColorScheme } from "./styles";

interface IPedido {
  id: string;
  status: string;
  total: number;
  codigo: string;
  createdAt: Date;
  itens: {
    idProduto: string;
    nomeProduto: string;
    precoUnitario: number;
    quantidade: number;
    urlImagem: string;
  }[];
}

const MemoizedListItem = React.memo(ListItem);
const MemoizedImageWithFallback = React.memo(ImageWithFallback);

export default function Pedidos() {
  const [refreshing, setRefreshing] = useState(false);
  const [pedido, setPedido] = useState<IPedido>({} as IPedido);

  const colorScheme = useColorScheme();
  const styles = createColorScheme(colorScheme);
  const { startLoading, stopLoading } = useLoading();
  const { setBackIndicator } = useHeader();

  const { idPedido } = useLocalSearchParams();

  const getPedido = async () => {
    try {
      const response = await api.get(`pedido/${idPedido}`);

      setPedido(response.data);
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    }
  };

  const handleAceitarPedido = async () => {
    try {
      startLoading();
      await api.patch(`pedido/${idPedido}/aceitar`);
      showToast("Pedido aceito com sucesso!", "success");
      await getPedido();
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const handleCancelarPedido = async () => {
    try {
      startLoading();
      await api.patch(`pedido/${idPedido}/cancelar`);
      showToast("Pedido cancelado com sucesso!", "success");
      await getPedido();
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getPedido();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      await getPedido();
      stopLoading();
    };

    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBackIndicator(true);

      return () => {
        setBackIndicator(false);
      };
    }, [setBackIndicator])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>#{pedido.codigo}</ThemedText>
      <FlatList
        data={pedido.itens}
        keyExtractor={(item) => item.idProduto}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: produto }) => (
          <MemoizedListItem style={styles.listItem}>
            <MemoizedImageWithFallback
              source={{ uri: produto.urlImagem }}
              fallbackSource={require("@/assets/images/remedioGenericoImg.jpg")}
              style={styles.listItemImage}
            />
            <View style={styles.listItemDescription}>
              <ThemedText style={styles.detailsTitle}>
                {produto.nomeProduto}
              </ThemedText>

              <ThemedText style={styles.detailsText}>
                Quantidade: {produto.quantidade}
              </ThemedText>
              <ThemedText style={styles.detailsText}>
                {formatBRL(produto.precoUnitario)}
              </ThemedText>
            </View>
          </MemoizedListItem>
        )}
      />

      <ThemedView style={styles.footer}>
        +++
        {pedido.status === "PENDENTE" && (
          <>
            <TouchableOpacity
              onPress={handleCancelarPedido}
              style={styles.cancelButton}
            >
              <ThemedText style={styles.buttonText}>Cancelar pedido</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAceitarPedido}
              style={styles.acceptButton}
            >
              <ThemedText style={styles.buttonText}>Aceitar pedido</ThemedText>
            </TouchableOpacity>
          </>
        )}
        {pedido.status === "EM_SEPARACAO" && (
          <TouchableOpacity
            onPress={handleAceitarPedido}
            style={styles.acceptButton}
          >
            <ThemedText style={styles.buttonText}>Iniciar entrega</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
}
