# fatapp-core
Core integration services between fatapp-admins and fatapp-users

Install docker + docker compose and run inside the repository folder:

`docker-compose up`

Copy the .env.example file to .env (alter settings if you want):

`cp .env.example .env` (Linux command)

To enter in application container:

`docker-compose exec node bash`

To enter in database container:

`docker-compose exec mariadb bash`

The application will be available at localhost:3000 (or the port specified in CORE_PORT at .env file)