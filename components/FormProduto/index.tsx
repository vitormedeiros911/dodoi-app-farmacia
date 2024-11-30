import ScrollView from "@/components/ScrollView";
import ThemedInput from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IProduto } from "@/interfaces/produto.interface";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, TouchableOpacity, useColorScheme } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import { createStyles } from "./styles";
import ImageWithFallback from "../ImageWithFallback";

export type FormDataProps = {
  nome: string;
  descricao: string;
  urlImagem: string;
  precoUnitario: string;
  quantidadeDisponivel: string;
};

type FormProdutoProps = {
  title: string;
  onSubmit: (data: FormDataProps) => Promise<void>;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  produto?: IProduto;
  clearErrors?: () => void;
  setClearErrors?: (clearErrors: () => void) => void;
};

export default function FormProduto({
  onSubmit,
  title,
  refreshing,
  onRefresh,
  produto,
  clearErrors,
  setClearErrors,
}: FormProdutoProps) {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const [source, setSource] = useState(produto?.urlImagem);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors: clearErrorsForm,
    formState: { errors },
  } = useForm<FormDataProps>();

  useEffect(() => {
    if (clearErrors && setClearErrors) setClearErrors(() => clearErrorsForm);

    if (produto) {
      setSource(produto.urlImagem);
      setValue("nome", produto.nome);
      setValue("descricao", produto.descricao);
      setValue("urlImagem", produto.urlImagem);
      setValue("precoUnitario", produto.precoUnitario?.toFixed(2));
      setValue(
        "quantidadeDisponivel",
        produto.quantidadeDisponivel?.toString()
      );
    }
  }, [produto, setValue, clearErrorsForm, clearErrors, setClearErrors]);

  return (
    <ScrollView refreshing={refreshing} onRefresh={onRefresh}>
      <ThemedView style={styles.form}>
        <ThemedText style={styles.title}>{title}</ThemedText>

        <Controller
          control={control}
          name="nome"
          rules={{ required: "O nome é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Nome*</ThemedText>
              <ThemedInput
                placeholder="Digite o nome do produto"
                value={value}
                onChangeText={onChange}
              />
            </ThemedView>
          )}
        />
        {errors.nome && (
          <ThemedText style={styles.error}>{errors.nome.message}</ThemedText>
        )}

        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Descrição</ThemedText>
              <ThemedInput
                placeholder="Digite a descrição do produto"
                value={value}
                onChangeText={onChange}
              />
            </ThemedView>
          )}
        />

        <Controller
          control={control}
          name="precoUnitario"
          rules={{ required: "O preço é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Preço*</ThemedText>
              <TextInputMask
                type={"money"}
                options={{
                  precision: 2,
                  separator: ",",
                  delimiter: ".",
                  unit: "R$ ",
                  suffixUnit: "",
                }}
                value={value}
                onChangeText={onChange}
                placeholder="Digite o preço do produto"
                customTextInput={ThemedInput}
              />
            </ThemedView>
          )}
        />
        {errors.precoUnitario && (
          <ThemedText style={styles.error}>
            {errors.precoUnitario.message}
          </ThemedText>
        )}

        <Controller
          control={control}
          name="quantidadeDisponivel"
          rules={{ required: "A quantidade é obrigatória." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Quantidade*</ThemedText>
              <ThemedInput
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                placeholder="Digite a quantidade disponível"
              />
            </ThemedView>
          )}
        />

        {errors.quantidadeDisponivel && (
          <ThemedText style={styles.error}>
            {errors.quantidadeDisponivel.message}
          </ThemedText>
        )}

        <ThemedText style={styles.label}>Foto do produto</ThemedText>
        <ImageWithFallback
          source={{ uri: source }}
          fallbackSource={require("@/assets/images/remedioGenericoImg.jpg")}
          style={styles.image}
        />

        <Controller
          control={control}
          name="urlImagem"
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedInput
                value={value}
                onChangeText={(text) => {
                  setSource(text);
                  onChange(text);
                }}
                placeholder="Digite a URL da imagem"
              />
            </ThemedView>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
        >
          <ThemedText>Salvar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}
