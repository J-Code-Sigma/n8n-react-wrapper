
# N8N React Wrapper

The requirements are:
- **Node.js & npm** - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Docker & Docker Compose** - [install Docker](https://docs.docker.com/get-docker/) and [install Docker Compose](https://docs.docker.com/compose/install/)


### Architecture

The n8n setup includes:
- **n8n container**: The main automation platform
- **nginx container**: Reverse proxy that handles routing and WebSocket connections
- **Persistent storage**: Your workflows and data are stored in `./n8n_data/`

The nginx proxy is configured to handle iframe embedding and WebSocket connections properly, making it suitable for integration with web applications.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Docker & Docker Compose (for n8n)
- nginx (for n8n proxy)


Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Running n8n with Docker

This project includes a pre-configured n8n automation platform that runs via Docker. n8n is a workflow automation tool that helps you connect different services and automate tasks.

### Prerequisites

- **Docker** and **Docker Compose** installed on your system
- Git (to clone this repository)

### Getting Started with n8n

1. **Navigate to the n8n directory:**
```bash
cd n8n/
```

2. **Fix permissions for the data directory:**
```bash
# Create the data directory if it doesn't exist
mkdir -p ./n8n_data

# Set proper permissions (n8n runs as user ID 1000 in the container)
sudo chown -R 1000:1000 ./n8n_data/
sudo chmod -R 755 ./n8n_data/
```

3. **Start n8n services:**
```bash
sudo docker compose up -d
```

4. **Access n8n:**
Open your browser and go to `http://localhost:8081`

**Default credentials:**
- Username: `admin`
- Password: `password`

### Docker Commands

**Start services:**
```bash
sudo docker compose up -d
```

**Stop services:**
```bash
sudo docker compose down
```

**Restart services:**
```bash
sudo docker compose restart
```

**View logs:**
```bash
# View all logs
sudo docker compose logs

# Follow n8n logs in real-time
sudo docker compose logs -f n8n

# Follow nginx logs
sudo docker compose logs -f nginx
```

**Check running containers:**
```bash
sudo docker compose ps
```

### Troubleshooting

If you encounter permission issues:

1. **Stop the containers:**
```bash
sudo docker compose down
```

2. **Remove the data directory and recreate it:**
```bash
sudo rm -rf ./n8n_data/
mkdir -p ./n8n_data/
sudo chown -R 1000:1000 ./n8n_data/
sudo chmod -R 755 ./n8n_data/
```

3. **Start the containers again:**
```bash
sudo docker compose up -d
```
