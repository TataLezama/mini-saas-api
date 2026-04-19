export class UpdateAppointmentDto {
  private constructor(
    public readonly notes: string | undefined,
    public readonly paid: boolean | undefined,
    public readonly accepted: boolean | undefined,
    public readonly productId: string | undefined,
    public readonly scheduleId: string | undefined,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateAppointmentDto?] {
    const { notes, paid, accepted, productId, scheduleId, userId } = object;

    if (!userId) return ['Missing user'];

    return [undefined, new UpdateAppointmentDto(notes, paid, accepted, productId, scheduleId, userId)];
  }
}
