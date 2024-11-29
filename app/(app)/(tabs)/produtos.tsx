import Button from "@/components/Button";
import ImageWithFallback from "@/components/ImageWithFallback";
import ListItem from "@/components/ListItem";
import SearchInput from "@/components/SearchInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { formatBRL } from "@/utils/formatBRL";
import { showToast } from "@/utils/showToast";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ColorSchemeName,
  FlatList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

interface IProduto {
  id: string;
  nome: string;
  precoUnitario: number;
  quantidadeDisponivel: number;
  urlImagem: string;
  createdAt: Date;
}

const MemoizedListItem = React.memo(ListItem);
const MemoizedImageWithFallback = React.memo(ImageWithFallback);

export default function Produtos() {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { session } = useAuth();
  const [busca, setBusca] = useState("");
  const { setHeaderContent } = useHeader();
  const limit = 10;

  const colorScheme = useColorScheme();
  const styles = createColorScheme(colorScheme);

  const getProdutos = async (
    page: number = 0,
    append: boolean = false,
    busca: string = ""
  ) => {
    try {
      const params: {
        limit: number;
        skip: number;
        orderBy: string;
        order: string;
        idFarmacia: string;
        nome?: string;
      } = {
        limit,
        skip: page * limit,
        orderBy: "createdAt",
        order: "DESC",
        idFarmacia: session.user.idFarmacia,
      };

      if (busca) params.nome = busca;

      const response = await api.get("produto", {
        params,
      });

      const { produtos: newProdutos, total: totalRecords } = response.data;

      setTotal(totalRecords);
      setProdutos((prevProdutos) =>
        append ? [...prevProdutos, ...newProdutos] : newProdutos
      );
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Erro ao carregar produtos",
        "error"
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getProdutos(0, false, busca);
    setPage(0);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || refreshing || produtos.length >= total) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      await getProdutos(nextPage, true);
      setPage(nextPage);
    } catch (error) {
      showToast("Erro ao carregar mais itens", "error");
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setHeaderContent(
        <SearchInput setBusca={setBusca} placeholder="Busque por um produto" />
      );

      return () => {
        setHeaderContent(null);
      };
    }, [setHeaderContent])
  );

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      startLoading();
      setPage(0);
      await getProdutos(0, false, value);
      stopLoading();
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(busca);
  }, [busca, debouncedSearch]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Meus produtos</ThemedText>
        <Button
          style={styles.button}
          onPress={() => router.navigate("/produto/cadastrar")}
        >
          <ThemedText>Adicionar</ThemedText>
        </Button>
      </ThemedView>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MemoizedListItem onPress={() => {}} style={styles.listItem}>
            <MemoizedImageWithFallback
              source={{ uri: item.urlImagem }}
              fallbackSource={require("@/assets/images/remedioGenericoImg.jpg")}
              style={styles.listItemImage}
            />

            <View style={styles.listItemDescription}>
              <ThemedText style={styles.detailsTitle}>{item.nome}</ThemedText>

              <ThemedText style={styles.detailsText}>
                Quantidade disponível: {item.quantidadeDisponivel}
              </ThemedText>
              <ThemedText style={styles.detailsText}>
                {formatBRL(item.precoUnitario)}
              </ThemedText>
            </View>
            <Ionicons
              name="create-outline"
              size={24}
              color={Colors.mainColor}
              style={{ marginLeft: "auto", marginRight: 20 }}
            />
          </MemoizedListItem>
        )}
        ListEmptyComponent={<ThemedText>Nenhum produto encontrado</ThemedText>}
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
      paddingHorizontal: 20,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    button: {
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      marginVertical: 20,
      backgroundColor: Colors.mainColor,
      paddingHorizontal: 12,
      borderRadius: 6,
    },

    list: {
      flex: 1,
    },

    listItem: {
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
    },

    listItemImage: {
      width: 80,
      height: 80,
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
    },

    detailsText: {
      fontSize: 14,
    },

    loadingIndicator: {
      marginVertical: 10,
    },
  });
