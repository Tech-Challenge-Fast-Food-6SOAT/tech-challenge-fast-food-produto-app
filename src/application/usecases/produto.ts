import type { ProdutoGateway } from '../../adapters/gateways/produto';
import type { Categoria } from '../../domain/entities/categoria';
import type { Produto } from '../../domain/entities/produto';

export class ProdutoUseCase {
  public constructor(private readonly produtoGateway: ProdutoGateway) {}

  public async buscarProdutoPorId(params: {
    id: string;
  }): Promise<Produto | null> {
    const produto = await this.produtoGateway.buscarProdutoPorId(params.id);

    return produto;
  }

  public async buscarProdutoPorCategoria(params: {
    categoria: Categoria;
  }): Promise<Produto[]> {
    const listaProdutos = await this.produtoGateway.buscarProdutosPorCategoria(
      params.categoria
    );

    return listaProdutos;
  }

  public async criar(params: Omit<Produto, 'id'>): Promise<Produto> {
    const validParams = {
      categoria: params.categoria,
      nome: params.nome,
      preco: params.preco,
      descricao: params.descricao,
    };

    const createdProduto = await this.produtoGateway.criar(validParams);

    return createdProduto;
  }

  public async excluir(params: { id: string }): Promise<void> {
    await this.produtoGateway.excluir(params.id);
  }

  public async editar(params: Produto): Promise<Produto> {
    return this.produtoGateway.editar(params);
  }
}
