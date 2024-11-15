import type { ProdutoUseCase } from '../../application/usecases/produto';
import { Produto } from '../../domain/entities';
import type { HttpRequest, HttpResponse } from '../../interfaces/http';

export class ProdutoController {
  public constructor(private readonly produtoUseCase: ProdutoUseCase) {}

  public async buscarProdutoPorId(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;

      if (!id) {
        return {
          data: {
            err: 'ID do produto é obrigatório!',
          },
          statusCode: 400,
        };
      }

      const produto = await this.produtoUseCase.buscarProdutoPorId({
        id,
      });

      if (!produto) {
        return {
          data: {
            message: 'Produto não encontrado',
          },
          statusCode: 404,
        };
      }

      return {
        data: {
          id: produto.id,
          nome: produto.nome,
          categoria: produto.categoria.categoria,
          descricao: produto.descricao,
          preco: produto.preco,
        },
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async buscarProdutoPorCategoria(
    request: HttpRequest
  ): Promise<HttpResponse> {
    try {
      const { categoria } = request.query;

      if (!categoria) {
        return {
          data: {
            err: 'Categoria do produto é obrigatório!',
          },
          statusCode: 400,
        };
      }

      const produtos = await this.produtoUseCase.buscarProdutoPorCategoria({
        categoria,
      });
      return {
        data: produtos.map((produto) => ({
          id: produto.id,
          categoria: produto.categoria.categoria,
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
        })),
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async criar(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { categoria, nome, preco, descricao } = request.body;

      if (!categoria || !nome || !preco || !descricao) {
        return {
          data: {
            err: 'Categoria, nome, preco e descricao são obrigatórios!',
          },
          statusCode: 400,
        };
      }

      const produto = await this.produtoUseCase.criar({
        nome,
        categoria,
        preco,
        descricao,
      });

      return {
        data: {
          id: produto.id,
          nome: produto.nome,
          categoria: produto.categoria,
          preco: produto.preco,
          descricao: produto.descricao,
        },
        statusCode: 201,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async excluir(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.body;

      if (!id) {
        return {
          data: {
            err: 'ID do produto é obrigatório!',
          },
          statusCode: 400,
        };
      }

      await this.produtoUseCase.excluir({
        id,
      });

      return {
        data: {
          message: 'Produto excluído com sucesso!',
        },
        statusCode: 204,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async editar(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { categoria, nome, preco, descricao } = request.body;
      const { id } = request.params;

      const newProduto = new Produto(id, categoria, nome, preco, descricao);

      await this.produtoUseCase.editar(newProduto);

      return {
        data: {
          id,
          categoria,
          nome,
          preco,
          descricao,
        },
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }
}
