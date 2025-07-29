# mbServer - Express.js API with Firebase Functions

A simple Express.js server with REST API endpoints, ready for deployment to Firebase Functions.

## Features

- Express.js server with multiple API endpoints
- Health check endpoint
- Sample users API
- Error handling middleware
- Firebase Functions integration
- Local development support

## API Endpoints

- `GET /` - Welcome message with timestamp
- `GET /health` - Health check with uptime information
- `GET /api/users` - Sample users data

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Test the API:
   ```bash
   curl http://localhost:3000
   curl http://localhost:3000/health
   curl http://localhost:3000/api/users
   ```

## Firebase Deployment

### Prerequisites

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Create a Firebase project at https://console.firebase.google.com

### Deployment Steps

1. Update the project ID in `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "mbserver-api-2025"
     }
   }
   ```

2. Deploy to Firebase Functions:
   ```bash
   firebase deploy --only functions
   ```

3. Your API will be available at:
   ```
   https://us-central1-mbserver-api-2025.cloudfunctions.net/api
   ```

### Testing Deployed API

```bash
# Test the deployed endpoints
curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api
curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api/health
curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api/api/users
```

## Project Structure

```
mbServer/
├── index.js          # Main Express application
├── package.json      # Node.js dependencies and scripts
├── firebase.json     # Firebase configuration
├── .firebaserc       # Firebase project configuration
├── .gitignore        # Git ignore file
├── DEPLOYMENT.md     # Detailed deployment instructions
└── README.md         # This file
```

## Dependencies

- `express` - Web framework for Node.js
- `firebase-functions` - Firebase Functions SDK
- `firebase-admin` - Firebase Admin SDK

## Notes

- The Express app is configured to work both locally and as a Firebase Function
- Local development runs on port 3000
- Firebase Functions will handle the port automatically
- Error handling includes different responses for development vs production
