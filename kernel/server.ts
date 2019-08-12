import { App } from './app';
import { createConnection, getConnectionOptions, getConnection } from 'typeorm';
import 'reflect-metadata';

createConnection().then(async (connection) => {
    console.log('Database connection is working!');
    const app = new App();
    await app.listen();
}).catch(error => console.log(error));