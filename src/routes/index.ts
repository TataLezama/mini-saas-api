import { Router } from 'express';
import { adminMiddleware } from '../middlewares';
import { AuthRoutes } from './auth.routes';
import { UserRoutes } from './user.routes';
import { CompanyRoutes } from './company.routes';
import { ProductRoutes } from './product.routes';
import { ScheduleRoutes } from './schedule.routes';
import { AppointmentRoutes } from './appointment.routes';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/auth', AuthRoutes.routes);
    router.use('/users', [ adminMiddleware ], UserRoutes.routes);
    router.use('/companies', CompanyRoutes.routes);
    router.use('/products', ProductRoutes.routes);
    router.use('/schedules', ScheduleRoutes.routes);
    router.use('/appointments', AppointmentRoutes.routes);


    return router;
  }


}