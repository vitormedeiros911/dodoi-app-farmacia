import { CategoriaEnum } from "@/enum/categoria.enum";

export interface IProduto {
  id: string;
  nome: string;
  urlImagem: string;
  precoUnitario: number;
  descricao: string;
  quantidadeDisponivel: number;
  categoria: CategoriaEnum;
}
