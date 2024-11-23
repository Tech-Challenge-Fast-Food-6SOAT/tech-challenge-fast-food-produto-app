/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ProdutoGateway } from '@/adapters/gateways/produto';
import { Categoria, Produto } from '@/domain/entities';
import type { DbConnection } from '@/interfaces/db/connection';

describe('ProdutoGateway', () => {
  const dbConnection = {
    buscar: jest.fn(),
    criar: jest.fn(),
    excluir: jest.fn(),
    editar: jest.fn(),
  } as unknown as DbConnection;
  const produtoGateway = new ProdutoGateway(dbConnection);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarProdutosPorCategoria', () => {
    it('should return a list of products in the given category', async () => {
      const produtos = [
        {
          _id: '123',
          categoria: 'Lanche',
          nome: 'NomeProduto',
          preco: 100,
          descricao: 'Descrição do Produto',
        },
      ];
      (dbConnection.buscar as jest.Mock).mockResolvedValue(produtos);

      const result = await produtoGateway.buscarProdutosPorCategoria(
        'Lanche' as unknown as Categoria
      );

      expect(result).toEqual([
        new Produto(
          '123',
          new Categoria('Lanche'),
          'NomeProduto',
          100,
          'Descrição do Produto'
        ),
      ]);
      expect(dbConnection.buscar).toHaveBeenCalledWith({
        categoria: 'Lanche',
      });
    });

    it('should return an empty list if no products are found in the given category', async () => {
      (dbConnection.buscar as jest.Mock).mockResolvedValue([]);

      const result = await produtoGateway.buscarProdutosPorCategoria(
        'Lanche' as unknown as Categoria
      );

      expect(result).toEqual([]);
      expect(dbConnection.buscar).toHaveBeenCalledWith({
        categoria: 'Lanche',
      });
    });
  });

  describe('criar', () => {
    it('should create a product', async () => {
      const produto = {
        categoria: 'Lanche',
        nome: 'NomeProduto',
        preco: 100,
        descricao: 'Descrição do Produto',
      } as unknown as Omit<Produto, 'id'>;
      const produtoCriado = {
        _id: '123',
        ...produto,
      };
      (dbConnection.criar as jest.Mock).mockResolvedValue(produtoCriado);

      const result = await produtoGateway.criar(produto);

      expect(result).toEqual(
        new Produto(
          produtoCriado._id,
          produtoCriado.categoria,
          produtoCriado.nome,
          produtoCriado.preco,
          produtoCriado.descricao
        )
      );
      expect(dbConnection.criar).toHaveBeenCalledWith(produto);
    });
  });

  describe('excluir', () => {
    it('should delete a product', async () => {
      (dbConnection.excluir as jest.Mock).mockResolvedValue(null);
      const id = '123';
      await produtoGateway.excluir(id);
      expect(dbConnection.excluir).toHaveBeenCalledWith(id);
    });
  });

  describe('editar', () => {
    it('should edit a product', async () => {
      const produto = {
        id: '123',
        categoria: 'Lanche' as unknown as Categoria,
        nome: 'NomeProduto',
        preco: 100,
        descricao: 'Descrição do Produto',
      };
      (dbConnection.editar as jest.Mock).mockResolvedValue(produto);

      const result = await produtoGateway.editar(
        new Produto(
          produto.id,
          produto.categoria,
          produto.nome,
          produto.preco,
          produto.descricao
        )
      );

      expect(result).toEqual(
        new Produto(
          produto.id,
          produto.categoria,
          produto.nome,
          produto.preco,
          produto.descricao
        )
      );
      expect(dbConnection.editar).toHaveBeenCalledWith({
        id: '123',
        value: {
          categoria: produto.categoria,
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
        },
      });
    });
  });
});
