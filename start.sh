#!/bin/bash

echo "🏥 Medical Clinic Dashboard - Starting..."
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "🚀 Starting the application..."
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API will be available at: http://localhost:5000"
echo ""
echo "Login credentials:"
echo "Admin: admin@clinic.com / admin123"
echo "Doctor: doctor1@clinic.com / doctor123"
echo "Receptionist: receptionist@clinic.com / receptionist123"
echo ""

npm run dev:full
