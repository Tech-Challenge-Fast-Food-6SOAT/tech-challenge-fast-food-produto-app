import { defineFeature, loadFeature } from 'jest-cucumber';

import { ProdutoGateway } from '@/adapters/gateways/produto';
import { Categoria } from '@/domain/entities';
import { Produto } from '@/domain/entities/produto';
import type { DbConnection } from '@/interfaces/db/connection';

const feature = loadFeature('./src/test/bdd/features/produtoGateway.feature');

defineFeature(feature, (test) => {
  const dbConnection = { buscarUm: jest.fn() } as unknown as DbConnection;
  const produtoGateway = new ProdutoGateway(dbConnection);
  let result: Produto | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Product is found', ({ given, when, then }) => {
    given(/^a product with ID "(.*)" exists$/, (id: string) => {
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue({
        _id: id,
        nome: 'NomeProduto',
        categoria: 'Lanche',
        preco: 100,
        descricao: 'Descrição do Produto',
      });
    });

    when(/^I call buscarProdutoPorId with ID "(.*)"$/, async (id: string) => {
      result = await produtoGateway.buscarProdutoPorId(id);
    });

    then(/^the product with ID "(.*)" should be returned$/, (id: string) => {
      const expectedProduto = new Produto(
        id,
        new Categoria('Lanche'),
        'NomeProduto',
        100,
        'Descrição do Produto'
      );
      expect(result).toEqual(expectedProduto);
    });
  });

  test('Product is not found', ({ given, when, then }) => {
    given(/^a product with ID "(.*)" does not exist$/, () => {
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(null);
    });

    when(/^I call buscarProdutoPorId with ID "(.*)"$/, async (id: string) => {
      result = await produtoGateway.buscarProdutoPorId(id);
    });

    then(/^the response should be null$/, () => {
      expect(result).toBeNull();
    });
  });
});
