@ECHO OFF
cd frontend
start "" bun dev
start "" http://localhost:5173
cd ..
cd backend
node sv.js
PAUSE