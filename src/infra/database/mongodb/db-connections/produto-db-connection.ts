import { ProdutoModel } from '../models';
import { MongoDbConnection } from './db-connections';

export class ProdutoDbConnection extends MongoDbConnection {
  public constructor() {
    super(ProdutoModel);
  }
}
