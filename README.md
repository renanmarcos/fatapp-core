# fatapp-core
Core integration services between fatapp-admins and fatapp-users

Install docker, docker-compose, npm and run inside the repository folder:

For Linux:
```
npm ci
docker-compose up
cp .env.example .env
```

For Windows:
```
npm ci
docker-compose up
copy .env.example .env
```

To enter in application container:

`docker-compose exec node bash`

To enter in database container:

`docker-compose exec mysql bash`

The application will be available at `localhost:3000` (or the port specified in `CORE_PORT` at `.env` file)