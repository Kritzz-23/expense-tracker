# 💳 AI-Driven Expense Tracker

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-10B981?style=for-the-badge&logo=github)](https://kritzz-23.github.io/expense-tracker/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)](https://react.dev)

> 🚀 **Interactive Live Application:** [https://kritzz-23.github.io/expense-tracker/](https://kritzz-23.github.io/expense-tracker/)

An intelligent, full-stack expense tracking application designed to help users manage their finances smoothly with the help of artificial intelligence.

This application is split into two parts: a React-based frontend and a Python FastAPI backend. The AI features are powered by Groq, and user data is securely managed and stored.

## Features

- **Dashboard:** Visualize your expenses with beautiful charts (Recharts).
- **AI Tracking:** Use natural language processing via Groq to categorize and log expenses quickly!
- **Authentication:** Secure user authentication using JWT and bcrypt.
- **Reporting:** Automatic generation of expense reports based on logged data.

## Technology Stack

### Frontend
- **Framework & Build Tool:** React 18, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI
- **Database ORM:** SQLModel, SQLAlchemy
- **Data Processing:** Pandas
- **AI Integration:** Groq API
- **Security:** bcrypt, PyJWT

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 or higher)
- `.env` configuration file to setup Groq API key and database connections.

### 1. Starting the Backend

Navigate to the `backend` directory, install requirements, and run the FastAPI server:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or `.\.venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend server should start on `http://localhost:8000`.

### 2. Starting the Frontend

Open a new terminal, navigate to the `frontend` directory, install Node dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```
The frontend should start on `http://localhost:5173`.

## Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in the following:

- `GROQ_API_KEY`: Your Groq API key (from https://console.groq.com). Optional locally — without it, AI features fall back to keyword-based categorization and template summaries.
- `SECRET_KEY`: Secret for signing JWT tokens. Must be set to a long random value in production.
- `DATABASE_URL`: Database connection string. Omit to use local SQLite (`backend/finance.db`). On Render this is injected automatically as Postgres.
- `CORS_ORIGINS`: Optional comma-separated list of allowed CORS origins. Defaults to `*` (all origins).

## Contribution
1. Fork the framework.
2. Create your feature branch (`git checkout -b feature/AddAwesomeFeature`).
3. Commit your changes (`git commit -m 'Add some AwesomeFeature'`).
4. Push to the branch (`git push origin feature/AddAwesomeFeature`).
5. Open a Pull Request.

## License
Distributed under the MIT License.
