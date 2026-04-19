import { Decimal } from "@prisma/client/runtime/library";

export class UpdateProductDto {
  private constructor(
    public readonly name: string | undefined,
    public readonly description: string | undefined,
    public readonly price: Decimal | undefined,
    public readonly image: string | undefined,
    public readonly duration_minutes: number | undefined,
    public readonly active: boolean | undefined,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateProductDto?] {
    const { name, description, price, image, duration_minutes, active, companyId, userId } = object;

    if (!companyId) return ['Missing company'];
    if (!userId) return ['Missing user'];

    return [
      undefined,
      new UpdateProductDto(
        name,
        description,
        price !== undefined ? new Decimal(price) : undefined,
        image,
        duration_minutes !== undefined ? Number(duration_minutes) : undefined,
        active,
        companyId,
        userId,
      ),
    ];
  }
}
