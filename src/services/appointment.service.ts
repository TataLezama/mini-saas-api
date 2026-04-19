import { prisma } from "../configs";
import { AppointmentEntity } from "../database/entities/Appointment.entity";
import { CustomError } from "../errors/custom.error";
import { CreateAppointmentDto, PaginationDto, UpdateAppointmentDto } from "../modules";
import { EmailService } from "./email.service";


export class AppointmentService {

    constructor(
        private readonly emailService: EmailService,
    ) {}

    public async getAppointments(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {

            const [total, appoiments] = await Promise.all([
                prisma.appointment.count(),
                prisma.appointment.findMany({
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/appoiments?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/appoiments?page=${ page - 1 }&limit=${ limit }` : null,
                users: appoiments,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async getAppointment(userId:string, id: string) {
        const userExist = await prisma.user.findFirst({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');
        
        const appointmentExist = await prisma.appointment.findFirst({ where: { id } });
        if (!appointmentExist) throw CustomError.badRequest('Appointment not exist');

        if (userExist.id !== appointmentExist.userId) throw CustomError.badRequest('User not authorized');

        const { ...appoimentEntity } = AppointmentEntity.fromObject(appointmentExist);

        return appoimentEntity;
    }

    public async getAppointmentsByCompany(userId: string, companyId: string, paginationDto: PaginationDto) {
        const userExist = await prisma.user.findFirst({ where: { id: userId } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');

        const companyExist = ( userExist.role === 'admin')
            ? await prisma.company.findFirst({ where: { id: companyId } })
            : await prisma.company.findFirst({
                where: {
                    id: companyId,
                    userId: userExist.id,
                },
        });
        if (!companyExist) throw CustomError.badRequest('Company not exist');

        const { page, limit } = paginationDto;

        try {
            const [total, appointments] = await Promise.all([
                prisma.appointment.count(),
                prisma.appointment.findMany({
                    where: {
                        
                    },
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/appointments?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/appointments?page=${ page - 1 }&limit=${ limit }` : null,
                users: appointments,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    public async getAppointmentsByProduct(userId: string, productId: string, paginationDto: PaginationDto) {
        const userExist = await prisma.user.findFirst({ where: { id: userId } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');

        const productExist = await prisma.product.findFirst({ where: { id: productId } });
        if (!productExist) throw CustomError.badRequest('Product not exist');
        if (!productExist.active) throw CustomError.badRequest('Product not active');

        const { page, limit } = paginationDto;

        try {
            const [total, appointments] = await Promise.all([
                prisma.appointment.count(),
                prisma.appointment.findMany({
                    where: {
                        productId: productExist.id,
                    },
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/appointments?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/appointments?page=${ page - 1 }&limit=${ limit }` : null,
                users: appointments,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    public async getAppointmentsBySchedule(userId: string, scheduleId: string, paginationDto: PaginationDto) {
        const userExist = await prisma.user.findFirst({ where: { id: userId } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');

        const scheduleExist = await prisma.schedule.findFirst({ where: { id: scheduleId } });
        if (!scheduleExist) throw CustomError.badRequest('Schedule not exist');
        if (!scheduleExist.is_available) throw CustomError.badRequest('Schedule not available');

        const { page, limit } = paginationDto;

        try {
            const [total, appointments] = await Promise.all([
                prisma.appointment.count(),
                prisma.appointment.findMany({
                    where: {
                        scheduleId: scheduleExist.id,
                    },
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/appointments?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/appointments?page=${ page - 1 }&limit=${ limit }` : null,
                users: appointments,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    public async getAppointmentsByUser(userId: string, userId2: string, paginationDto: PaginationDto) {
        const userExist = await prisma.user.findFirst({ where: { id: userId } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');
        if (userExist.id !== userId2) throw CustomError.badRequest('User not authorized');

        const { page, limit } = paginationDto;

        try {
            const [total, appointments] = await Promise.all([
                prisma.appointment.count(),
                prisma.appointment.findMany({
                    where: {
                        userId: userExist.id,
                    },
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/appointments?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/appointments?page=${ page - 1 }&limit=${ limit }` : null,
                users: appointments,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    public async createAppointment( userId: string, createAppointmentDto: CreateAppointmentDto ) {
        const userExist = await prisma.user.findFirst({ where: { id: userId } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');
        if (userExist.id !== createAppointmentDto.userId) throw CustomError.badRequest('User not authorized');

        const productExist = await prisma.product.findFirst({ where: { id: createAppointmentDto.productId } });
        if (!productExist) throw CustomError.badRequest('Product not exist');
        if (!productExist.active) throw CustomError.badRequest('Product not active');

        const scheduleExist = await prisma.schedule.findFirst({ where: { id: createAppointmentDto.scheduleId } });
        if (!scheduleExist) throw CustomError.badRequest('Schedule not exist');
        if (!scheduleExist.is_available) throw CustomError.badRequest('Schedule not available');

        try {
            
            const appointment = await prisma.appointment.create({
                data: {
                    ...createAppointmentDto,
                    productId: productExist.id,
                    scheduleId: scheduleExist.id,
                    userId: userExist.id,
                }
            });
            await prisma.appointment.update({
                where: { id: appointment.id },
                data: appointment,
            });
            return appointment;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
        
    }

    public async acceptAppointment( userId: string, id: string ) {
        const userExist = await prisma.user.findFirst({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');

        const appointmentExist = await prisma.appointment.findFirst({ where: { id } });
        if (!appointmentExist) throw CustomError.badRequest('Appointment not exist');
        if (userExist.id !== appointmentExist.userId) throw CustomError.badRequest('User not authorized');

        try {
            appointmentExist.accepted = true;
            await prisma.appointment.update({
                where: { id },
                data: appointmentExist,
            });
            
            const user = await prisma.user.findFirst({ where: { id: appointmentExist.userId } });
            if (!user) throw CustomError.badRequest('User not exist');
            if (!user.emailValidated) throw CustomError.badRequest('User not validated');

            this.sendEmailAppointmentAccepted(user.email);

            return appointmentExist;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async updateAppointment( userId: string, id: string, updateAppointmentDto: UpdateAppointmentDto ) {
        const userExist = await prisma.user.findFirst({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (userExist.id !== updateAppointmentDto.userId) throw CustomError.badRequest('User not authorized');

        const appointmentExist = await prisma.appointment.findFirst({ where: { id } });
        if (!appointmentExist) throw CustomError.badRequest('Appointment not exist');
        if (userExist.id !== appointmentExist.userId) throw CustomError.badRequest('User not authorized');

        try {
            if (updateAppointmentDto.notes !== '') appointmentExist.notes = updateAppointmentDto.notes ?? '';
            if (updateAppointmentDto.paid) appointmentExist.paid = updateAppointmentDto.paid;
            if (updateAppointmentDto.accepted) appointmentExist.accepted = updateAppointmentDto.accepted;
            
            await prisma.appointment.update({
                where: { id },
                data: appointmentExist,
            });
            
            return appointmentExist;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    private sendEmailAppointmentAccepted = async (email: string) => {
        const htmlBody = `<h1>Appointment accepted</h1>
        <p>Your appointment has been accepted</p>`;

        const options = {
            to: email,
            subject: 'Appointment accepted',
            htmlBody,
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServerError('Error sending email');

        return true;
    }


}