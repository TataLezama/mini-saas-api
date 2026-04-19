import { Router } from "express";
import { AuthService, EmailService } from "../services";
import { envs } from "../configs";
import { AuthController } from "../controllers";


export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const authServices = new AuthService();
        const controller = new AuthController(authServices);
        
        // Definir las rutas
        router.post('/register', controller.registerUser );
        router.post('/login', controller.loginUser );

        router.get('/validate-email/:token', controller.validateEmail );
        router.post('/recover-password', controller.recoverPassword );
        router.post('/change-password/:token', controller.changePassword );

        return router;
    }
}