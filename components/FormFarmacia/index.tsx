import ScrollView from "@/components/ScrollView";
import ThemedInput from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, useColorScheme } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import { createStyles } from "./styles";
import { IFarmacia } from "@/interfaces/farmacia.interface";
import { useEffect } from "react";

export type FormDataProps = {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  emailAdmin: string;
  urlImagem: string;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
};

type FormFarmaciaProps = {
  title: string;
  onSubmit: (data: FormDataProps) => Promise<void>;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  farmacia?: IFarmacia;
  clearErrors?: () => void;
  setClearErrors?: (clearErrors: () => void) => void;
};

export default function FormFarmacia({
  onSubmit,
  title,
  refreshing,
  onRefresh,
  farmacia,
  clearErrors,
  setClearErrors,
}: FormFarmaciaProps) {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors: clearErrorsForm,
    formState: { errors },
  } = useForm<FormDataProps>();

  useEffect(() => {
    if (clearErrors && setClearErrors) setClearErrors(() => clearErrorsForm);

    if (farmacia) {
      setValue("nome", farmacia.nome);
      setValue("razaoSocial", farmacia.razaoSocial);
      setValue("cnpj", farmacia.cnpj);
      setValue("emailAdmin", farmacia.emailAdmin);
      setValue("urlImagem", farmacia.urlImagem);
      setValue("cep", farmacia.endereco?.cep);
      setValue("uf", farmacia.endereco?.uf);
      setValue("cidade", farmacia.endereco?.cidade);
      setValue("logradouro", farmacia.endereco?.logradouro);
      setValue("numero", farmacia.endereco?.numero);
      setValue("bairro", farmacia.endereco?.bairro);
      setValue("complemento", farmacia.endereco?.complemento);
    }
  }, [farmacia, setValue, clearErrorsForm, clearErrors, setClearErrors]);

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
                placeholder="Digite o nome da farmácia"
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
          name="razaoSocial"
          rules={{ required: "A razão social é obrigatória." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Razão Social*</ThemedText>
              <ThemedInput
                placeholder="Digite a razão social"
                value={value}
                onChangeText={onChange}
              />
            </ThemedView>
          )}
        />
        {errors.razaoSocial && (
          <ThemedText style={styles.error}>
            {errors.razaoSocial.message}
          </ThemedText>
        )}
        <Controller
          control={control}
          name="cnpj"
          rules={{ required: "O CNPJ é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>CNPJ*</ThemedText>
              <TextInputMask
                type={"cnpj"}
                placeholder="Digite o CNPJ"
                value={value}
                keyboardType="numeric"
                onChangeText={onChange}
                customTextInput={ThemedInput}
              />
            </ThemedView>
          )}
        />
        {errors.cnpj && (
          <ThemedText style={styles.error}>{errors.cnpj.message}</ThemedText>
        )}

        <Controller
          control={control}
          name="emailAdmin"
          rules={{ required: "O e-mail do administrador é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>E-mail*</ThemedText>
              <ThemedInput
                value={value}
                onChangeText={onChange}
                placeholder="Digite o e-mail do administrador"
              />
            </ThemedView>
          )}
        />
        {errors.emailAdmin && (
          <ThemedText style={styles.error}>
            {errors.emailAdmin.message}
          </ThemedText>
        )}

        <Controller
          control={control}
          name="urlImagem"
          rules={{ required: "Disponibilize uma foto para sua farmácia" }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Foto*</ThemedText>
              <ThemedInput
                value={value}
                onChangeText={onChange}
                placeholder="Digite a URL da imagem"
              />
            </ThemedView>
          )}
        />
        {errors.urlImagem && (
          <ThemedText style={styles.error}>
            {errors.urlImagem.message}
          </ThemedText>
        )}

        <ThemedText style={styles.title}>Endereço</ThemedText>
        <Controller
          control={control}
          name="cep"
          rules={{ required: "CEP é obrigatório.", minLength: 8 }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>CEP*</ThemedText>
              <TextInputMask
                placeholder="Digite o CEP"
                value={value}
                onChangeText={onChange}
                type={"custom"}
                options={{
                  mask: "99999-999",
                }}
                customTextInput={ThemedInput}
              />
            </ThemedView>
          )}
        />

        {errors.cep && (
          <ThemedText style={styles.error}>{errors.cep.message}</ThemedText>
        )}

        <ThemedView style={styles.row}>
          <ThemedView style={styles.inputContainer}>
            <Controller
              control={control}
              name="uf"
              rules={{ required: "UF é obrigatório." }}
              render={({ field: { onChange, value } }) => (
                <ThemedView>
                  <ThemedText style={styles.label}>Estado*</ThemedText>
                  <ThemedInput
                    placeholder="Selecione a UF"
                    value={value}
                    onChangeText={onChange}
                  />
                </ThemedView>
              )}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <Controller
              control={control}
              name="cidade"
              rules={{ required: "Cidade é obrigatória." }}
              render={({ field: { onChange, value } }) => (
                <ThemedView>
                  <ThemedText style={styles.label}>Cidade*</ThemedText>
                  <ThemedInput
                    placeholder="Selecione a cidade"
                    value={value}
                    onChangeText={onChange}
                  />
                </ThemedView>
              )}
            />
          </ThemedView>
        </ThemedView>

        {errors.uf || errors.cidade ? (
          <ThemedText style={styles.error}>
            {errors.uf?.message || errors.cidade?.message}
          </ThemedText>
        ) : null}

        <Controller
          control={control}
          name="logradouro"
          rules={{ required: "Logradouro é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Logradouro*</ThemedText>
              <ThemedInput
                placeholder="Digite o logradouro"
                value={value}
                onChangeText={onChange}
              />
            </ThemedView>
          )}
        />
        {errors.logradouro && (
          <ThemedText style={styles.error}>
            {errors.logradouro.message}
          </ThemedText>
        )}
        <Controller
          control={control}
          name="numero"
          rules={{ required: "Número é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Número*</ThemedText>
              <ThemedInput
                placeholder="Digite o número do endereço"
                value={value}
                keyboardType="numeric"
                onChangeText={onChange}
              />
            </ThemedView>
          )}
        />
        {errors.numero && (
          <ThemedText style={styles.error}>{errors.numero.message}</ThemedText>
        )}
        <Controller
          control={control}
          name="bairro"
          rules={{ required: "Bairro é obrigatório." }}
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Bairro*</ThemedText>
              <ThemedInput
                placeholder="Digite o bairro"
                value={value}
                onChangeText={onChange}
              />
            </ThemedView>
          )}
        />
        {errors.bairro && (
          <ThemedText style={styles.error}>{errors.bairro.message}</ThemedText>
        )}
        <Controller
          control={control}
          name="complemento"
          render={({ field: { onChange, value } }) => (
            <ThemedView>
              <ThemedText style={styles.label}>Complemento</ThemedText>
              <ThemedInput
                placeholder="Digite o complemento"
                value={value}
                onChangeText={onChange}
                maxLength={100}
              />
            </ThemedView>
          )}
        />
        {errors.complemento && (
          <ThemedText style={styles.error}>
            {errors.complemento.message}
          </ThemedText>
        )}

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
