import { defineFeature, loadFeature } from 'jest-cucumber';

import { ProdutoController } from '../../../adapters/controllers';
import type { ProdutoUseCase } from '../../../application/usecases/produto';
import type { HttpRequest, HttpResponse } from '../../../interfaces/http';

const feature = loadFeature(
  './src/test/bdd/features/produtoController.feature'
);

defineFeature(feature, (test) => {
  const produtoUseCase: ProdutoUseCase = {
    buscarProdutoPorId: jest.fn(),
  } as unknown as ProdutoUseCase;
  const produtoController: ProdutoController = new ProdutoController(
    produtoUseCase
  );
  let request: HttpRequest = {} as HttpRequest;
  let response: HttpResponse = {} as HttpResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ID is missing', ({ given, when, then, and }) => {
    given('the request does not have an ID', () => {
      request = { params: {} } as HttpRequest;
    });

    when('I call buscarProdutoPorId', async () => {
      response = await produtoController.buscarProdutoPorId(request);
    });

    then('the response status code should be 400', () => {
      expect(response.statusCode).toBe(400);
    });

    and('the response data should be "ID do produto é obrigatório!"', () => {
      expect(response.data).toEqual({ err: 'ID do produto é obrigatório!' });
    });
  });

  test('Product is not found', ({ given, when, then, and }) => {
    given(/^the request has an ID "(.*)"$/, (id: string) => {
      request = { params: { id } } as HttpRequest;
    });

    given('the product is not found', () => {
      (produtoUseCase.buscarProdutoPorId as jest.Mock).mockResolvedValue(null);
    });

    when('I call buscarProdutoPorId', async () => {
      response = await produtoController.buscarProdutoPorId(request);
    });

    then('the response status code should be 404', () => {
      expect(response.statusCode).toBe(404);
    });

    and('the response data should be "Produto não encontrado"', () => {
      expect(response.data).toEqual({ message: 'Produto não encontrado' });
    });
  });

  test('Product is found', ({ given, when, then, and }) => {
    given(/^the request has an ID "(.*)"$/, (id: string) => {
      request = { params: { id } } as HttpRequest;
    });

    given('the product is found', () => {
      (produtoUseCase.buscarProdutoPorId as jest.Mock).mockResolvedValue({
        id: '123456',
        nome: 'Produto 1',
        categoria: { categoria: 'Categoria 1' },
        descricao: 'Descrição 1',
        preco: 100,
      });
    });

    when('I call buscarProdutoPorId', async () => {
      response = await produtoController.buscarProdutoPorId(request);
    });

    then('the response status code should be 200', () => {
      expect(response.statusCode).toBe(200);
    });

    and('the response data should be the product', () => {
      expect(response.data).toEqual({
        id: '123456',
        nome: 'Produto 1',
        categoria: 'Categoria 1',
        descricao: 'Descrição 1',
        preco: 100,
      });
    });
  });
});
