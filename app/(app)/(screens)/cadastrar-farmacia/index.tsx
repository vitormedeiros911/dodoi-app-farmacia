import FormFarmacia, { FormDataProps } from "@/components/FormFarmacia";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { api } from "@/services/api";
import { formatEndereco } from "@/utils/formatEndereco";
import { showToast } from "@/utils/showToast";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles } from "./styles";
import { oneSignalRegisterUser } from "@/lib/oneSignalHelper";

export default function CadastrarFarmacia() {
  const { setIsVisible } = useHeader();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { startLoading, stopLoading } = useLoading();
  const { refreshToken } = useAuth();

  const onSubmit = async (data: FormDataProps) => {
    try {
      startLoading();

      const endereco = formatEndereco(data);
      const response = await api.post("/farmacia", {
        nome: data.nome,
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
        urlImagem: data.urlImagem,
        emailAdmin: data.emailAdmin,
        endereco,
      });

      const { id } = response.data;

      if (id) await refreshToken();

      oneSignalRegisterUser(id);

      showToast("Farmácia cadastrada com sucesso!", "success");
      router.replace("/(app)/(tabs)");
    } catch (error: any) {
      showToast(error.response?.data?.message, "error");
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
