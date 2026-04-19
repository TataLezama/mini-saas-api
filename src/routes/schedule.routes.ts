import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../middlewares";
import { ScheduleService } from "../services";
import { ScheduleController } from "../controllers";


export class ScheduleRoutes {
    static get routes(): Router {
        const router = Router();

        const scheduleService = new ScheduleService();
        const controller = new ScheduleController(scheduleService);
        
        
        // Definir las rutas
        router.get('/', [adminMiddleware], controller.getShedules );

        router.get('/:id', controller.getShcedule );
        router.get('/company/:companyId', controller.getShedulesByCompany );
        // router.get('/product/:productId', controller.getShedulesByProduct );

        router.post('/', [authMiddleware], controller.createSchedule );
        router.put('/:id', [authMiddleware], controller.updateSchedule );

        return router;
    }
}