export class UpdateCompanyDto {
  private constructor(
    public readonly name: string | undefined,
    public readonly description: string | undefined,
    public readonly phone: string | undefined,
    public readonly image: string | undefined,
    public readonly active: boolean | undefined,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateCompanyDto?] {
    const { name, description, phone, image, active, userId } = object;

    if (!userId) return ['Missing user'];

    return [undefined, new UpdateCompanyDto(name, description, phone, image, active, userId)];
  }
}
