import express, { Application } from 'express';
import cors from 'cors';
import UserRoutes from '../app/routes/UserRoutes';
import StudentRoutes from '../app/routes/StudentRoutes';
import LectureRoutes from '../app/routes/LectureRoutes';
import jwt from 'express-jwt';

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
        this.app.use(jwt({secret: 'hello'}).unless({
            path: [
                '/token'
            ]
        }));
    }

    private routes() {
        this.app.use('/users', UserRoutes);
        this.app.use('/lectures', LectureRoutes);
        this.app.use('/students', StudentRoutes);
    }

    async listen(): Promise<void> {
        this.app.set('env', process.env.CORE_ENV);
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}