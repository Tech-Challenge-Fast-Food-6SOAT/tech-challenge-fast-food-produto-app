/* eslint-disable @typescript-eslint/init-declarations */
// src/test/bdd/stepDefinitions/produto.steps.ts
import type { FastifyInstance } from 'fastify';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { ProdutoController } from '../../../adapters/controllers';
import apiRoutes from '../../../api/routes';
import type { HttpRequest } from '../../../interfaces/http';

const feature = loadFeature('./src/test/bdd/features/routes.feature');

const mockFastifyInstance = (): jest.Mocked<FastifyInstance> => {
  const fastifyInstance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  } as unknown as jest.Mocked<FastifyInstance>;

  return fastifyInstance;
};

jest.mock('../../../infra/database/mongodb', () => ({
  mongoConnection: {
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    }),
  },
}));
jest.mock('../../../adapters/gateways/produto');
jest.mock('../../../application/usecases/produto');
jest.mock('../../../infra/database/mongodb/db-connections');
jest.mock('../../../infra/database/mongodb');

jest
  .mock('../../../adapters/controllers')
  .fn(jest.fn().mockResolvedValue({ statusCode: 200, data: [] }));
ProdutoController.prototype.buscarProdutoPorId = jest.fn();

defineFeature(feature, (test) => {
  const fastifyInstance: jest.Mocked<FastifyInstance> = mockFastifyInstance();
  let mockRequest: HttpRequest;
  let mockReply: any;
  let mockResponse: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {} as HttpRequest;
    mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  });

  test('Product is found', ({ given, when, then }) => {
    given(/^a product with ID "(.*)" exists$/, (id: string) => {
      mockResponse = {
        statusCode: 200,
        data: { id, nome: 'NomeProduto' },
      };
      (
        ProdutoController.prototype.buscarProdutoPorId as jest.Mock
      ).mockResolvedValue(mockResponse);
    });

    when('I call GET /produtos/produto/123', async () => {
      await apiRoutes(fastifyInstance);
      const routeHandler = fastifyInstance.get.mock.calls[1][1];
      await routeHandler(mockRequest, mockReply);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(mockReply.status).toHaveBeenCalledWith(Number(status));
    });

    then(
      /^the response data should contain the product with ID "(.*)"/,
      (id: string) => {
        expect(mockReply.send).toHaveBeenCalledWith({
          id,
          nome: 'NomeProduto',
        });
      }
    );
  });

  test('Product is not found', ({ given, when, then }) => {
    given(/^a product with ID "(.*)" does not exist$/, () => {
      mockResponse = {
        statusCode: 404,
        data: { message: 'Produto não encontrado' },
      };
      (
        ProdutoController.prototype.buscarProdutoPorId as jest.Mock
      ).mockResolvedValue(mockResponse);
    });

    when('I call GET /produtos/produto/123', async () => {
      await apiRoutes(fastifyInstance);
      const routeHandler = fastifyInstance.get.mock.calls[1][1];
      await routeHandler(mockRequest, mockReply);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(mockReply.status).toHaveBeenCalledWith(Number(status));
    });

    then(/^the response data should be "(.*)"$/, (message: string) => {
      expect(mockReply.send).toHaveBeenCalledWith({
        message,
      });
    });
  });

  test('Product ID is not provided', ({ given, when, then }) => {
    given('the request does not have an ID', () => {
      mockResponse = {
        statusCode: 400,
        data: { err: 'ID do produto é obrigatório!' },
      };
      (
        ProdutoController.prototype.buscarProdutoPorId as jest.Mock
      ).mockResolvedValue(mockResponse);
    });

    when('I call GET /produtos/produto/', async () => {
      await apiRoutes(fastifyInstance);
      const routeHandler = fastifyInstance.get.mock.calls[1][1];
      await routeHandler(mockRequest, mockReply);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(mockReply.status).toHaveBeenCalledWith(Number(status));
    });

    then(/^the response data should be "(.*)"$/, (message: string) => {
      expect(mockReply.send).toHaveBeenCalledWith({
        err: message,
      });
    });
  });
});
