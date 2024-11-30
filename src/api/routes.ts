/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { ProdutoController } from '../adapters/controllers/produto';
import { ProdutoGateway } from '../adapters/gateways/produto';
import { ProdutoUseCase } from '../application/usecases/produto';
import { ProdutoDbConnection } from '../infra/database/mongodb/db-connections';
import type { HttpRequest } from '../interfaces/http';

const apiRoutes = async (app: FastifyInstance): Promise<void> => {
  const dbConnection = new ProdutoDbConnection();
  const produtoGateWay = new ProdutoGateway(dbConnection);
  const produtouseCase = new ProdutoUseCase(produtoGateWay);
  const produtoController = new ProdutoController(produtouseCase);

  app.get('/produtos', async (request, reply) => {
    const response = await produtoController.buscarProdutoPorCategoria(
      request as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });

  app.get('/produtos/produto/:id', async (request, reply) => {
    const response = await produtoController.buscarProdutoPorId(
      request as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/produtos/produto', async (request, reply) => {
    const response = await produtoController.criar(request as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.delete('/produtos/produto', async (request, reply) => {
    const response = await produtoController.excluir(request as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.put('/produtos/produto/:id', async (request, reply) => {
    const response = await produtoController.editar(request as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
