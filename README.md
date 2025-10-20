# ELD (Electronic Logging Device) Application

This application helps truck drivers manage their electronic logging device (ELD) records, including creating log sheets, tracking hours of service, and generating PDF reports.

## Features

- Create and manage daily log sheets
- Track driving, on-duty, sleeper berth, and off-duty hours
- Add remarks and notes to log entries
- Calculate 70-hour cycle usage
- Generate and download PDF reports
- Save logs to a database for future reference

## Project Structure

- `/components` - React components for the UI
- `/pages` - Next.js pages
- `/utils` - Utility functions for calculations, PDF generation, and API services
- `/backend` - Django backend for data storage and retrieval

## Setup Instructions

### Frontend (Next.js)

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Backend (Django)

See the [backend README](/backend/README.md) for detailed setup instructions.

## How to Use

1. Enter trip information (current location, pickup, dropoff)
2. Select the cycle type (70-hour)
3. Add log sheets for each day of your trip
4. Draw activities on the log sheets (driving, on-duty, sleeper berth, off-duty)
5. Add remarks for each activity change
6. Click "Save & Download PDF" to save your logs to the database and generate a PDF report

## Technologies Used

- Frontend:
  - Next.js
  - React
  - TypeScript
  - jsPDF (for PDF generation)
  - HTML Canvas (for drawing log sheets)

- Backend:
  - Django
  - Django REST Framework
  - MySQL