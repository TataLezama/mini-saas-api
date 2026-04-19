import { Request, Response } from 'express';
import { UserService } from '../services';
import { CustomError } from '../errors/custom.error';
import { Validators } from '../utils';
import { PaginationDto } from '../modules/shared/pagination.dto';


export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    private handleError = (res: Response, error: Error) => {
        if ( error instanceof CustomError ){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    getUsers = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        
        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.userService.getUsers(paginationDto!)
        .then(users => res.json(users))
        .catch(error => this.handleError(res, error));
        
    }

    getUser = (req: Request, res: Response) => {
        const { id } = req.params;
        if ( !Validators.isMongoID(id) ) return res.status(400).json({ error: 'Invalid id' });

        this.userService.getUser(id)
        .then(user => res.json(user))
        .catch(error => this.handleError(res, error));
    }

    updateUser = (req: Request, res: Response) => {
        res.json('updateUser');
    }
    
}