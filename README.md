# fatapp-core
Core integration services between fatapp-admins and fatapp-users

Install docker, docker-compose, npm and run inside the repository folder:

For Linux:
```
npm ci
cp .env.example .env
docker-compose up
```

For Windows:
```
npm ci
copy .env.example .env
docker-compose up
```

To enter in application container:

`docker-compose exec node bash`

To enter in database container:

`docker-compose exec mysql bash`

The application will be available at `localhost:3000` (or the port specified in `CORE_PORT` at `.env` file)

## Tips:
- Always use node docker container to create migrations, models or other things via `typeorm` cli. (See above to enter in application container)
- Manipulate `typeorm` cli via our script in `package.json`. So if you want to create a new model for example, use inside container:
> `npm run typeorm entity:create -- -n entityName` (See https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md to more details for using TypeORM cli with TypeScript)
