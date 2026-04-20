import { CustomError } from "../errors/custom.error";
import { CreateScheduleDto, PaginationDto, UpdateScheduleDto } from "../modules";
import { prisma } from "../configs";
import { ScheduleEntity } from "../database/entities/Schedule.entity";

export class ScheduleService {

    constructor() {}

    public async getSchedules(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {

            const [total, schedules] = await Promise.all([
                prisma.schedule.count(),
                prisma.schedule.findMany({
                    skip: (page - 1) * limit,
                    take: limit
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/schedules?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/schedules?page=${ page - 1 }&limit=${ limit }` : null,
                users: schedules,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async getSchedule(id: string) {
        const scheduleExist = await prisma.schedule.findUnique({ where: { id } });
        if (!scheduleExist) throw CustomError.badRequest('Schedule not exist');

        const { ...scheduleEntity } = ScheduleEntity.fromObject(scheduleExist);

        return scheduleExist;
    }

    public async getSchedulesByCompany(companyId: string, paginationDto: PaginationDto) {
        const companyExist = await prisma.company.findUnique({ where: { id: companyId } });
        if (!companyExist) throw CustomError.badRequest('Company not exist');

        const { page, limit } = paginationDto;

        try {
            const [total, schedules] = await Promise.all([
                prisma.schedule.count(),
                prisma.schedule.findMany({
                    where: {
                        companyId: companyExist.id,
                    },
                    skip: (page - 1) * limit,
                    take: limit
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/schedules?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/schedules?page=${ page - 1 }&limit=${ limit }` : null,
                users: schedules,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

    public async createSchedule( id: string, createScheduleDto: CreateScheduleDto ) {
        const { userId, ...dataDto } = createScheduleDto;
        const userExist = await prisma.user.findUnique({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('User not validated');
        if (userExist.id !== userId) throw CustomError.badRequest('You are not authorized');

        const companyExist = ( userExist.role === 'admin')
            ? await prisma.company.findUnique({ where: { id: dataDto.companyId } })
            : await prisma.company.findFirst({
                where: {
                    id: dataDto.companyId,
                    userId: userExist.id,
                },
        });
        if (!companyExist) throw CustomError.badRequest('Company not exist');
        if (!companyExist.active) throw CustomError.badRequest('Company not active');

        try {
            const schedule = await prisma.schedule.create({
                data: {
                    ...dataDto,
                    companyId: companyExist.id,
                }
            });

            await prisma.schedule.update({
                where: { id: schedule.id },
                data: schedule,
            });

            return schedule;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
        
    }

    public async updateSchedule(userId: string, id: string, updateScheduleDto: UpdateScheduleDto ) {
        // const userExist = await prisma.user.findFirst({ where: { id } });
        // if (!userExist) throw CustomError.badRequest('User not exist');
        // if (userExist.id !== updateScheduleDto.userId) throw CustomError.badRequest('User are not authorized');
        
        // const scheduleExist = ( userExist.role === 'admin')
        //     ? await prisma.schedule.findFirst({ where: { id } })
        //     : await prisma.schedule.findFirst({
        //         where: {
        //             id,
        //             userId: userExist.id,
        //         },
        //     });
        // if (!scheduleExist) throw CustomError.badRequest('Schedule not exist');

        // try {
            
        //     if (updateScheduleDto.day_of_week !== '') scheduleExist.day_of_week = updateScheduleDto.day_of_week ?? '';
        //     if (updateScheduleDto.start_time !== '') scheduleExist.start_time = updateScheduleDto.start_time ?? '';
        //     if (updateScheduleDto.end_time !== '') scheduleExist.end_time = updateScheduleDto.end_time ?? '';
        //     if (updateScheduleDto.is_available) scheduleExist.is_available = updateScheduleDto.is_available ?? false;
            
        //     await prisma.schedule.update({
        //         where: { id },
        //         data: scheduleExist,
        //     });
            
        //     return scheduleExist;
        // } catch (error) {
        //     throw CustomError.internalServerError(`${ error }`);
        // }
    }

}