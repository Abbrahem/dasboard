@echo off
echo 🏥 Medical Clinic Dashboard - Starting...
echo.

echo 🔄 Killing any existing Node processes...
taskkill /f /im node.exe >nul 2>&1

echo 📦 Installing dependencies...
call npm install

echo.
echo 🚀 Starting the application...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Login credentials:
echo Admin: admin@clinic.com / admin123
echo Doctor: doctor1@clinic.com / doctor123
echo Receptionist: receptionist@clinic.com / receptionist123
echo.

call npm run dev:full
