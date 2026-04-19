export class ChangePasswordDto {
  private constructor(
    public readonly token: string,
    public readonly email: string,
    public readonly password: string,
    public readonly newPassword: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, ChangePasswordDto?] {
    const { token, email, password, newPassword } = object;

    if (!token) return ['Missing token'];
    if (!email) return ['Missing email'];
    if (!password) return ['Missing password'];
    if (password.length < 8) return ['Password must be at least 8 characters'];
    if (!newPassword) return ['Missing new password'];
    if (newPassword.length < 8) return ['New password must be at least 8 characters'];

    return [undefined, new ChangePasswordDto(token, email, password, newPassword)];
  }
}
