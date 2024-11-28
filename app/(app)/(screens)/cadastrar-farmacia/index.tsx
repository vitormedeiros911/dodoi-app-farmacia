import FormFarmacia, { FormDataProps } from "@/components/FormFarmacia";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { formatEndereco } from "@/utils/formatEndereco";
import { showToast } from "@/utils/showToast";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles } from "./styles";

export default function CadastrarFarmacia() {
  const { setIsVisible } = useHeader();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { startLoading, stopLoading } = useLoading();

  const onSubmit = async (data: FormDataProps) => {
    try {
      startLoading();

      const endereco = formatEndereco(data);
      await api.post("/farmacia", {
        nome: data.nome,
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
        urlImagem: data.urlImagem,
        emailAdmin: data.emailAdmin,
        endereco,
      });

      showToast("Farmácia cadastrada com sucesso!", "success");
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsVisible(false);

      return () => {
        setIsVisible(true);
      };
    }, [setIsVisible])
  );

  return (
    <SafeAreaView style={styles.container}>
      <FormFarmacia title="Cadastrar Farmácia" onSubmit={onSubmit} />
    </SafeAreaView>
  );
}
