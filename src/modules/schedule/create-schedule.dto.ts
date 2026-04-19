export class CreateScheduleDto {
  private constructor(
    public readonly day_of_week: string,
    public readonly start_time: string,
    public readonly end_time: string,
    public readonly is_available: boolean = true,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateScheduleDto?] {
    const { day_of_week, start_time, end_time, is_available, companyId, userId } = object;

    if (!day_of_week) return ['Missing day of week'];
    if (!start_time) return ['Missing start time'];
    if (!end_time) return ['Missing end time'];
    if (!companyId) return ['Missing company'];
    if (!userId) return ['Missing user'];

    return [undefined, new CreateScheduleDto(day_of_week, start_time, end_time, is_available ?? true, companyId, userId)];
  }
}
