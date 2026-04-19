import { Request, Response } from 'express';
import { AppointmentService } from "../services";
import { CustomError } from '../errors/custom.error';
import { CreateAppointmentDto, PaginationDto, UpdateAppointmentDto } from '../modules';
import { Validators } from '../utils';

export class AppointmentController {

    constructor(
        private readonly appoimentService: AppointmentService,
    ) {}

    private handleError = (res: Response, error: Error) => {
        if ( error instanceof CustomError ){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    getAppoiments = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        
        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.appoimentService.getAppointments(paginationDto!)
        .then(appointments => res.json(appointments))
        .catch(error => this.handleError(res, error));
    }

    getAppoiment = (req: Request, res: Response) => {
        const { id: userId } = req.body.user;
        const { id } = req.params;
        if ( !Validators.isUUID(id) ) return res.status(400).json({ error: 'Invalid id' });

        this.appoimentService.getAppointment(userId, id)
        .then(appointment => res.json(appointment))
        .catch(error => this.handleError(res, error));
    }

    getAppoimentsByCompany = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        const { companyId } = req.params;
        const { id: userId } = req.body.user;

        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if ( !Validators.isUUID(companyId) ) return res.status(400).json({ error: 'Invalid id' });

        this.appoimentService.getAppointmentsByCompany(userId, companyId, paginationDto! )
        .then(appointments => res.json(appointments))
        .catch(error => this.handleError(res, error));
    }

    getAppointmentsByProduct = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        const { productId } = req.params;
        const { id: userId } = req.body.user;

        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if ( !Validators.isUUID(productId) ) return res.status(400).json({ error: 'Invalid id' });

        this.appoimentService.getAppointmentsByProduct(userId, productId, paginationDto! )
        .then(appointments => res.json(appointments))
        .catch(error => this.handleError(res, error));
    }

    getAppointmentsBySchedule = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        const { scheduleId } = req.params;
        const { id: userId } = req.body.user;

        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if ( !Validators.isUUID(scheduleId) ) return res.status(400).json({ error: 'Invalid id' });

        this.appoimentService.getAppointmentsBySchedule(userId, scheduleId, paginationDto! )
        .then(appointments => res.json(appointments))
        .catch(error => this.handleError(res, error));
    }

    getAppointmentsByUser = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        const { userId } = req.params;
        const { id: userId2 } = req.body.user;

        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if ( !Validators.isUUID(userId) ) return res.status(400).json({ error: 'Invalid id' });

        this.appoimentService.getAppointmentsByUser(userId, userId2, paginationDto! )
        .then(appointments => res.json(appointments))
        .catch(error => this.handleError(res, error));
    }

    createAppoiment = (req: Request, res: Response) => {
        const { userId } = req.body.user;

        const [error, createAppoimentDto] = CreateAppointmentDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.appoimentService.createAppointment(userId, createAppoimentDto!)
        .then(appointment => res.json(appointment))
        .catch(error => this.handleError(res, error));
    }

    updateAppoiment = (req: Request, res: Response) => {
        const { id: userId } = req.body.user;
        const { id } = req.params;
        if ( !Validators.isUUID(id) ) return res.status(400).json({ error: 'Invalid id' });

        const [error, updateAppointmentDto] = UpdateAppointmentDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.appoimentService.updateAppointment(userId, id, updateAppointmentDto!)
        .then(appointment => res.json(appointment))
        .catch(error => this.handleError(res, error));
    }
    
}