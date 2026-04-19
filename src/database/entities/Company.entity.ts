export class CompanyEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public phone: string,
    public image: string | null,
    public active: boolean = false,
    public userId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static fromObject(object: { [key: string]: any }): CompanyEntity {
    const { id, name, description, phone, image, active, userId, createdAt, updatedAt } = object;

    if (!id) throw new Error('Company id is required');
    if (!name) throw new Error('Company name is required');
    if (!userId) throw new Error('User is required');

    return new CompanyEntity(
      id,
      name,
      description ?? null,
      phone,
      image ?? null,
      active ?? false,
      userId,
      createdAt,
      updatedAt,
    );
  }
}
