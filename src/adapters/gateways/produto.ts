/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import type { CategoriaEnum } from '../../domain/entities/categoria';
import { Categoria } from '../../domain/entities/categoria';
import { Produto } from '../../domain/entities/produto';
import type { DbConnection } from '../../interfaces/db/connection';
import type { IProdutoGateway } from '../../interfaces/gateways/produto';

export class ProdutoGateway implements IProdutoGateway {
  public constructor(private readonly dbConnection: DbConnection) {}

  public async buscarProdutoPorId(id: string): Promise<Produto | null> {
    const produto = await this.dbConnection.buscarUm<{
      _id: string;
      categoria: string;
      nome: string;
      preco: number;
      descricao: string;
    }>({ _id: id });

    if (!produto) {
      return null;
    }

    return new Produto(
      produto._id,
      new Categoria(produto.categoria as CategoriaEnum),
      produto.nome,
      produto.preco,
      produto.descricao
    );
  }

  public async buscarProdutosPorCategoria(
    categoria: Categoria
  ): Promise<Produto[]> {
    const produtos = await this.dbConnection.buscar<{
      _id: string;
      categoria: string;
      nome: string;
      preco: number;
      descricao: string;
    }>({
      categoria,
    });

    const produtosResponse = [] as Produto[];

    for (const produto of produtos) {
      produtosResponse.push(
        new Produto(
          produto._id,
          new Categoria(produto.categoria as CategoriaEnum),
          produto.nome,
          produto.preco,
          produto.descricao
        )
      );
    }

    return produtosResponse;
  }

  public async criar(produto: Omit<Produto, 'id'>): Promise<Produto> {
    const produtoCriado = await this.dbConnection.criar<{ _id: string }>(
      produto
    );
    return new Produto(
      produtoCriado._id,
      produto.categoria,
      produto.nome,
      produto.preco,
      produto.descricao
    );
  }

  public async excluir(id: string): Promise<void> {
    return this.dbConnection.excluir(id);
  }

  public async editar(produto: Produto): Promise<Produto> {
    await this.dbConnection.editar({
      id: produto.id,
      value: {
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        categoria: produto.categoria,
      },
    });

    return produto;
  }
}
