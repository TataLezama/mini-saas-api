import { Request, Response } from 'express';
import { CompanyService } from '../services';
import { CustomError } from '../errors/custom.error';
import { Validators } from '../utils';
import { PaginationDto } from '../modules/shared/pagination.dto';
import { CreateCompanyDto, UpdateCompanyDto } from '../modules';


export class CompanyController {

    constructor(
        private readonly companyService: CompanyService,
    ) {}

    private handleError = (res: Response, error: Error) => {
        if ( error instanceof CustomError ){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    createCompany = (req: Request, res: Response) => {
        const { id, email } = req.body.user;
        const [error, createCompanyDto] = CreateCompanyDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.companyService.createCompany(id, createCompanyDto!)
        .then(company => res.json(company))
        .catch(error => this.handleError(res, error));
    }

    getCompanies = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        
        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.companyService.getCompanies(paginationDto!)
        .then(companies => res.json(companies))
        .catch(error => this.handleError(res, error));
        
    }

    getCompany = (req: Request, res: Response) => {
        const { id } = req.params;
        if ( !Validators.isMongoID(id) ) return res.status(400).json({ error: 'Invalid id' });

        this.companyService.getCompany(id)
        .then(company => res.json(company))
        .catch(error => this.handleError(res, error));
    }

    updateCompany = (req: Request, res: Response) => {
        const { id: userId } = req.body.user;
        const { id } = req.params;
        if ( !Validators.isMongoID(id) ) return res.status(400).json({ error: 'Invalid id' });

        const [error, updateCompanyDto] = UpdateCompanyDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.companyService.updateCompany(userId, id, updateCompanyDto!)
        .then(company => res.json(company))
        .catch(error => this.handleError(res, error));
    }

    activateCompany = (req: Request, res: Response) => {
        const { id } = req.params;
        if ( !Validators.isMongoID(id) ) return res.status(400).json({ error: 'Invalid id' });

        this.companyService.activateCompany(id)
        .then(company => res.json(company))
        .catch(error => this.handleError(res, error));
    }
    
}