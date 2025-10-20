#!/bin/bash

echo "Setting up ELD Application..."

# Setup frontend
echo "\n=== Setting up Frontend ===\n"
echo "Installing frontend dependencies..."
# npm install

# Setup backend
echo "\n=== Setting up Backend ===\n"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Verify installations
if [ $? -ne 0 ]; then
    echo "\nError: Failed to install dependencies. Please check the error messages above."
    exit 1
fi

# Test Django installation
echo "\nTesting Django installation..."
cd backend
python test_django.py
cd ..

# Check if Django test was successful
if [ $? -ne 0 ]; then
    echo "\nError: Django installation test failed. Please check the error messages above."
    exit 1
fi

# Change to backend directory for the remaining operations
cd backend

# Initialize database
echo "\nInitializing database..."
python init_db.py

# Check if database initialization was successful
if [ $? -ne 0 ]; then
    echo "\nError: Failed to initialize database. Please check the error messages above."
    cd ..
    exit 1
fi

# Run migrations
echo "\nRunning migrations..."
python manage.py migrate

# Return to the main directory
cd ..

echo "\n=== Setup Complete ===\n"
echo "To start the application:"
echo "1. Start the backend server: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. In a new terminal, start the frontend: npm run dev"
echo "\nThe application will be available at http://localhost:3000"