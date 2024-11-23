import { MongoDbConnection } from '@/infra/database/mongodb/db-connections/db-connections';
import { ProdutoDbConnection } from '@/infra/database/mongodb/db-connections/produto-db-connection';
import { ProdutoModel } from '@/infra/database/mongodb/models';

jest.mock('@/infra/database/mongodb/models');
jest.mock('@/infra/database/mongodb/db-connections/db-connections', () => ({
  MongoDbConnection: jest.fn(),
}));

jest.mock('@/infra/database/mongodb', () => ({
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

describe('ProdutoDbConnection', () => {
  it('should extend MongoDbConnection with ProdutoModel', () => {
    const produtoDbConnection = new ProdutoDbConnection();

    expect(MongoDbConnection).toHaveBeenCalledWith(ProdutoModel);
    expect(produtoDbConnection).toBeInstanceOf(MongoDbConnection);
  });
});
