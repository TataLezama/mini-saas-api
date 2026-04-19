import { Decimal } from "@prisma/client/runtime/library";

export class ProductEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public price: Decimal,
    public duration_minutes: number,
    public image: string | null,
    public active: boolean = false,
    public companyId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static fromObject(object: { [key: string]: any }): ProductEntity {
    const { id, name, description, price, duration_minutes, image, active, companyId, createdAt, updatedAt } = object;

    if (!id) throw new Error('Product id is required');
    if (!name) throw new Error('Product name is required');
    if (!price) throw new Error('Product price is required');
    if (!duration_minutes) throw new Error('Product duration is required');
    if (!companyId) throw new Error('Company is required');

    return new ProductEntity(
      id,
      name,
      description ?? null,
      price,
      duration_minutes,
      image ?? null,
      active ?? false,
      companyId,
      createdAt,
      updatedAt,
    );
  }
}
