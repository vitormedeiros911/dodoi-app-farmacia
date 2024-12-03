import ImageWithFallback from "@/components/ImageWithFallback";
import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { formatBRL, formatBRLWithCents } from "@/utils/formatBRL";
import { showToast } from "@/utils/showToast";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";

import { createColorScheme } from "./styles";

interface IPedido {
  id: string;
  total: number;
  codigo: string;
  createdAt: Date;
  cliente: {
    nome: string;
    endereco: string;
    telefone: string;
  };
  itens: {
    idProduto: string;
    nomeProduto: string;
    precoUnitario: number;
    quantidade: number;
    urlImagem: string;
  }[];
  historicoStatus: {
    status: string;
    data: Date;
  }[];
}

const MemoizedListItem = React.memo(ListItem);
const MemoizedImageWithFallback = React.memo(ImageWithFallback);

export default function Pedidos() {
  const [refreshing, setRefreshing] = useState(false);
  const [pedido, setPedido] = useState<IPedido>({
    codigo: "0000000000",
    total: 0,
  } as IPedido);
  const [statusPedido, setStatusPedido] = useState("");

  const colorScheme = useColorScheme();
  const styles = createColorScheme(colorScheme, statusPedido);
  const { startLoading, stopLoading } = useLoading();
  const { setBackIndicator } = useHeader();

  const { idPedido } = useLocalSearchParams();

  const getPedido = async () => {
    try {
      const response = await api.get(`pedido/${idPedido}`);

      setPedido(response.data);
    } catch (error: any) {
      showToast(error.response?.data?.message, "error");
    }
  };

  const handleAceitarPedido = async () => {
    try {
      startLoading();
      await api.patch(`pedido/${idPedido}/aceitar`);
      showToast("Pedido aceito com sucesso!", "success");
      router.navigate("pedidos");
    } catch (error: any) {
      showToast(error.response?.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const handleCancelarPedido = async () => {
    try {
      startLoading();
      await api.patch(`pedido/${idPedido}/cancelar`);
      router.navigate("pedidos");
      showToast("Pedido cancelado com sucesso!", "success");
    } catch (error: any) {
      showToast(error.response?.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const handleIniciarEntrega = async () => {
    try {
      startLoading();
      await api.patch(`pedido/${idPedido}/iniciar-entrega`);
      router.navigate("pedidos");
    } catch (error: any) {
      showToast(error.response?.data.message, "error");
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

  useEffect(() => {
    if (pedido.historicoStatus) {
      const status =
        pedido.historicoStatus[pedido.historicoStatus.length - 1].status;
      setStatusPedido(status);
    }
  }, [pedido]);

  useFocusEffect(
    useCallback(() => {
      setBackIndicator(true);

      return () => {
        setBackIndicator(false);
      };
    }, [setBackIndicator])
  );

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Pedido #{pedido.codigo}</ThemedText>

        <ThemedText style={styles.subTitle}>
          Total: {formatBRLWithCents(pedido.total)}
        </ThemedText>

        <ThemedText style={styles.subTitle}>Dados do cliente</ThemedText>
        <ThemedText style={styles.clientInfo}>
          Nome: {pedido.cliente?.nome}
        </ThemedText>
        <ThemedText style={styles.clientInfo}>
          Endereço: {pedido.cliente?.endereco}
        </ThemedText>
        <ThemedText style={styles.clientInfo}>
          Telefone: {pedido.cliente?.telefone}
        </ThemedText>
        <ThemedText style={styles.subTitle}>Produtos</ThemedText>
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
                <ThemedText
                  style={styles.detailsTitle}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
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
      </ThemedView>
      <ThemedView style={styles.footer}>
        {statusPedido === "PENDENTE" && (
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
        {statusPedido === "EM_SEPARACAO" && (
          <TouchableOpacity
            onPress={handleIniciarEntrega}
            style={[styles.acceptButton, { alignSelf: "flex-end" }]}
          >
            <ThemedText style={styles.buttonText}>Iniciar entrega</ThemedText>
          </TouchableOpacity>
        )}
        {statusPedido === "ENVIADO" && (
          <ThemedText style={styles.footerText}>
            Pedido enviado para entrega
          </ThemedText>
        )}
      </ThemedView>
    </>
  );
}
