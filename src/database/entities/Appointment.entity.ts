export class AppointmentEntity {
  constructor(
    public readonly id: string,
    public notes: string,
    public paid: boolean = false,
    public accepted: boolean = false,
    public productId: string,
    public scheduleId: string,
    public userId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static fromObject(object: { [key: string]: any }): AppointmentEntity {
    const { id, notes, paid, accepted, productId, scheduleId, userId, createdAt, updatedAt } = object;

    if (!id) throw new Error('Appointment id is required');
    if (!userId) throw new Error('Appointment user is required');
    if (!productId) throw new Error('Appointment product is required');
    if (!scheduleId) throw new Error('Appointment schedule is required');
    if (!notes) throw new Error('Appointment notes is required');

    return new AppointmentEntity(
      id,
      notes,
      paid ?? false,
      accepted ?? false,
      productId,
      scheduleId,
      userId,
      createdAt,
      updatedAt,
    );
  }
}
