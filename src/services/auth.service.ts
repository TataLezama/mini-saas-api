import { envs, prisma } from "../configs";
import { EmailService } from "./email.service";
import { generateToken, validateToken, hashPassword, comparePassword } from "../utils";
import { RegisterUserDto, LoginUserDto } from "../modules";
import { CustomError } from "../errors/custom.error";
import { ChangePasswordDto } from '../modules/auth/change-password.dto';
import { UserEntity } from "../database/entities/User.entity";


export class AuthService {

    constructor(
        private readonly emailService: EmailService,
    ) {}

    public async registerUser( registerUserDto: RegisterUserDto ) {
        const userExist = await prisma.user.findFirst({ where: { email: registerUserDto.email } });
        if (userExist) throw CustomError.badRequest('User already exists');

        try{
            const user = await prisma.user.create({
                data: {
                    ...registerUserDto,
                    password: await hashPassword(registerUserDto.password),
                }
            });

            // Encriptar contraseña
            user.password = await hashPassword(registerUserDto.password);

            await prisma.user.update({
                where: { id: user.id },
                data: user,
            });

            // Email de validación
            this.sendEmailWithValidationLink(user.id, user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await generateToken({id: user.id, email: user.email});
            if (!token) throw CustomError.internalServerError('Error generating token');

            return {
                user: userEntity,
                token: token,
            };
        } catch (error) {
            throw CustomError.internalServerError(`${ error }`);
        }
    }

    public async loginUser( loginUserDto: LoginUserDto ) {

        const userExist = await prisma.user.findFirst({ where: { email: loginUserDto.email } });
        if (!userExist) throw CustomError.badRequest('Email not exist');

        const isMatch = comparePassword(loginUserDto.password, userExist.password);
        if (!isMatch) throw CustomError.badRequest('Invalid password');

        const { password, id, ...userEntity } = UserEntity.fromObject(userExist);

        const token = await generateToken({id: userExist.id, email: userExist.email});
        if (!token) throw CustomError.internalServerError('Error generating token');

        return {
            user: userEntity,
            token: token,
        }
    }

    public async recoverPassword( email: string ) {
        const userExist = await prisma.user.findFirst({ where: { email } });
        if (!userExist) throw CustomError.badRequest('User not exist');

        const token = await generateToken({id: userExist.id, email: userExist.email});
        if (!token) throw CustomError.internalServerError('Error generating token');

        const link = `${ envs.WEBSERVICE_URL }/auth/change-password/${ token }`;
        const htmlBody = `<h1>Recover your password</h1>
        <p>Click on the following link to restart your password</p>
        <a href="${ link }">Recover your password</a>`;

        const options = {
            to: email,
            subject: 'Recover your password',
            htmlBody,
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServerError('Error sending email');

        return true;
    }

    public async changePassword(changePasswordDto: ChangePasswordDto) {
        const { token, email, password, newPassword } = changePasswordDto;

        const payload = await validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const { email: emailPayload } = payload as { email: string };
        if (!emailPayload) throw CustomError.badRequest('Email not in token');

        const userExist = await prisma.user.findFirst({ where: { email } });
        if (!userExist) throw CustomError.badRequest('User not exist');
        if (!userExist.emailValidated) throw CustomError.badRequest('Email not validated');
        if (emailPayload !== userExist.email) throw CustomError.badRequest('Invalid email');
        
        if (!comparePassword(password, userExist.password)) throw CustomError.badRequest('Invalid password');
        
        userExist.password = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userExist.id },
            data: userExist,
        });

        return true;
    }

    private sendEmailWithValidationLink = async (id: string, email: string) => {
        const token = await generateToken({id, email});
        if (!token) throw CustomError.internalServerError('Error generating token');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const htmlBody = `<h1>Welcome!</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${ link }">Validate your email: ${ email }</a>`;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody,
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServerError('Error sending email');

        return true;
    }

    public validateEmail = async (token: string) => {
        const payload = await validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if (!email) throw CustomError.badRequest('Email not in token');

        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) throw CustomError.badRequest('Email not exist');

        // Enviar email de confirmación
        this.sendEmailConfirmed(user.email);

        user.emailValidated = true;
        await prisma.user.update({
            where: { id: user.id },
            data: user,
        });
        
        return true;
    }

    private sendEmailConfirmed = async (email: string) => {
        const htmlBody = `<h1>Email confirmed</h1>
        <p>Your email has been confirmed</p>`;

        const options = {
            to: email,
            subject: 'Email confirmed',
            htmlBody,
        }

        const isSet = await this.emailService.sendEmail(options);
        if (!isSet) throw CustomError.internalServerError('Error sending email');

        return true;
    }

}