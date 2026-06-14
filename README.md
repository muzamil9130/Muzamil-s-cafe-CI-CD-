<div align="center">

# ☕ Muzamil's Cafe

**A full-stack restaurant web application with online ordering, table reservations, and AI-powered assistance — containerised with Docker and deployed to AWS via a complete CI/CD pipeline.**

[![CI – Build, Lint & Push to ECR](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml)
[![CD – Deploy to AWS ECS](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/cd.yml)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerised-2496ED?logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-ECS%20Fargate-FF9900?logo=amazonaws&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)

---

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Docker](#-docker) · [CI/CD Pipeline](#-cicd-pipeline) · [API Reference](#-api-reference) · [Project Structure](#-project-structure) · [Deployment](#-aws-deployment)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🍽️ **Interactive Menu** | Browse Starters, Mains, Desserts & Drinks with dietary filters |
| 🛒 **Online Ordering** | Add items to cart, review totals with tax & gratuity, place orders |
| 📅 **Table Reservations** | Book seats in Main Hall, Patio, Window Seat or Bar with a confirmation code |
| 🤖 **AI Assistant** | Gemini-powered chat assistant for recommendations and FAQs |
| 📋 **Order History** | Persistent order records saved to MongoDB |
| 📱 **Fully Responsive** | Optimised for mobile, tablet, and desktop |
| 🔄 **CI/CD Automated** | Every push to `main` is automatically built, tested, and deployed to AWS |

---

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 6** — lightning-fast builds and HMR
- **Tailwind CSS 4** — utility-first styling
- **Framer Motion / Motion** — smooth animations
- **Lenis** — smooth scroll experience
- **Lucide React** — icon library

### Backend
- **Node.js 20** + **Express 4** — REST API server
- **MongoDB 7** + **Mongoose 9** — data persistence
- **Google Gemini AI** (`@google/genai`) — AI assistant
- **dotenv** — environment configuration

### DevOps
- **Docker** — multi-stage production image (Alpine-based, non-root)
- **Docker Compose** — local full-stack development environment
- **GitHub Actions** — CI/CD pipelines
- **Amazon ECR** — container image registry
- **Amazon ECS Fargate** — serverless container hosting
- **AWS Secrets Manager** — secure secrets at runtime
- **AWS IAM OIDC** — keyless authentication from GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or a MongoDB Atlas URI
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### Local Setup (without Docker)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and fill in your values

# 4. Start the development server (frontend)
npm run dev

# 5. In a second terminal, start the backend server
npx tsx server.ts
```

The frontend will be available at **http://localhost:3000** and the API at **http://localhost:5000**.

---

## 🐳 Docker

The easiest way to run the full stack locally is with Docker Compose.

```bash
# Copy and fill in environment variables
cp .env.example .env

# Build and start all services (app + MongoDB)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (wipes MongoDB data)
docker-compose down -v
```

| Service | URL |
|---|---|
| Web Application | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |
| MongoDB | mongodb://localhost:27017 |

### Build the Docker image manually

```bash
docker build -t cafe-muzamil:latest .
docker run -p 5000:5000 --env-file .env cafe-muzamil:latest
```

---

## 🔄 CI/CD Pipeline

Every push to `main` or `master` triggers a fully automated pipeline:

```
git push main
     │
     ▼
┌─────────────────────────┐
│    CI Workflow           │
│  1. TypeScript typecheck │
│  2. Vite production build│
│  3. Docker multi-stage   │
│     build                │
│  4. Push image to ECR    │
│     (SHA tag + latest)   │
└───────────┬─────────────┘
            │ on success
            ▼
┌─────────────────────────┐
│    CD Workflow           │
│  1. Download ECS task    │
│     definition           │
│  2. Inject new image SHA │
│  3. Register new task    │
│     definition           │
│  4. ECS rolling update   │
│  5. Wait for stability   │
└─────────────────────────┘
```

- **Pull Requests** → Quality gates only (typecheck + build). No deploy.
- **Push to main** → Full pipeline: quality gates + Docker push + AWS deploy.
- **Authentication** → Uses AWS OIDC (no long-lived AWS keys stored in GitHub).

### GitHub Secrets & Variables Required

Navigate to **Settings → Secrets and variables → Actions** in your repo.

**Secrets** (encrypted):

| Name | Description |
|---|---|
| `AWS_ROLE_ARN` | ARN of the IAM role GitHub Actions assumes via OIDC |

**Variables** (plain text):

| Name | Example |
|---|---|
| `AWS_REGION` | `us-east-1` |
| `ECR_REPOSITORY` | `cafe-muzamil` |
| `ECS_CLUSTER` | `cafe-muzamil-cluster` |
| `ECS_SERVICE` | `cafe-muzamil-service` |
| `CONTAINER_NAME` | `cafe-app` |
| `TASK_DEFINITION` | `cafe-muzamil-task` |
| `APP_URL` | `https://your-domain.com` |

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns app and database status |

```json
{ "status": "ok", "db": 1, "uptime": 123.45 }
```

### Reservations

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reservations` | List all reservations (newest first) |
| `POST` | `/api/reservations` | Create a new reservation |
| `DELETE` | `/api/reservations/:id` | Cancel a reservation by ID |

**POST `/api/reservations` — Request Body:**
```json
{
  "name": "Muzamil",
  "email": "muzamil@example.com",
  "phone": "+92 300 0000000",
  "guests": 4,
  "area": "patio",
  "date": "2026-07-01",
  "time": "19:00",
  "specialRequests": "Window view preferred",
  "reservationCode": "RES-ABC123"
}
```

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | List all orders (newest first) |
| `POST` | `/api/orders` | Place a new order |

**POST `/api/orders` — Request Body:**
```json
{
  "ticketNumber": "TKT-001",
  "items": [
    { "name": "Cappuccino", "quantity": 2, "price": 4.50 }
  ],
  "subtotal": 9.00,
  "tax": 0.81,
  "gratuity": 1.35,
  "total": 11.16
}
```

---

## 📁 Project Structure

```
Muzamil's Cafe/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI: typecheck → build → ECR push
│   │   └── cd.yml              # CD: ECS Fargate rolling deploy
│   └── aws/
│       ├── iam-github-actions-policy.json  # Least-privilege IAM policy
│       └── ecs-task-definition.json        # ECS Fargate task definition
│
├── src/
│   ├── components/
│   │   ├── Hero.tsx            # Landing hero section
│   │   ├── Menu.tsx            # Interactive menu with cart
│   │   ├── OrderCart.tsx       # Cart, checkout & order placement
│   │   ├── ReservationForm.tsx # Table booking form
│   │   └── FooterAndAbout.tsx  # About section & footer
│   ├── data/                   # Static menu and reviews data
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── App.tsx                 # Root component & routing
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
│
├── server.ts                   # Express API server (TypeScript)
├── Dockerfile                  # Multi-stage production build
├── docker-compose.yml          # Local dev stack (app + MongoDB)
├── .dockerignore               # Docker build exclusions
├── .env.example                # Environment variable template
├── vite.config.ts              # Vite + React + Tailwind config
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## ☁️ AWS Deployment

For a detailed step-by-step AWS infrastructure setup guide (ECR, ECS, OIDC, Secrets Manager), see the [DevOps Walkthrough](./walkthrough.md) or follow these high-level steps:

1. **Create ECR repository** — `aws ecr create-repository --repository-name cafe-muzamil`
2. **Create ECS cluster** — `aws ecs create-cluster --cluster-name cafe-muzamil-cluster`
3. **Store secrets** — Add `MONGODB_URI`, `GEMINI_API_KEY`, `APP_URL` to AWS Secrets Manager
4. **Set up OIDC** — Connect GitHub Actions to AWS without long-lived keys
5. **Register task definition** — Use `.github/aws/ecs-task-definition.json` as template
6. **Create ECS service** — Fargate launch type, attach to your VPC/subnets
7. **Add GitHub secrets/variables** — See table above
8. **Push to `main`** — The pipeline does the rest 🚀

---

## 🧾 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `APP_URL` | ✅ | Public URL of the deployed app |
| `PORT` | ❌ | Server port (default: `5000`) |
| `NODE_ENV` | ❌ | `development` or `production` |
| `MONGO_ROOT_USER` | ❌ | Docker Compose MongoDB user (default: `admin`) |
| `MONGO_ROOT_PASS` | ❌ | Docker Compose MongoDB password (default: `secret`) |

---

## 📜 Available Scripts

```bash
npm run dev       # Start Vite dev server (frontend, port 3000)
npm run build     # Build production frontend bundle → dist/
npm run preview   # Preview the production build locally
npm run lint      # Run TypeScript type-check (tsc --noEmit)
npm run clean     # Remove dist/ and server.js build artefacts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request → CI runs automatically on the PR

---

## 📄 License

This project is private. All rights reserved © Muzamil's Cafe.

---

<div align="center">

Built with ❤️ by **Muzamil** · Powered by React, Node.js, MongoDB & AWS

</div>
