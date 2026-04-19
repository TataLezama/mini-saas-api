export class ScheduleEntity {
  constructor(
    public readonly id: string,
    public day_of_week: string,
    public start_time: string,
    public end_time: string,
    public is_available: boolean = true,
    public companyId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static fromObject(object: { [key: string]: any }): ScheduleEntity {
    const { id, day_of_week, start_time, end_time, is_available, companyId, createdAt, updatedAt } = object;

    if (!id) throw new Error('Schedule id is required');
    if (!day_of_week) throw new Error('Schedule day_of_week is required');
    if (!start_time) throw new Error('Schedule start_time is required');
    if (!end_time) throw new Error('Schedule end_time is required');
    if (!companyId) throw new Error('Company is required');

    return new ScheduleEntity(
      id,
      day_of_week,
      start_time,
      end_time,
      is_available ?? true,
      companyId,
      createdAt,
      updatedAt,
    );
  }
}
