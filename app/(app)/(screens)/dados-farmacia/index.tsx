import FormFarmacia, { FormDataProps } from "@/components/FormFarmacia";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { useLoading } from "@/hooks/useLoading";
import { IFarmacia } from "@/interfaces/farmacia.interface";
import { api } from "@/services/api";
import { formatEndereco } from "@/utils/formatEndereco";
import { showToast } from "@/utils/showToast";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { createStyles } from "./styles";

export default function DadosFarmacia() {
  const [farmacia, setFarmacia] = useState<IFarmacia>({} as IFarmacia);
  const [refreshing, setRefreshing] = useState(false);
  const [clearErrors, setClearErrors] = useState<() => void>(() => () => {});
  const { setBackIndicator } = useHeader();
  const { startLoading, stopLoading } = useLoading();
  const { session } = useAuth();

  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const getFarmacia = async () => {
    try {
      startLoading();
      const response = await api.get(`/farmacia/${session.user.idFarmacia}`);

      setFarmacia(response.data);
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const onSubmit = async (data: FormDataProps) => {
    const endereco = formatEndereco(data);

    try {
      startLoading();
      await api.put("/farmacia", {
        nome: data.nome,
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
        urlImagem: data.urlImagem,
        emailAdmin: data.emailAdmin,
        endereco,
      });

      showToast("Farmácia atualizada com sucesso!", "success");
    } catch (error: any) {
      showToast(error.response.data.message, "error");
    } finally {
      stopLoading();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getFarmacia();
    clearErrors();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setBackIndicator(true);

      return () => {
        setBackIndicator(false);
      };
    }, [setBackIndicator])
  );

  useEffect(() => {
    const fetchFarmacia = async () => {
      startLoading();
      await getFarmacia();
      stopLoading();
    };

    fetchFarmacia();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FormFarmacia
        title="Minha Farmácia"
        onSubmit={onSubmit}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        farmacia={farmacia}
        setClearErrors={setClearErrors}
      />
    </ThemedView>
  );
}
