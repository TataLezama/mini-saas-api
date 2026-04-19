import { Router } from "express";
import { ProductService } from "../services";
import { ProductController } from "../controllers";
import { adminMiddleware, authMiddleware } from "../middlewares";


export class ProductRoutes {
    static get routes(): Router {
        const router = Router();

        const productService = new ProductService();
        const controller = new ProductController(productService);
        
        
        // Definir las rutas
        router.get('/', [adminMiddleware], controller.getProducts );

        router.get('/:id', controller.getProduct );
        router.get('/company/:companyId', controller.getProductsByCompany );

        router.post('/', [authMiddleware], controller.createProduct );
        router.put('/:id', [authMiddleware], controller.updateProduct );

        return router;
    }
}