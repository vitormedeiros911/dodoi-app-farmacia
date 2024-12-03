import defaultImg from "@/assets/images/remedioGenericoImg.jpg";
import ScrollView from "@/components/ScrollView";
import ThemedInput from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CategoriaEnum } from "@/enum/categoria.enum";
import { IProduto } from "@/interfaces/produto.interface";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, useColorScheme } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import ImageWithFallback from "../ImageWithFallback";
import ThemedSelect from "../ThemedSelect";
import { createStyles } from "./styles";

export type FormDataProps = {
  nome: string;
  descricao: string;
  urlImagem: string;
  precoUnitario: string;
  quantidadeDisponivel: string;
  categoria: CategoriaEnum;
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

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
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
  const [source, setSource] = useState(defaultImg);

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
      if (isValidUrl(produto.urlImagem)) {
        setValue("urlImagem", produto.urlImagem);

        setSource({
          uri: produto.urlImagem,
        });
      }

      setValue("nome", produto.nome);
      setValue("descricao", produto.descricao);
      setValue("precoUnitario", produto.precoUnitario?.toFixed(2));
      setValue(
        "quantidadeDisponivel",
        produto.quantidadeDisponivel?.toString()
      );
      setValue("categoria", produto.categoria);
    }
  }, [produto, setValue, clearErrorsForm, clearErrors, setClearErrors]);

  return (
    <ScrollView refreshing={refreshing} onRefresh={onRefresh}>
      <ThemedView style={styles.form}>
        <ThemedText style={styles.title}>{title}</ThemedText>

        <ThemedText style={styles.label}>Foto do produto</ThemedText>
        <ImageWithFallback
          source={source}
          fallbackSource={defaultImg}
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
                  if (isValidUrl(text))
                    setSource({
                      uri: text,
                    });

                  onChange(text);
                }}
                maxLength={500}
                placeholder="Digite a URL da imagem"
              />
            </ThemedView>
          )}
        />

        <ThemedText style={styles.label}>Nome*</ThemedText>
        <Controller
          control={control}
          name="nome"
          rules={{ required: "O nome é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedInput
                value={value}
                onChangeText={onChange}
                placeholder="Digite o nome do produto"
              />
            </ThemedView>
          )}
        />
        {errors.nome && (
          <ThemedText style={styles.error}>{errors.nome.message}</ThemedText>
        )}

        <ThemedText style={styles.label}>Categoria* </ThemedText>
        <Controller
          control={control}
          name="categoria"
          rules={{ required: "A categoria é obrigatória." }}
          render={({ field: { onChange, value } }) => (
            <ThemedSelect
              options={Object.values(CategoriaEnum).map((categoria) => ({
                label: categoria,
                value: categoria,
              }))}
              selectedValue={value}
              onValueChange={onChange}
              placeholder="Selecione a categoria"
              style={{ marginBottom: 16 }}
            />
          )}
        />
        {errors.categoria && (
          <ThemedText style={styles.error}>
            {errors.categoria.message}
          </ThemedText>
        )}

        <ThemedView style={styles.row}>
          <ThemedView style={styles.inputContainer}>
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
          </ThemedView>
          <ThemedView style={styles.inputContainer}>
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
          </ThemedView>
        </ThemedView>

        {errors.precoUnitario || errors.quantidadeDisponivel ? (
          <ThemedText style={styles.error}>
            {errors.precoUnitario?.message ||
              errors.quantidadeDisponivel?.message}
          </ThemedText>
        ) : null}

        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Descrição</ThemedText>
              <ThemedInput
                placeholder="Digite a descrição do produto"
                value={value}
                multiline={true}
                numberOfLines={4}
                onChangeText={onChange}
                maxLength={500}
                style={styles.textArea}
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
