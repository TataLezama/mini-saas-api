import { Router } from "express";
import { CompanyService } from "../services/company.service";
import { CompanyController } from "../controllers";
import { adminMiddleware, authMiddleware } from "../middlewares";


export class CompanyRoutes {
    static get routes(): Router {
        const router = Router();

        const companyService = new CompanyService();
        const controller = new CompanyController(companyService);
        
        // Definir las rutas
        router.get('/', controller.getCompanies );
        router.get('/:id', controller.getCompany );

        router.post('/', [authMiddleware], controller.createCompany );
        router.put('/:id', [authMiddleware], controller.updateCompany );

        router.post('/:id/activate', [adminMiddleware], controller.activateCompany );

        return router;
    }
}