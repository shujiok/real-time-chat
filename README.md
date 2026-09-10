# real-time-chat monorepo

Monorepo scaffold for a real-time chat app.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Java 17 + Spring Boot + WebSocket (STOMP over SockJS)

## Repository layout

- `/frontend` — Next.js client on port `3000`
- `/backend` — Spring Boot WebSocket server on port `8000`
- `/docker-compose.yml` — local multi-container setup

## Local setup

### Prerequisites

- Node.js 22+
- npm 10+
- Java 17
- Maven 3.9+
- Docker + Docker Compose (optional)

### Frontend

```bash
cd /home/runner/work/real-time-chat/real-time-chat/frontend
npm install
npm run dev
```

### Backend

```bash
cd /home/runner/work/real-time-chat/real-time-chat/backend
mvn spring-boot:run
```

## Linting / formatting

### Frontend

```bash
cd /home/runner/work/real-time-chat/real-time-chat/frontend
npm run lint
npm run format:check
```

### Backend

```bash
cd /home/runner/work/real-time-chat/real-time-chat/backend
mvn checkstyle:check
mvn spotless:check
```

## Run with Docker Compose

```bash
cd /home/runner/work/real-time-chat/real-time-chat
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health
- WebSocket endpoint: `ws://localhost:8000/ws-chat`

## ECS deployment outline

1. Build and push container images to Amazon ECR:
   - `frontend` image from `/frontend/Dockerfile`
   - `backend` image from `/backend/Dockerfile`
2. Create an ECS cluster (Fargate or EC2 launch type).
3. Create task definitions:
   - Backend container exposing `8000`
   - Frontend container exposing `3000` and `NEXT_PUBLIC_WS_URL` set to backend service URL
4. Create ECS services for each task definition behind an Application Load Balancer.
5. Configure target groups/listeners:
   - Route frontend traffic to port `3000`
   - Route backend API/WebSocket traffic to port `8000`
6. Ensure security groups allow ALB-to-service traffic for required ports.
7. Enable CloudWatch logs for both services.

## Quick verification

- Open frontend and submit a message.
- Verify the message appears in the list and backend logs show STOMP traffic.
