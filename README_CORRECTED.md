# AI FAQ Assistant API - Corrected

## 1. Install

```powershell
npm install
```

## 2. Configure `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_faq_assistant
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

## 3. Start MongoDB

Make sure the local MongoDB service is running.

## 4. Start API

```powershell
npm run dev
```

API:
`http://localhost:5000`

Health check:
`GET http://localhost:5000/`

## 5. API routes

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`
- POST `/api/faqs`
- GET `/api/faqs`
- GET `/api/faqs/:id`
- GET `/api/faqs/search?q=node`
- PUT `/api/faqs/:id`
- DELETE `/api/faqs/:id`
- POST `/api/ai/answer`
- POST `/api/ai/generate-faq`

The project uses CommonJS for the application while loading the modern `@google/genai` SDK with dynamic `import()`. This avoids the CommonJS/ESM mismatch.

## Important

Do not commit `.env` to Git. If an API key has been exposed, revoke/rotate it and replace the value in `.env`.
