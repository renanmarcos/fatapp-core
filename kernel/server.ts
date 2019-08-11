import { App } from './app';
import { createConnection, getConnectionOptions } from 'typeorm';
import 'reflect-metadata';

async function main() {
    let app = new App();
    await createConnection().then(async () => {
        console.log('Database connection is working!');
        await app.listen();
    });
}

main();