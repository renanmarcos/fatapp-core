import express, { Application } from 'express';
import cors from 'cors';
import routes from '../app/routes';

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
        this.app.use(routes);
    }

    async listen(): Promise<void> {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}