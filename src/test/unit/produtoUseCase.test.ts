/* eslint-disable @typescript-eslint/unbound-method */
// src/test/unit/produtoUseCase.test.ts
import type { ProdutoGateway } from '../../adapters/gateways';
import { ProdutoUseCase } from '../../application/usecases';
import type { Produto } from '../../domain/entities';
import { Categoria } from '../../domain/entities';

describe('ProdutoUseCase', () => {
  const produtoGateway = {
    buscarProdutoPorId: jest.fn(),
    buscarProdutosPorCategoria: jest.fn(),
    criar: jest.fn(),
    excluir: jest.fn(),
    editar: jest.fn(),
  } as unknown as ProdutoGateway;
  const produtoUseCase = new ProdutoUseCase(produtoGateway);

  const produto = {
    id: '123',
    nome: 'nomeProduto',
    categoria: new Categoria('Lanche'),
    preco: 100,
    descricao: 'Descrição do Produto',
  } as Produto;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarProdutoPorId', () => {
    it('should return a product when the product exists', async () => {
      (produtoGateway.buscarProdutoPorId as jest.Mock).mockResolvedValue(
        produto
      );

      const result = await produtoUseCase.buscarProdutoPorId({ id: '123' });

      expect(result).toEqual(produto);
      expect(produtoGateway.buscarProdutoPorId).toHaveBeenCalledWith('123');
    });

    it('should return null when the product does not exist', async () => {
      (produtoGateway.buscarProdutoPorId as jest.Mock).mockResolvedValue(null);

      const result = await produtoUseCase.buscarProdutoPorId({ id: '123' });

      expect(result).toBeNull();
      expect(produtoGateway.buscarProdutoPorId).toHaveBeenCalledWith('123');
    });
  });

  describe('buscarProdutoPorCategoria', () => {
    it('should return a list of products in the given category', async () => {
      const produtos = [produto];
      (
        produtoGateway.buscarProdutosPorCategoria as jest.Mock
      ).mockResolvedValue(produtos);

      const result = await produtoUseCase.buscarProdutoPorCategoria({
        categoria: 'Lanche' as unknown as Categoria,
      });

      expect(result).toEqual(produtos);
      expect(produtoGateway.buscarProdutosPorCategoria).toHaveBeenCalledWith(
        'Lanche'
      );
    });

    it('should return an empty list if no products are found in the given category', async () => {
      (
        produtoGateway.buscarProdutosPorCategoria as jest.Mock
      ).mockResolvedValue([]);

      const result = await produtoUseCase.buscarProdutoPorCategoria({
        categoria: 'Sopa' as unknown as Categoria,
      });

      expect(result).toEqual([]);
      expect(produtoGateway.buscarProdutosPorCategoria).toHaveBeenCalledWith(
        'Sopa'
      );
    });
  });

  describe('criar', () => {
    it('should create a product and return it', async () => {
      (produtoGateway.criar as jest.Mock).mockResolvedValue(produto);
      const produtoUseCaseCriarInput = {
        nome: 'NomeProduto',
        categoria: 'Lanche' as unknown as Categoria,
        preco: 100,
        descricao: 'Descrição do Produto',
      };

      const result = await produtoUseCase.criar(produtoUseCaseCriarInput);

      expect(result).toEqual(produto);
      expect(produtoGateway.criar).toHaveBeenCalledWith(
        produtoUseCaseCriarInput
      );
    });
  });

  describe('excluir', () => {
    it('should delete a product', async () => {
      (produtoGateway.excluir as jest.Mock).mockResolvedValue(null);
      await produtoUseCase.excluir({ id: '123' });
      expect(produtoGateway.excluir).toHaveBeenCalledWith('123');
    });
  });

  describe('editar', () => {
    it('should update a product and return it', async () => {
      const produtoUseCaseEditarInput = {
        id: '123',
        nome: 'NomeProduto',
        categoria: 'Lanche' as unknown as Categoria,
        preco: 150,
        descricao: 'Descrição do Produto',
      } as Produto;
      (produtoGateway.editar as jest.Mock).mockResolvedValue(produto);

      const result = await produtoUseCase.editar(produtoUseCaseEditarInput);

      expect(result).toEqual(produto);
      expect(produtoGateway.editar).toHaveBeenCalledWith(
        produtoUseCaseEditarInput
      );
    });
  });
});
