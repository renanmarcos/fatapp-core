import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from '../app/routes/UserRoutes';

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
        this.app.use('/users', userRoutes);
    }

    async listen(): Promise<void> {
        this.app.set('env', process.env.CORE_ENV);
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}