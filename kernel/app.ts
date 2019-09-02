import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import UserRoutes from '../app/routes/UserRoutes';
import StudentRoutes from '../app/routes/StudentRoutes';
import Resource from '../app/routes/ResourceRoutes';
import Room from '../app/routes/RoomRoutes';
import Event from '../app/routes/EventRoutes';
// import RoomResource from '../app/routes/RoomResourceRoutes';
import AuthRoutes from '../app/routes/AuthRoutes';
import { requiresAuth } from '../app/middlewares/CheckJwt';

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
                { url: '/users', methods: ['POST'] }
            ]
        }));
    }

    private routes() {
        this.app.use('/auth', AuthRoutes);
        this.app.use('/users', UserRoutes);
        this.app.use('/students', StudentRoutes);
        this.app.use('/resources', Resource);
        this.app.use('/rooms', Room);
        this.app.use('/events', Event);
        // this.app.use('/rooms_resources', RoomResource);
    }

    async listen(): Promise<void> {
        this.app.set('env', process.env.CORE_ENV);
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}