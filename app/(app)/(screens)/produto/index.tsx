import FormProduto, { FormDataProps } from "@/components/FormProduto";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { showToast } from "@/utils/showToast";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useColorScheme } from "react-native";

import { createStyles } from "./styles";
import { router } from "expo-router";

export default function DadosFarmacia() {
  const { setBackIndicator } = useHeader();
  const { startLoading, stopLoading } = useLoading();
  const { session } = useAuth();

  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const onSubmit = async (data: FormDataProps) => {
    try {
      startLoading();

      const precoUnitario = parseFloat(
        data.precoUnitario.replace("R$", "").replace(",", ".")
      );

      await api.post("produto", {
        nome: data.nome,
        descricao: data.descricao,
        precoUnitario,
        quantidadeDisponivel: +data.quantidadeDisponivel,
        urlImagem: data.urlImagem,
        idFarmacia: session.user.idFarmacia,
      });

      showToast("Produto cadastrado com sucesso!", "success");
      router.navigate("produtos");
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

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
      <FormProduto title="Editar produto" onSubmit={onSubmit} />
    </ThemedView>
  );
}
