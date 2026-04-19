export class CreateAppointmentDto {
  private constructor(
    public readonly productId: string,
    public readonly scheduleId: string,
    public readonly userId: string,
    public readonly notes: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateAppointmentDto?] {
    const { scheduleId, productId, userId, notes } = object;

    if (!scheduleId) return ['Missing schedule'];
    if (!productId) return ['Missing product'];
    if (!userId) return ['Missing user'];
    if (!notes) return ['Missing notes'];

    return [undefined, new CreateAppointmentDto(productId, scheduleId, userId, notes)];
  }
}
