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
import FilesRoutes from '../app/routes/FilesRoutes';
import CertificatesRoutes from '../app/routes/CertificatesRoutes';

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
                { url: '/courses', methods: ['GET'] },
                { url: '/activities/validator', methods: ['GET'] },
                // TODO: Remove these routes below
                { url: '/activities/3/report?email=1', methods: ['GET']},
                { url: '/activities/3/report', methods: ['GET']},
                { url: '/events/2/report?email=1', methods: ['GET']},
                { url: '/events/2/report', methods: ['GET']}
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
        this.app.use('/files', FilesRoutes);
        this.app.use('/certificates', CertificatesRoutes);
    }

    async listen(): Promise<void> {
        this.app.set('env', process.env.CORE_ENV);
        this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}