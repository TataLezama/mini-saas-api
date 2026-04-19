import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middlewares";
import { AppointmentService, EmailService } from "../services";
import { AppointmentController } from "../controllers";
import { envs } from "../configs";


export class AppointmentRoutes {
    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
        );
        const appointmentService = new AppointmentService(emailService);
        const controller = new AppointmentController(appointmentService);
        
        
        // Definir las rutas
        router.get('/', [adminMiddleware], controller.getAppoiments );

        router.get('/:id', [authMiddleware], controller.getAppoiment );
        router.get('/company/:companyId', [authMiddleware], controller.getAppoimentsByCompany );
        router.get('/product/:productId', [authMiddleware], controller.getAppointmentsByProduct );
        router.get('/schedule/:scheduleId', [authMiddleware], controller.getAppointmentsBySchedule );
        router.get('/user/:userId', [authMiddleware], controller.getAppointmentsByUser );

        router.post('/', [authMiddleware], controller.createAppoiment );
        router.put('/:id', [authMiddleware], controller.updateAppoiment );

        return router;
    }
}