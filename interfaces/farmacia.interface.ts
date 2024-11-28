export interface IFarmacia {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  urlImagem: string;
  emailAdmin: string;
  endereco: {
    cep: string;
    uf: string;
    cidade: string;
    logradouro: string;
    numero: string;
    bairro: string;
    complemento: string;
  };
}
