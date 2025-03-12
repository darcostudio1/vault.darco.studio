@echo off
echo Installing dependencies...
npm install

echo Running migration script...
npm run migrate

pause
