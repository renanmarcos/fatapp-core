import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requiresAuth } from '../app/middlewares/CheckJwt';
import UsersRoutes from '../app/routes/UsersRoutes';
import StudentsRoutes from '../app/routes/StudentsRoutes';
import SpeakersRoutes from '../app/routes/SpeakersRoutes';
import ResourcesRoutes from '../app/routes/ResourcesRoutes';
import EventsRoutes from '../app/routes/EventsRoutes';
import RoomsRoutes from '../app/routes/RoomsRoutes';
import AuthRoutes from '../app/routes/AuthRoutes';
import ActivitiesRoutes from '../app/routes/ActivitiesRoutes';
import CoursesRoutes from '../app/routes/CoursesRoutes';
import ImagesRoutes from '../app/routes/ImagesRoutes';

export class App {
    app: Application;

    constructor(private port?: number | string) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private settings() {
        this.app.set('port', this.port || process.env.CORE_PORT || 3000);
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(requiresAuth().unless({
            path: [
                { url: '/auth/token', methods: ['POST'] },
                { url: '/users', methods: ['POST'] },
                { url: '/students', methods: ['POST'] },
                { url: '/courses', methods: ['GET'] }
            ]
        }));
    }

    private routes() {
        this.app.use('/auth', AuthRoutes);
        this.app.use('/users', UsersRoutes);
        this.app.use('/students', StudentsRoutes);
        this.app.use('/resources', ResourcesRoutes);
        this.app.use('/activities', ActivitiesRoutes);
        this.app.use('/rooms', RoomsRoutes);
        this.app.use('/events', EventsRoutes);
        this.app.use('/speakers', SpeakersRoutes);
        this.app.use('/courses', CoursesRoutes);
        this.app.use('/images', ImagesRoutes);
        // this.app.use('/certificates', CertificateRoutes);
    }

    async listen(): Promise<void> {
        this.app.set('env', process.env.CORE_ENV);
        this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}