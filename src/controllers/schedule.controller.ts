import { Request, Response } from 'express';
import { CustomError } from '../errors/custom.error';
import { Validators } from '../utils';
import { PaginationDto } from '../modules/shared/pagination.dto';
import { ScheduleService } from '../services';
import { CreateScheduleDto, UpdateScheduleDto } from '../modules';



export class ScheduleController {

    constructor(
        private readonly scheduleService: ScheduleService,
    ) {}

    private handleError = (res: Response, error: Error) => {
        if ( error instanceof CustomError ){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    getShedules = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        
        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.scheduleService.getSchedules(paginationDto!)
        .then(shedules => res.json(shedules))
        .catch(error => this.handleError(res, error));
    }

    getShcedule = (req: Request, res: Response) => {
        const { id } = req.params;
        if ( !Validators.isUUID(id) ) return res.status(400).json({ error: 'Invalid id' });

        this.scheduleService.getSchedule(id)
        .then(shedule => res.json(shedule))
        .catch(error => this.handleError(res, error));
    }

    getShedulesByCompany = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        const { companyId } = req.params;

        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if ( !Validators.isUUID(companyId) ) return res.status(400).json({ error: 'Invalid id' });

        this.scheduleService.getSchedulesByCompany(companyId, paginationDto! )
        .then(shedules => res.json(shedules))
        .catch(error => this.handleError(res, error));
    }

    createSchedule = (req: Request, res: Response) => {
        const { id } = req.body.user;

        const [error, createScheduleDto] = CreateScheduleDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.scheduleService.createSchedule(id, createScheduleDto!)
        .then(schedule => res.json(schedule))
        .catch(error => this.handleError(res, error));
    }

    updateSchedule = (req: Request, res: Response) => {
        const { id: userId } = req.body.user;
        const { id } = req.params;
        if ( !Validators.isUUID(id) ) return res.status(400).json({ error: 'Invalid id' });

        const [error, updateScheduleDto] = UpdateScheduleDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.scheduleService.updateSchedule(userId, id, updateScheduleDto!)
        .then(schedule => res.json(schedule))
        .catch(error => this.handleError(res, error));
    }
    
}