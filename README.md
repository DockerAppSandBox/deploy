# Deploy Project

This project provides an easy way to deploy all services (frontend, backend, Python server, and database) using Docker Compose with publicly hosted images on GitHub.

## Prerequisites

- Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your system.

## Setup

1. **Environment Variables:**

   - Copy the provided `.env.example` file and rename it to `.env`.
   - It is recommended to keep the same environment variable values provided in the example file to ensure a smooth deployment process.

   ```sh
   cp .env.example .env
   ```

2. **Create Network:**

   Before running the services, you need to create a custom Docker network:

   ```sh
   docker network create --subnet=172.28.0.0/16 mynetwork
   ```

3. **Starting Services:**

   - To start all services, simply run the following command:

   ```sh
   docker compose up -d
   ```

   The `-d` flag runs the containers in detached mode, allowing them to run in the background.

## Services Overview

The deployment includes the following services:

- **Frontend:** A web-based user interface.
- **Backend:** The core application logic.
- **Python Server:** Handles specific operations and processing.
- **Database:** Stores and manages application data.

## Project Structure

The following image provides an overview of the project structure:



## Docker Compose Explanation

Below is an overview of the key elements in the `docker-compose.yml` configuration:

### Networks

```yaml
networks:
  mynetwork:
    driver: bridge
```

- A custom bridge network `mynetwork` is created to allow communication between the backend and the database securely.

### Volumes

```yaml
volumes:
  postgres_data:
    driver: local
```

- A named volume `postgres_data` is created to ensure data persistence for the PostgreSQL database.
- This allows data to be retained even if the database container is restarted or removed.

### Services

#### Database Service

```yaml
  mydb:
    image: postgres
    container_name: bdd
    ports:
      - "${BDD_PORT}:${BDD_PORT}"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mynetwork
```

- The PostgreSQL database service uses a persistent volume to store its data.
- It is connected to the `mynetwork` network to allow backend services to access it securely.

#### Python Server Service

```yaml
  python-server:
    image: ghcr.io/dockerappsandbox/pythonserver:pre-prod
    ports:
      - "${SERVER_PORT}:${SERVER_PORT}"
    depends_on:
      - mydb
```

- The Python server service depends on the database (`mydb`) to ensure it starts only after the database is ready.

#### Frontend Service

```yaml
  front:
    image: ghcr.io/dockerappsandbox/front:pre-prod
    ports:
    - "${FRONT_PORT}:${FRONT_PORT}"
    depends_on:
      - mydb
      - python-server
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_SERVER_PYTHON_URL: ${NEXT_PUBLIC_SERVER_PYTHON_URL}
```

- The frontend service depends on the database and the Python server to ensure they are running before the frontend starts.
- Environment variables are used to configure the API and Python server URLs.

#### Backend Service

```yaml
  back:
    image: ghcr.io/dockerappsandbox/back:pre-prod
    ports: 
      - "${BACK_PORT}:${BACK_PORT}"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      BACK_PORT: ${BACK_PORT}
    depends_on:
      - mydb
      - python-server
      - front
    restart: unless-stopped
    networks:
      - mynetwork
```

- The backend service is dependent on all other services to ensure proper initialization.
- It is set to restart unless manually stopped to ensure continuous availability.
- The backend is connected to the same `mynetwork` network to communicate with the database securely.

## Stopping Services

To stop and remove the running containers, use the following command:

```sh
docker compose down
```

## Additional Commands

- Check running containers:
  ```sh
  docker ps
  ```
- View service logs:
  ```sh
  docker compose logs -f
  ```

## Troubleshooting

If you encounter any issues, consider the following:

- Verify that your `.env` file is correctly configured.
- Ensure Docker and Docker Compose are correctly installed and running.
- Check logs using `docker compose logs` for any potential errors.

---

Feel free to contribute or raise issues to improve the deployment process!

