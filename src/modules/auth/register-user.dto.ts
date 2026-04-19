import { regularExps } from '../../utils';

export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, phone, email, password } = object;

    if (!name) return ['Missing name'];
    if (!phone) return ['Missing phone'];
    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Invalid email'];
    if (!password) return ['Missing password'];
    if (password.length < 8) return ['Password must be at least 8 characters'];

    return [undefined, new RegisterUserDto(name, phone, email, password)];
  }
}
