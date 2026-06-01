# Services Used in AI Interview Agent

## External Services & APIs

### 1. Firebase (Google)
**Purpose:** User authentication via Google Sign-In  
**Details:** OAuth 2.0 Google popup login, session/identity management  
**Config:** `client/src/utils/firebase.js`, `client/.env`  
**Package:** `firebase ^12.9.0`

---

### 2. OpenRouter
**Purpose:** AI-powered interview question generation and answer evaluation  
**Details:** Wraps `openai/gpt-4o-mini` to generate contextual questions from resume/role, parse resume text, and score candidate answers with feedback. Each question generation costs 50 credits.  
**Config:** `server/services/openRouter.service.js`, `server/.env`  
**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`  
**Used in:** `server/controllers/interview.controller.js` — `analyzeResume()`, `generateQuestion()`, `submitAnswer()`

---

### 3. MongoDB Atlas
**Purpose:** Primary database — stores all application data  
**Details:** Stores user profiles (name, email, credits), interview records, question/answer results, and payment transaction history  
**Config:** `server/config/connectDb.js`, `server/.env`  
**Cluster:** `cluster0.pjvi9dz.mongodb.net`  
**Package:** `mongoose ^9.2.1`  
**Collections:** `User`, `Payment`, `Interview`

---

### 4. Razorpay
**Purpose:** Payment processing and credit pack purchases  
**Details:** Creates payment orders, verifies signatures, manages credit-based plans (Free: 100 credits, Starter: ₹100/150 credits, Pro: ₹500/650 credits)  
**Config:** `server/services/razorpay.service.js`, `server/.env`, `client/.env`  
**Package:** `razorpay ^2.9.6`  
**CDN:** `https://checkout.razorpay.com/v1/checkout.js` (loaded in `client/index.html`)  
**Used in:** `server/controllers/payment.controller.js`, `client/src/pages/Pricing.jsx`

---

### 5. Web Speech API (Browser Native)
**Purpose:** Voice interaction during interviews  
**Details:** Text-to-speech reads questions aloud (`window.speechSynthesis`), speech recognition captures spoken answers (`window.webkitSpeechRecognition`). Supports male/female voice selection with natural pauses at punctuation.  
**Used in:** `client/src/components/Step2Interview.jsx`

---

## Backend Libraries & Middleware

### 6. Express.js
**Purpose:** Node.js REST API framework  
**Details:** Routes for `/api/auth`, `/api/user`, `/api/interview`, `/api/payment`; handles CORS, cookie parsing  
**Package:** `express ^5.2.1`  
**Entry:** `server/index.js`

---

### 7. JSON Web Token (JWT)
**Purpose:** Session management and route protection  
**Details:** Issues tokens on login, stored as HTTP-only cookies with 7-day expiry; validated in auth middleware for protected routes  
**Config:** `server/config/token.js`, `server/.env`  
**Package:** `jsonwebtoken ^9.0.3`

---

### 8. Multer
**Purpose:** Resume PDF file upload handling  
**Details:** Temporarily stores uploaded resume files on the server before PDF.js processes them  
**Config:** `server/middlewares/multer.js`  
**Package:** `multer ^2.0.2`

---

### 9. pdf-parse
**Purpose:** Resume text extraction  
**Details:** Node.js-native PDF text extractor. Parses uploaded PDF resumes and extracts raw text, which is then sent to OpenRouter for analysis. Replaced `pdfjs-dist` which is browser-only and crashed in Node.js due to missing DOM APIs (`DOMMatrix`, `ImageData`, `Path2D`).  
**Used in:** `server/controllers/interview.controller.js` — `analyzeResume()`  
**Package:** `pdf-parse ^1.1.1`

---

### 10. Axios
**Purpose:** HTTP client for both client and server  
**Details:** Client uses it to call the Express backend; server uses it to call the OpenRouter API  
**Package:** `axios ^1.13.5`

---

## Frontend Libraries

### 11. Redux Toolkit
**Purpose:** Global client-side state management  
**Details:** Manages authenticated user data and credit balance across components  
**Config:** `client/src/redux/store.js`, `client/src/redux/userSlice.js`  
**Packages:** `@reduxjs/toolkit ^2.11.2`, `react-redux ^9.2.0`

---

### 12. React Router DOM
**Purpose:** Client-side page routing and navigation  
**Package:** `react-router-dom ^7.13.0`

---

### 13. Recharts
**Purpose:** Data visualization in interview reports  
**Details:** Renders score charts and performance breakdowns after interview completion  
**Package:** `recharts ^3.7.0`

---

### 14. jsPDF + jspdf-autotable
**Purpose:** PDF report generation  
**Details:** Exports interview results and scores as downloadable PDF documents  
**Packages:** `jspdf ^4.2.0`, `jspdf-autotable ^5.0.7`

---

### 15. Motion (Framer Motion)
**Purpose:** UI animations and transitions  
**Package:** `motion ^12.34.1`

---

### 16. Tailwind CSS
**Purpose:** Utility-first CSS framework for all UI styling  
**Packages:** `tailwindcss ^4.1.18`, `@tailwindcss/vite ^4.1.18`

---

## Dev / Build Tools

| Tool | Purpose | Package |
|------|---------|---------|
| **Vite** | Frontend build tool and dev server | `vite ^7.3.1` |
| **Nodemon** | Auto-restart server on file changes | `nodemon ^3.1.11` |
| **dotenv** | Load environment variables from `.env` files | `dotenv ^17.3.1` |

---

## Service Flow Overview

```
Authentication:
  Google Sign-In (Firebase) → Express API → MongoDB (user stored) → JWT cookie issued

Interview Setup:
  Resume PDF (Multer upload) → PDF.js (text extract) → OpenRouter AI (analyze) → MongoDB

Interview Session:
  OpenRouter AI (generate question) → Web Speech API (read aloud) → Speech Recognition (capture answer)
  → OpenRouter AI (evaluate answer) → MongoDB (save result)

Payments:
  Razorpay Checkout (client) → Razorpay API (verify) → MongoDB (record) → User credits updated

Reports:
  MongoDB (fetch results) → Recharts (visualize) → jsPDF (export)
```
