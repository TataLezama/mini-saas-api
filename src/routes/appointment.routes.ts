import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middlewares";
import { AppointmentService } from "../services";
import { AppointmentController } from "../controllers";


export class AppointmentRoutes {
    static get routes(): Router {
        const router = Router();

        const appointmentService = new AppointmentService();
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