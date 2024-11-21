import type { FastifyInstance } from 'fastify/types/instance';

import { ProdutoController } from '../../../adapters/controllers';
import apiRoutes from '../../../api/routes';

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
ProdutoController.prototype.buscarProdutoPorCategoria = jest.fn();
ProdutoController.prototype.buscarProdutoPorId = jest.fn();
ProdutoController.prototype.criar = jest.fn();
ProdutoController.prototype.excluir = jest.fn();
ProdutoController.prototype.editar = jest.fn();

describe('apiRoutes', () => {
  const fastifyInstance: jest.Mocked<FastifyInstance> = mockFastifyInstance();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register routes correctly', async () => {
    await apiRoutes(fastifyInstance);

    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/produtos',
      expect.any(Function)
    );
    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/produtos/produto/:id',
      expect.any(Function)
    );
    expect(fastifyInstance.post).toHaveBeenCalledWith(
      '/produtos/produto',
      expect.any(Function)
    );
    expect(fastifyInstance.delete).toHaveBeenCalledWith(
      '/produtos/produto',
      expect.any(Function)
    );
    expect(fastifyInstance.put).toHaveBeenCalledWith(
      '/produtos/produto/:id',
      expect.any(Function)
    );
  });

  it('should call buscarProdutoPorCategoria on GET /produtos', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (
      ProdutoController.prototype.buscarProdutoPorCategoria as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(
      ProdutoController.prototype.buscarProdutoPorCategoria
    ).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call buscarProdutoPorId on GET /produtos/produto/:id', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (
      ProdutoController.prototype.buscarProdutoPorId as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[1][1];
    await routeHandler(mockRequest, mockReply);

    expect(ProdutoController.prototype.buscarProdutoPorId).toHaveBeenCalledWith(
      mockRequest
    );
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call criar on POST /produtos/produto', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (ProdutoController.prototype.criar as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(ProdutoController.prototype.criar).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call excluir on DELETE /produtos/produto', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (ProdutoController.prototype.excluir as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.delete.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(ProdutoController.prototype.excluir).toHaveBeenCalledWith(
      mockRequest
    );
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('Should call editar on PUT /produtos/produto/:id', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (ProdutoController.prototype.editar as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.put.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(ProdutoController.prototype.editar).toHaveBeenCalledWith(
      mockRequest
    );
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });
});
