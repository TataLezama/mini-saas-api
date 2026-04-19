import { Request, Response } from 'express';
import { AuthService } from '../services';
import { CustomError } from '../errors/custom.error';
import { ChangePasswordDto, LoginUserDto, RegisterUserDto } from '../modules';


export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    private handleError = (res: Response, error: Error) => {
        if ( error instanceof CustomError ){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.registerUser(registerUserDto!)
        .then(user => res.json(user))
        .catch(error => this.handleError(res, error));

    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.loginUser(loginUserDto!)
        .then(user => res.json(user))
        .catch(error => this.handleError(res, error));

    }

    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;

        this.authService.validateEmail(token)
        .then(() => res.json('Email validated'))
        .catch(error => this.handleError(res, error));

    }

    recoverPassword = (req: Request, res: Response) => {
        const { email } = req.body;

        this.authService.recoverPassword(email)
        .then(() => res.json('Password recovered'))
        .catch(error => this.handleError(res, error));

    }

    changePassword = (req: Request, res: Response) => {
        const { email, password, newPassword } = req.body;
        const { token } = req.params;

        const [error, changePasswordDto] = ChangePasswordDto.create({
            token,
            email,
            password,
            newPassword,
        });
        if (error) return res.status(400).json({ error });

        this.authService.changePassword(changePasswordDto!)
        .then(() => res.json('Password changed'))
        .catch(error => this.handleError(res, error));
    }
    
}