import { MongoDbConnection } from '../../../infra/database/mongodb/db-connections/db-connections';
import { ProdutoDbConnection } from '../../../infra/database/mongodb/db-connections/produto-db-connection';
import { ProdutoModel } from '../../../infra/database/mongodb/models';

jest.mock('../../../infra/database/mongodb/models');
jest.mock(
  '../../../infra/database/mongodb/db-connections/db-connections',
  () => ({
    MongoDbConnection: jest.fn(),
  })
);

describe('ProdutoDbConnection', () => {
  it('should extend MongoDbConnection with ProdutoModel', () => {
    const produtoDbConnection = new ProdutoDbConnection();

    expect(MongoDbConnection).toHaveBeenCalledWith(ProdutoModel);
    expect(produtoDbConnection).toBeInstanceOf(MongoDbConnection);
  });
});
