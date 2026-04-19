import { CreateCompanyDto, PaginationDto, UpdateCompanyDto } from "../modules";
import { CustomError } from "../errors/custom.error";
import { EmailService } from "./email.service";
import { prisma } from "../configs";
import { CompanyEntity } from "../database/entities/Company.entity";



export class CompanyService {

    constructor(
        private readonly emailService: EmailService,
    ) {}

    public async  getCompanies(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {

            const [total, companies] = await Promise.all([
                prisma.company.count(),
                prisma.company.findMany({
                    skip: page * limit,
                    take: limit,
                }),
            ]);
            
            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/companies?page=${ page + 1 }&limit=${ limit }`,
                previous: (page - 1 > 0) ? `/api/companies?page=${ page - 1 }&limit=${ limit }` : null,
                users: companies,
            }
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async createCompany(id: string, createCompanyDto: CreateCompanyDto) {
        const companyExist = await prisma.company.findFirst({ where: { name: createCompanyDto.name } });
        if (companyExist) throw CustomError.badRequest('Company already exists');

        const userExist = await prisma.user.findFirst({ where: { id } });
        if ( !userExist ) throw CustomError.badRequest('User not exist');
        if ( !userExist.emailValidated ) throw CustomError.badRequest('User not validated');
        if ( userExist.id !== createCompanyDto.userId ) throw CustomError.badRequest('You are not authorized');
        
        try{
            const company = new prisma.company({
                ...createCompanyDto,
                userId: userExist.id,
            });

            await company.save();

            const { ...companyEntity } = CompanyEntity.fromObject(company);

            return companyEntity;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async getCompany(id: string) {
        const companyExist = await prisma.company.findFirst({ where: { id } });
        if (!companyExist) throw CustomError.badRequest('Company not exist');

        const { ...companyEntity } = CompanyEntity.fromObject(companyExist);

        return companyEntity;
    }

    public async activateCompany(id: string) {
        const companyExist = await prisma.company.findFirst({ where: { id } });
        if (!companyExist) throw CustomError.badRequest('Company not exist');
        if (companyExist.active) throw CustomError.badRequest('Company already active');
        
        try{
            companyExist.active = true;
            await companyExist.save();

            const user = await prisma.user.findFirst({ where: { id: companyExist.userId } });
            if (!user) throw CustomError.badRequest('User not exist');
            if (!user.emailValidated) throw CustomError.badRequest('User not validated');
            
            this.sendEmailCompanyActivated(user.email);

            return companyExist;
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async updateCompany(userId: string, id: string, updateCompanyDto: UpdateCompanyDto) {
        const userExist = await prisma.user.findFirst({ where: { id } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (userExist.id !== updateCompanyDto.userId) throw CustomError.badRequest('User are not authorized');
        
        const companyExist = ( userExist.role === 'admin')
            ? await prisma.company.findFirst({ where: { id } })
            : await prisma.company.findFirst({
                where: {
                    id,
                    userId: userExist.id,
                },
            });
        if (!companyExist) throw CustomError.badRequest('Company not exist');
        if (!companyExist.active) throw CustomError.badRequest('Company not active');

        try{
            if (updateCompanyDto.name !== '') {
                const isExist = await prisma.company.findFirst({ where: { name: updateCompanyDto.name } });
                if (isExist) throw CustomError.badRequest('This name is already in use');
                
                companyExist.name = updateCompanyDto.name;
                companyExist.active = false;
            }
            if (updateCompanyDto.description !== '') companyExist.description = updateCompanyDto.description;
            if (updateCompanyDto.phone !== '') companyExist.phone = updateCompanyDto.phone;
            if (updateCompanyDto.image !== '') companyExist.image = updateCompanyDto.image;
            
            await companyExist.save();
            
            return companyExist;

        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    sendEmailCompanyActivated = async (email: string) => {
        const htmlBody = `<h1>Company activated</h1>
        <p>Your company has been activated</p>`;

        const options = {
            to: email,
            subject: 'Company activated',
            htmlBody,
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServerError('Error sending email');

        return true;
    }

}