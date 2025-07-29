const express = require('express');
const functions = require('firebase-functions');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Simple GET API endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to mbServer!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Sample API endpoint with data
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  
  res.json({
    message: 'Users retrieved successfully',
    data: users,
    count: users.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 3000;

// For Firebase Functions, we export the app
// For local development, we start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to see the API`);
  });
}

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

// Also export the app for local development
module.exports = app;
