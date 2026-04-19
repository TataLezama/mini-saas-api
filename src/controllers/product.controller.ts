import { Request, Response } from 'express';
import { ProductService } from '../services';
import { CustomError } from '../errors/custom.error';
import { Validators } from '../utils';
import { PaginationDto } from '../modules/shared/pagination.dto';
import { CreateProductDto, UpdateProductDto } from '../modules';


export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) {}

    private handleError = (res: Response, error: Error) => {
        if ( error instanceof CustomError ){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.error(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    getProducts = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        
        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.productService.getProducts(paginationDto!)
        .then(products => res.json(products))
        .catch(error => this.handleError(res, error));
        
    }

    getProduct = (req: Request, res: Response) => {
        const { id } = req.params;
        if ( !Validators.isMongoID(id) ) return res.status(400).json({ error: 'Invalid id' });

        this.productService.getProduct(id)
        .then(product => res.json(product))
        .catch(error => this.handleError(res, error));
    }

    getProductsByCompany = (req: Request, res: Response) => {
        const { page=1, limit=10 } = req.query;
        const { companyId } = req.params;

        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        if ( !Validators.isMongoID(companyId) ) return res.status(400).json({ error: 'Invalid id' });

        this.productService.getProductsByCompany(companyId, paginationDto! )
        .then(products => res.json(products))
        .catch(error => this.handleError(res, error));
    }

    createProduct = (req: Request, res: Response) => {
        const { id, email } = req.body.user;

        const [error, createProductDto] = CreateProductDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.productService.createProduct(id, createProductDto!)
        .then(product => res.json(product))
        .catch(error => this.handleError(res, error));
    }

    updateProduct = (req: Request, res: Response) => {
        const { id: userId } = req.body.user;
        const { id } = req.params;
        if ( !Validators.isMongoID(id) ) return res.status(400).json({ error: 'Invalid id' });

        const [error, updateProductDto] = UpdateProductDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.productService.updateProduct(userId, id, updateProductDto!)
        .then(product => res.json(product))
        .catch(error => this.handleError(res, error));
    }
    
}