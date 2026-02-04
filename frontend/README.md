# Todo App - React + TypeScript + Backend API

En fullstack to do app byggd med **react och typescript** i frontend samt ett **eget backend API** med CRUD.  


## Funktionalitet
- Visa alla todos
- Skapa ny todo med validering
- Uppdatera status (ej påbörjad, pågående, avklarad)
- Ta bort todo
- Laddnings- och felhantering vid API anrop
- Responsiv design (desktop & mobil)

## Tekniker
**Frontend**
- React
- TypeScript
- Vite
- CSS 

**Backend**
- Node.js
- Express
- PostgreSQL
- REST API (CRUD)

## Live demo
Frontend:  
https://todooooooooooooooo.netlify.app

Backend är publicerad separat och används av frontend via API.

## Starta projektet lokalt

### Backend
```bash
cd backend
npm install
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend kräver en enviroment variable:
VITE_API_BASE_URL=http://localhost:5000

## API endpoints
- GET /api/todos
- POST /api/todos
- PATCH /api/todos/:id/status
- DELETE /api/todos/:id