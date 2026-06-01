# AI Interview Agent

An AI-powered mock interview platform that lets users practice real job interviews with voice interaction, AI-generated questions, answer evaluation, ATS resume scoring, and detailed performance reports.

---

## Features

- **Voice-based interviews** — AI reads questions aloud and listens to your spoken answers
- **Resume-based questions** — Upload your PDF resume and get questions tailored to your actual skills and projects
- **AI answer evaluation** — Every answer is scored on Confidence, Communication, and Correctness
- **ATS Score Checker** — Check how well your resume matches a job description (0–100 score)
- **Performance reports** — Downloadable PDF reports with score charts and per-question feedback
- **Credit system** — Free tier + paid packs via Razorpay
- **Interview history** — Track progress across all past sessions
- **Multiple interview modes** — Technical, HR, System Design

---

## Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React ^19.2.0 | UI framework |
| React Router DOM ^7.13.0 | Client-side routing |
| Redux Toolkit ^2.11.2 | Global state management |
| Axios ^1.13.5 | HTTP client |
| Motion ^12.34.1 | Animations |
| Tailwind CSS ^4.1.18 | Utility-first styling |
| Recharts ^3.7.0 | Score trend charts |
| jsPDF + jspdf-autotable | PDF report export |
| react-circular-progressbar | Circular score display |
| Firebase ^12.9.0 | Google OAuth authentication |
| Vite ^7.3.1 | Build tool & dev server |

### Backend
| Package | Purpose |
|---|---|
| Express ^5.2.1 | REST API framework |
| Mongoose ^9.2.1 | MongoDB ODM |
| jsonwebtoken ^9.0.3 | JWT session management |
| pdf-parse ^1.1.1 | Resume PDF text extraction |
| multer ^2.0.2 | File upload handling |
| Razorpay ^2.9.6 | Payment processing |
| dotenv ^17.3.1 | Environment variables |
| nodemon ^3.1.11 | Dev auto-reload |

---

## External Services

### 1. Firebase (Google)
**Purpose:** Google Sign-In authentication
**Config:** `client/src/utils/firebase.js`, `client/.env`

### 2. OpenRouter (GPT-4o-mini)
**Purpose:** AI question generation, answer evaluation, ATS resume analysis
**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
**Config:** `server/services/openRouter.service.js`, `server/.env`

### 3. MongoDB Atlas
**Purpose:** Stores users, interviews, payments
**Collections:** `User`, `Interview`, `Payment`
**Config:** `server/config/connectDb.js`, `server/.env`

### 4. Razorpay
**Purpose:** Credit pack payments (Free / Starter ₹100 / Pro ₹500)
**CDN:** `checkout.razorpay.com/v1/checkout.js` in `client/index.html`
**Config:** `server/services/razorpay.service.js`, `server/.env`, `client/.env`

### 5. Web Speech API (Browser Native)
**Purpose:** Text-to-speech for reading questions + speech recognition for capturing answers
**Used in:** `client/src/components/Step2Interview.jsx`

---

## API Routes

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/google` | Google Sign-In |
| GET | `/api/auth/logout` | Logout |

### User
| Method | Route | Description |
|---|---|---|
| GET | `/api/user/current-user` | Get logged-in user data |

### Interview
| Method | Route | Credits | Description |
|---|---|---|---|
| POST | `/api/interview/resume` | — | Parse uploaded resume PDF |
| POST | `/api/interview/generate-questions` | -50 | Generate 5 AI questions |
| POST | `/api/interview/submit-answer` | — | Evaluate a spoken answer |
| POST | `/api/interview/finish` | — | Finalize interview & compute scores |
| GET | `/api/interview/get-interview` | — | Fetch user's interview history |
| GET | `/api/interview/report/:id` | — | Get single interview report |

### ATS Checker
| Method | Route | Credits | Description |
|---|---|---|---|
| POST | `/api/ats/check` | -25 | ATS score check (resume + job description) |

### Payment
| Method | Route | Description |
|---|---|---|
| POST | `/api/payment/order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment & add credits |

---

## Credits System

| Action | Credits |
|---|---|
| Signup bonus | +100 free |
| Generate interview questions | -50 |
| ATS score check | -25 |
| Starter Pack (₹100) | +150 |
| Pro Pack (₹500) | +650 |

---

## Project Structure

```
AIInterviewAgent/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── assets/                 # Images & videos
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AuthModel.jsx
│   │   │   ├── Step1SetUp.jsx      # Interview setup form
│   │   │   ├── Step2Interview.jsx  # Active interview screen
│   │   │   ├── Step3Report.jsx     # Results dashboard
│   │   │   └── Timer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   ├── InterviewReport.jsx
│   │   │   ├── AtsChecker.jsx      # ATS score checker
│   │   │   └── Pricing.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── userSlice.js
│   │   └── utils/
│   │       └── firebase.js
│   └── .env
│
├── server/                         # Node.js + Express backend
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── interview.controller.js
│   │   ├── ats.controller.js       # ATS score checker
│   │   └── payment.controller.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── interview.route.js
│   │   ├── ats.route.js
│   │   └── payment.route.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── interview.model.js
│   │   └── payment.model.js
│   ├── services/
│   │   ├── openRouter.service.js
│   │   └── razorpay.service.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   ├── config/
│   │   ├── connectDb.js
│   │   └── token.js
│   ├── index.js
│   └── .env
│
└── README.md
```

---

## Environment Variables

### `server/.env`
```env
MONGO_URI=
JWT_SECRET=
OPENROUTER_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLIENT_URL=http://localhost:5173
PORT=6000
```

### `client/.env`
```env
VITE_BACKEND_URL=http://localhost:6000
VITE_FIREBASE_APIKEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=
```

---

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd AIInterviewAgent

# 2. Install server dependencies
cd server && npm install

# 3. Add server/.env (see above)

# 4. Install client dependencies
cd ../client && npm install

# 5. Add client/.env (see above)

# 6. Start the server  (from /server)
npm run dev

# 7. Start the client  (from /client)
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:6000`

---

## Flow Overview

```
Authentication:
  Google Sign-In (Firebase) → Express → MongoDB → JWT cookie

Interview:
  Resume PDF (Multer) → pdf-parse → OpenRouter AI (questions)
  → Web Speech API (read aloud) → Speech Recognition (capture)
  → OpenRouter AI (evaluate) → MongoDB (save)

ATS Check:
  Resume PDF → pdf-parse → OpenRouter AI (score vs JD) → Result UI

Payment:
  Razorpay Checkout → Verify signature → MongoDB → Credits updated

Reports:
  MongoDB → Recharts (visualize) → jsPDF (export)
```
