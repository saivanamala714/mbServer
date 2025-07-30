#!/bin/bash

# Firebase Deployment Script for mbServer
echo "🚀 Starting Firebase deployment for mbServer..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

echo "✅ Firebase authentication verified"

# Show current project
echo "📋 Current Firebase project:"
firebase use

# Deploy functions
echo "🔧 Deploying Firebase Functions..."
firebase deploy --only functions

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your application is now live at:"
    echo "https://us-central1-mbserver-api-2025.cloudfunctions.net/api"
    echo ""
    echo "📊 Test your endpoints:"
    echo "curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api"
    echo "curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api/health"
    echo "curl https://us-central1-mbserver-api-2025.cloudfunctions.net/api/api/users"
    echo ""
    echo "🎯 Firebase Console:"
    echo "https://console.firebase.google.com/project/mbserver-api-2025/overview"
else
    echo "❌ Deployment failed!"
    echo ""
    echo "🔍 Common issues:"
    echo "1. Make sure you're on the Blaze (pay-as-you-go) plan"
    echo "2. Check that all required APIs are enabled"
    echo "3. Verify your Firebase project permissions"
    echo ""
    echo "📖 For help, check: DEPLOYMENT.md"
    exit 1
fi
