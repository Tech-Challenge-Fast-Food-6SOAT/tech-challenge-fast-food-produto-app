/* eslint-disable no-underscore-dangle */
import type { Categoria } from './categoria';

export class Produto {
  public constructor(
    private readonly _id: string,
    private readonly _categoria: Categoria,
    private readonly _nome: string,
    private readonly _preco: number,
    private readonly _descricao: string
  ) {}

  public get id(): string {
    return this._id;
  }

  public get categoria(): Categoria {
    return this._categoria;
  }

  public get nome(): string {
    return this._nome;
  }

  public get preco(): number {
    return this._preco;
  }

  public get descricao(): string {
    return this._descricao;
  }
}
