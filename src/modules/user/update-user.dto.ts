import { Role } from '@prisma/client';

export class UpdateUserDto {
  private constructor(
    public readonly name: string | undefined,
    public readonly phone: string | undefined,
    public readonly password: string | undefined,
    public readonly role: Role | undefined,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
    const { name, phone, password, role, userId } = object;

    if (!userId) return ['Missing user'];

    if (role && !Object.values(Role).includes(role)) return ['Invalid role, must be admin or user'];

    return [undefined, new UpdateUserDto(name, phone, password, role, userId)];
  }
}
