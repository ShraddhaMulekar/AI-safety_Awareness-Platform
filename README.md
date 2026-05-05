# AI Safety Awareness Platform

A web application that helps users identify scam messages and understand utility bills using AI.

## Features

- **Scam Analyzer** — Paste any message and get a risk rating (High / Medium / Low) with scam indicators
- **Bill Analyzer** — Upload electricity or water bills (PDF or image) and get parsed data: amount, units,  due date, and a plain-English summary
- **Bill History** — Save analyzed bills and view them anytime (requires login)
- **Authentication** — Register and login with JWT-based auth

## Tech Stack

**Frontend:** React, Chakra UI, React Router  
**Backend:** Node.js, Express  
**Database:** MongoDB + Mongoose  
**Storage:** Cloudinary (bill files)  
**OCR:** pdfjs-dist (PDFs), Tesseract.js + Sharp (images)  
**AI:** HuggingFace Inference API, LLM, Prompt Engineering

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Cloudinary account
- HuggingFace API key
- LLM
- Prompt Engineering

### Installation

```bash
# Clone the repo
git clone (https://github.com/ShraddhaMulekar/AI-safety_Awareness-Platform)

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file in `/backend`

### Run

```bash
# Backend
cd backend && npm run start

# Frontend
cd frontend && npm run dev
```

## Project Structure

├── backend/
│   ├── controllers/       # Route handlers
│   ├── services/          # OCR, bill analysis, AI
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   └── config/            # Cloudinary, DB config
├── frontend/
│   ├── pages/             # Home, Scam, Bill, History, Login
│   ├── components/        # Reusable UI components
│   ├── services/          # API call functions
│   └── hooks/             # useFetch, useAuth

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| POST | /scam/analyze | Analyze message for scam risk |
| POST | /bill/upload | Upload and analyze bill |
| POST | /saved-bills/save | Save bill to history |
| GET  | /saved-bills | Get user's saved bills |
