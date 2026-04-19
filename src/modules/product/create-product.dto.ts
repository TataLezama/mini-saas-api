import { Decimal } from "@prisma/client/runtime/library";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly price: Decimal,
    public readonly image: string | undefined,
    public readonly duration_minutes: number,
    public readonly active: boolean = false,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, description, price, image, duration_minutes, active, companyId, userId } = object;

    if (!name) return ['Missing name'];
    if (!price) return ['Missing price'];
    if (!duration_minutes) return ['Missing duration'];
    if (!companyId) return ['Missing company'];
    if (!userId) return ['Missing user'];

    return [
      undefined,
      new CreateProductDto(
        name,
        description,
        new Decimal(price),
        image,
        Number(duration_minutes),
        active ?? false,
        companyId,
        userId,
      ),
    ];
  }
}
