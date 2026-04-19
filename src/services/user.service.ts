import { PaginationDto, UpdateUserDto } from "../modules";
import { CustomError } from "../errors/custom.error";
import { hashPassword } from "../utils";
import { prisma } from "../configs";
import { UserEntity } from "../database/entities/User.entity";

export class UserService {

    constructor() {}

    public async getUsers(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {

            const [total, users] = await Promise.all([
                prisma.user.count(),
                prisma.user.findMany({
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/users?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/users?page=${ page - 1 }&limit=${ limit }` : null,
                users: users,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async getUser(id: string) {
        const userExist = await prisma.user.findUnique({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');

        const { password, ...userEntity } = UserEntity.fromObject(userExist);

        return userEntity;
    }

    public async updateUser( id: string, updateUserDto: UpdateUserDto ) {
        const userExist = await prisma.user.findUnique({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (userExist.role !== 'admin' && (userExist.id !== updateUserDto.userId)) throw CustomError.badRequest('You are not authorized');

        try {
            if (updateUserDto.name !== '') userExist.name = updateUserDto.name ?? '';
            if (updateUserDto.phone !== '') userExist.phone = updateUserDto.phone ?? '';
            if (updateUserDto.password && updateUserDto.password !== '') userExist.password = await hashPassword(updateUserDto.password ?? '');

            if ( userExist.role === 'admin' ) {
                // if (updateUserDto.role !== '') userExist.role = updateUserDto.role ?? '';
            }
            
            await prisma.user.update({
                where: { id },
                data: userExist,
            });
            
            return userExist;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }

    }

}