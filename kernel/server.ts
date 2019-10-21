import { App } from './app';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

createConnection().then(async () => {
    console.log('Database connection is working!');
    const app = new App();
    await app.listen();
}).catch((error) => console.log(error));