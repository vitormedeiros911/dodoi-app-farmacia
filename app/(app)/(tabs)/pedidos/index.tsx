import ListItem from "@/components/ListItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { formatBRLWithCents } from "@/utils/formatBRL";
import { formatDateTime } from "@/utils/formatDate";
import { showToast } from "@/utils/showToast";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ColorSchemeName,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";

const MemoizedListItem = React.memo(ListItem);

interface IPedido {
  id: string;
  status: string;
  codigo: string;
  total: number;
  createdAt: Date;
}

interface Props {
  status: string[];
  title: string;
}

export default function PedidosTab({ status, title }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const { startLoading, stopLoading } = useLoading();
  const colorScheme = useColorScheme();
  const styles = createColorScheme(colorScheme);
  const { session } = useAuth();

  const limit = 10;

  const getPedidos = async (page: number = 0, append: boolean = false) => {
    try {
      const response = await api.get("pedido", {
        params: {
          status,
          idFarmacia: session.user.idFarmacia,
          limit,
          skip: page * limit,
          orderBy: "createdAt",
          order: "DESC",
        },
      });

      const { pedidos: newPedidos, total: totalRecords } = response.data;

      setTotal(totalRecords);
      setPedidos((prevPedidos) =>
        append ? [...prevPedidos, ...newPedidos] : newPedidos
      );
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Erro ao carregar pedidos",
        "error"
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getPedidos(0);
    setPage(0);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || pedidos.length >= total) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await getPedidos(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      await getPedidos();
      stopLoading();
    };

    fetchData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.subTitle}>
        Total: {total} {total === 1 ? "pedido" : "pedidos"}
      </ThemedText>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: pedido }) => (
          <MemoizedListItem
            onPress={() => router.push(`/pedido/${pedido.id}`)}
            style={styles.listItem}
          >
            <ThemedText style={styles.detailsTitle}>
              #{pedido.codigo} - {formatDateTime(pedido.createdAt, true)}
            </ThemedText>
            <ThemedText style={styles.detailsText}>
              Situação: {pedido.status}
            </ThemedText>
            <ThemedText style={styles.detailsText}>
              Total: {formatBRLWithCents(pedido.total)}
            </ThemedText>
          </MemoizedListItem>
        )}
        ListEmptyComponent={<ThemedText>Nenhum pedido encontrado</ThemedText>}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={Colors[colorScheme ?? "light"].text}
              style={styles.loadingIndicator}
            />
          ) : null
        }
      />
    </ThemedView>
  );
}

const createColorScheme = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      padding: 20,
    },

    list: {
      flex: 1,
      marginTop: 10,
    },

    listItem: {
      marginBottom: 16,
    },

    title: {
      fontSize: 24,
      fontWeight: "bold",
    },

    subTitle: {
      fontSize: 14,
    },

    detailsTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },

    detailsText: {
      fontSize: 14,
    },

    loadingIndicator: {
      marginVertical: 10,
    },
  });
