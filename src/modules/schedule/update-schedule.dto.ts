export class UpdateScheduleDto {
  private constructor(
    public readonly day_of_week: string | undefined,
    public readonly start_time: string | undefined,
    public readonly end_time: string | undefined,
    public readonly is_available: boolean | undefined,
    public readonly companyId: string,
    public readonly userId: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateScheduleDto?] {
    const { day_of_week, start_time, end_time, is_available, companyId, userId } = object;

    if (!companyId) return ['Missing company'];
    if (!userId) return ['Missing user'];

    return [undefined, new UpdateScheduleDto(day_of_week, start_time, end_time, is_available, companyId, userId)];
  }
}
