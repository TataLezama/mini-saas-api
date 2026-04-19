import { Router } from "express";
import { envs } from "../configs";
import { UserService, EmailService } from "../services";
import { UserController } from "../controllers";



export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
        );
        const userService = new UserService();
        const controller = new UserController(userService);
        
        
        // Definir las rutas
        router.get('/', controller.getUsers );
        router.get('/:id', controller.getUser );
        router.put('/:id', controller.updateUser );

        return router;
    }
}