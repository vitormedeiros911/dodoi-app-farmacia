export interface IUsuario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: Date;
  urlImagem: string;
  idFarmacia: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}
