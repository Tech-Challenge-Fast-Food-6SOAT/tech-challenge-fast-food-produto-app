import type { Categoria } from '../../domain/entities';

export interface HttpRequest<T = any> {
  body: {
    id: string;
    categoria: Categoria;
    nome: string;
    preco: number;
    descricao: string;
  };
  headers: T;
  params: { id: string };
  query: { categoria: Categoria };
}
