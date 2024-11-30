import FormProduto, { FormDataProps } from "@/components/FormProduto";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { IProduto } from "@/interfaces/produto.interface";
import { api } from "@/services/api";
import { showToast } from "@/utils/showToast";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { createStyles } from "./styles";

export default function EditarProduto() {
  const [produto, setProduto] = useState<IProduto>({} as IProduto);
  const [refreshing, setRefreshing] = useState(false);
  const [clearErrors, setClearErrors] = useState<() => void>(() => () => {});

  const { idProduto } = useLocalSearchParams();
  const { setBackIndicator } = useHeader();
  const { startLoading, stopLoading } = useLoading();
  const { session } = useAuth();

  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const getProduto = async () => {
    try {
      startLoading();

      const response = await api.get(`produto/${idProduto}`);

      setProduto(response.data);
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const onSubmit = async (data: FormDataProps) => {
    try {
      startLoading();

      const precoUnitario = parseFloat(
        data.precoUnitario.replace("R$", "").replace(",", ".")
      );

      await api.put(`produto/${idProduto}`, {
        nome: data.nome,
        descricao: data.descricao,
        precoUnitario,
        quantidadeDisponivel: +data.quantidadeDisponivel,
        urlImagem: data.urlImagem,
        idFarmacia: session.user.idFarmacia,
      });

      showToast("Produto atualizado com sucesso!", "success");
      router.navigate("produtos");
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    const fetchProduto = async () => {
      startLoading();
      await getProduto();
      stopLoading();
    };

    fetchProduto();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBackIndicator(true);

      return () => {
        setBackIndicator(false);
      };
    }, [setBackIndicator])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await getProduto();
    clearErrors();
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <FormProduto
        title="Editar produto"
        onSubmit={onSubmit}
        produto={produto}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        setClearErrors={setClearErrors}
      />
    </ThemedView>
  );
}
