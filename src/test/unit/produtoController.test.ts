/* eslint-disable @typescript-eslint/init-declarations */
import { ProdutoController } from '../../adapters/controllers';
import type { ProdutoUseCase } from '../../application/usecases/produto';
import { Categoria } from '../../domain/entities';
import type { HttpRequest, HttpResponse } from '../../interfaces/http';

describe('ProdutoController', () => {
  const produtoUseCase = {
    buscarProdutoPorId: jest.fn(),
    buscarProdutoPorCategoria: jest.fn(),
    criar: jest.fn(),
    excluir: jest.fn(),
    editar: jest.fn(),
  } as unknown as ProdutoUseCase;
  const produtoController = new ProdutoController(produtoUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarProdutoPorId', () => {
    it('should return 400 if ID is missing', async () => {
      const request = { params: {} } as HttpRequest;
      const response: HttpResponse = await produtoController.buscarProdutoPorId(
        request
      );

      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'ID do produto é obrigatório!' });
    });

    it('should return 404 if product is not found', async () => {
      (produtoUseCase.buscarProdutoPorId as jest.Mock).mockResolvedValue(null);
      const request = { params: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await produtoController.buscarProdutoPorId(
        request
      );

      expect(response.statusCode).toBe(404);
      expect(response.data).toEqual({ message: 'Produto não encontrado' });
    });

    it('should return 200 if product is found', async () => {
      const produto = {
        id: '123',
        nome: 'NomeProduto',
        categoria: { categoria: 'CategoriaProduto' },
        preco: 100,
      };
      (produtoUseCase.buscarProdutoPorId as jest.Mock).mockResolvedValue(
        produto
      );
      const request = { params: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await produtoController.buscarProdutoPorId(
        request
      );

      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria.categoria,
        preco: produto.preco,
      });
    });

    it('should return 500 if an error occurs', async () => {
      (produtoUseCase.buscarProdutoPorId as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = { params: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await produtoController.buscarProdutoPorId(
        request
      );

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('should return 400 if categoria is missing', async () => {
      const request = { query: {} } as HttpRequest;
      const response: HttpResponse =
        await produtoController.buscarProdutoPorCategoria(request);

      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({
        err: 'Categoria do produto é obrigatório!',
      });
    });

    it('should return a list of products in the given category', async () => {
      const produtos = [
        {
          id: '123',
          nome: 'Produto Teste',
          categoria: new Categoria('Lanche'),
          preco: 100,
          descricao: 'Descrição do Produto Teste',
        },
      ];
      (produtoUseCase.buscarProdutoPorCategoria as jest.Mock).mockResolvedValue(
        produtos
      );

      const request = {
        query: { categoria: 'CategoriaProduto' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await produtoController.buscarProdutoPorCategoria(request);

      expect(response).toEqual({
        data: produtos.map((produto) => ({
          id: produto.id,
          categoria: produto.categoria.categoria,
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
        })),
        statusCode: 200,
      });
    });

    it('should return 500 if an error occurs', async () => {
      (produtoUseCase.buscarProdutoPorCategoria as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = {
        query: { categoria: 'CategoriaProduto' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await produtoController.buscarProdutoPorCategoria(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });
  });

  describe('criar', () => {
    it('should return 400 if categoria, nome, preco or descricao are not provided', async () => {
      const request = { body: {} } as HttpRequest;
      const response: HttpResponse = await produtoController.criar(request);

      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({
        err: 'Categoria, nome, preco e descricao são obrigatórios!',
      });
    });

    it('should return 201 if product is created', async () => {
      const produto = {
        nome: 'NomeProduto',
        categoria: 'CategoriaProduto',
        preco: 100,
        descricao: 'Descrição do Produto',
      };
      (produtoUseCase.criar as jest.Mock).mockResolvedValue(produto);

      const request = { body: produto } as unknown as HttpRequest;
      const response: HttpResponse = await produtoController.criar(request);

      expect(response.statusCode).toBe(201);
      expect(response.data).toEqual(produto);
    });

    it('should return 500 if an error occurs', async () => {
      (produtoUseCase.criar as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = {
        body: {
          nome: 'NomeProduto',
          categoria: 'CategoriaProduto',
          preco: 100,
          descricao: 'Descrição do Produto',
        },
      } as unknown as HttpRequest;
      const response: HttpResponse = await produtoController.criar(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });
  });

  describe('excluir', () => {
    it('should return 400 if ID is missing', async () => {
      const request = { body: {} } as HttpRequest;
      const response: HttpResponse = await produtoController.excluir(request);

      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'ID do produto é obrigatório!' });
    });

    it('should return 204 if product is deleted', async () => {
      (produtoUseCase.excluir as jest.Mock).mockResolvedValue(null);
      const request = { body: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await produtoController.excluir(request);

      expect(response.statusCode).toBe(204);
      expect(response.data).toEqual({
        message: 'Produto excluído com sucesso!',
      });
    });

    it('should return 500 if an error occurs', async () => {
      (produtoUseCase.excluir as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = { body: { id: '123' } } as HttpRequest;
      const response: HttpResponse = await produtoController.excluir(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });
  });

  describe('editar', () => {
    it('should return 400 if ID is missing', async () => {
      const request = { body: {}, params: {} } as HttpRequest;
      const response: HttpResponse = await produtoController.editar(request);

      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'ID do produto é obrigatório!' });
    });

    it('should return 200 if product is updated', async () => {
      const produto = {
        nome: 'NomeProduto',
        categoria: 'CategoriaProduto',
        preco: 100,
        descricao: 'Descrição do Produto',
      };
      (produtoUseCase.editar as jest.Mock).mockResolvedValue(produto);

      const request = {
        body: produto,
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse = await produtoController.editar(request);

      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual({ id: '123', ...produto });
    });

    it('should return 500 if an error occurs', async () => {
      (produtoUseCase.editar as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = {
        body: {
          nome: 'NomeProduto',
        },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse = await produtoController.editar(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });
  });
});
