/* eslint-disable no-underscore-dangle */
export type CategoriaEnum =
  | 'Acompanhamento'
  | 'Bebida'
  | 'Lanche'
  | 'Sobremesa';

export class Categoria {
  public constructor(private readonly _categoria: CategoriaEnum) {}

  public get categoria(): CategoriaEnum {
    return this._categoria;
  }
}
