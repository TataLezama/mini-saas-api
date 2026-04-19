import { Role } from "@prisma/client";

export class UserEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public phone: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: Role,
    public image: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { id, name, phone, email, emailValidated, password, role, image, createdAt, updatedAt } = object;

    if (!id) throw new Error('User id is required');
    if (!name) throw new Error('User name is required');
    if (!phone) throw new Error('User phone is required');
    if (!email) throw new Error('User email is required');
    if (!password) throw new Error('User password is required');
    if (!role) throw new Error('User role is required');

    return new UserEntity(
      id,
      name,
      phone,
      email,
      emailValidated ?? false,
      password,
      role,
      image ?? null,
      createdAt,
      updatedAt,
    );
  }
}
