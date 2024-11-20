import { defineFeature, loadFeature } from 'jest-cucumber';

import type { ProdutoGateway } from '../../../adapters/gateways/produto';
import { ProdutoUseCase } from '../../../application/usecases/produto';
import type { Produto } from '../../../domain/entities/produto';

const feature = loadFeature('./src/test/bdd/features/produtoUseCase.feature');

defineFeature(feature, (test) => {
  const produtoGateway = {
    buscarProdutoPorId: jest.fn(),
  } as unknown as ProdutoGateway;
  const produtoUseCase = new ProdutoUseCase(produtoGateway);
  let result: Produto | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Product is found', ({ given, when, then }) => {
    given(/^a product with ID "(.*)" exists$/, (id: string) => {
      (produtoGateway.buscarProdutoPorId as jest.Mock).mockResolvedValue({
        id,
        nome: 'NomeProduto',
        categoria: { categoria: 'CategoriaProduto' },
        preco: 100,
        descricao: 'Descrição do Produto',
      });
    });

    when(/^I call buscarProdutoPorId with ID "(.*)"$/, async (id: string) => {
      result = await produtoUseCase.buscarProdutoPorId({ id });
    });

    then(/^the product with ID "(.*)" should be returned$/, (id: string) => {
      expect(result).toEqual({
        id,
        nome: 'NomeProduto',
        categoria: { categoria: 'CategoriaProduto' },
        preco: 100,
        descricao: 'Descrição do Produto',
      });
    });
  });

  test('Product is not found', ({ given, when, then }) => {
    given(/^a product with ID "(.*)" does not exist$/, () => {
      (produtoGateway.buscarProdutoPorId as jest.Mock).mockResolvedValue(null);
    });

    when(/^I call buscarProdutoPorId with ID "(.*)"$/, async (id: string) => {
      result = await produtoUseCase.buscarProdutoPorId({ id });
    });

    then(/^the response should be null$/, () => {
      expect(result).toBeNull();
    });
  });
});
