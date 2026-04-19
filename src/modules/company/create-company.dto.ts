export class CreateCompanyDto {
  private constructor(
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly phone: string,
    public readonly image: string | undefined,
    public readonly active: boolean = false,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateCompanyDto?] {
    const { name, description, phone, image, active, userId } = object;

    if (!name) return ['Missing name'];
    if (!phone) return ['Missing phone'];
    if (!userId) return ['Missing user'];

    return [undefined, new CreateCompanyDto(name, description, phone, image, active ?? false, userId)];
  }
}
