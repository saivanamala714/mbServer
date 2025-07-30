# Firebase Deployment Instructions

## Project Setup Complete ✅

Your Node.js Express server with Firebase Functions integration is ready for deployment!

### What's Been Done:

1. ✅ **Node.js project initialized** with package.json
2. ✅ **Express server created** with multiple API endpoints:
   - `GET /` - Welcome message
   - `GET /health` - Health check
   - `GET /api/users` - Sample users data
3. ✅ **Firebase Functions integration** added
4. ✅ **Firebase project created**: `mbserver-api-2025`
5. ✅ **Configuration files** created (firebase.json, .firebaserc)

### Next Steps for Deployment:

#### 1. Upgrade Firebase Plan (Required)

Firebase Functions requires the **Blaze (pay-as-you-go) plan**. 

**To upgrade:**
1. Visit: https://console.firebase.google.com/project/mbserver-api-2025/usage/details
2. Click "Upgrade to Blaze plan"
3. Add a billing account (you'll only pay for what you use)

**Note:** Firebase Functions has a generous free tier:
- 2 million invocations per month
- 400,000 GB-seconds per month
- 200,000 CPU-seconds per month

#### 2. Deploy to Firebase Functions

After upgrading to Blaze plan, you can deploy using any of these methods:

**Option 1: Using npm script**
```bash
npm run deploy
```

**Option 2: Using Firebase CLI directly**
```bash
firebase deploy --only functions
```

**Option 3: Using the deployment script**
```bash
./deploy.sh
```

#### 3. Test Your Deployed API

Once deployed, your API will be available at:
```
https://us-central1-mbserver-api-2025.cloudfunctions.net/api
```

Test the endpoints:
```bash
# Welcome endpoint
curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api

# Health check
curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api/health

# Users API
curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api/api/users
```

### Local Development

You can continue developing locally:

```bash
# Start local server
npm start

# Test locally
curl http://localhost:3000
curl http://localhost:3000/health
curl http://localhost:3000/api/users
```

### Firebase Console

Monitor your deployment at:
https://console.firebase.google.com/project/mbserver-api-2025/overview

### Troubleshooting

If deployment fails:
1. Ensure you're on the Blaze plan
2. Check that all APIs are enabled in Google Cloud Console
3. Verify your Firebase CLI is logged in: `firebase login`
4. Check function logs: `firebase functions:log`

### Project Structure

```
mbServer/
├── index.js          # Express app with Firebase Functions export
├── package.json      # Dependencies and scripts
├── firebase.json     # Firebase configuration
├── .firebaserc       # Project ID configuration
├── README.md         # Project documentation
└── DEPLOYMENT.md     # This file
```
