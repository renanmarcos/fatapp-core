import express, { Application } from 'express';
import cors from 'cors';
import UserRoutes from '../app/routes/UserRoutes';
import StudentRoutes from '../app/routes/StudentRoutes';
import LectureRoutes from '../app/routes/LectureRoutes';
import Resource from '../app/routes/ResourceRoutes';
import Room from '../app/routes/RoomRoutes';
import Event from '../app/routes/EventRoutes';
import RoomResource from '../app/routes/RoomResourceRoutes';

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
        this.app.use(cors());
    }

    private middlewares() {
        this.app.use(express.json());
    }

    private routes() {
        this.app.use('/users', UserRoutes);
        this.app.use('/lectures', LectureRoutes);
        this.app.use('/students', StudentRoutes);
        this.app.use('/resources', Resource);
        this.app.use('/rooms', Room);
        this.app.use('/events', Event);
        this.app.use('/rooms_resources', RoomResource);
    }

    async listen(): Promise<void> {
        this.app.set('env', process.env.CORE_ENV);
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}