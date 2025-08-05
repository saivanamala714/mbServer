const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    storageBucket: 'mbserver-api-2025.appspot.com'
  });
}

// Get Firebase Storage bucket
const bucket = admin.storage().bucket();
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for events (in production, use a database)
let events = [];

// Serve the main dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API welcome endpoint
app.get('/api/welcome', (req, res) => {
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
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    platform: os.platform(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: process.memoryUsage()
    }
  });
});

// Server information endpoint
app.get('/api/server-info', (req, res) => {
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    cpus: os.cpus().length,
    uptime: process.uptime(),
    nodeVersion: process.version,
    location: 'US-Central (Firebase Functions)',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    memory: {
      total: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
      free: Math.round(os.freemem() / 1024 / 1024) + ' MB',
      usage: process.memoryUsage()
    },
    loadAverage: os.loadavg()
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

// POST endpoint to save events
app.post('/api/event/saveEvent', async (req, res) => {
  try {
    const { id, date, details } = req.body;

    // Validate required fields
    if (!id || !date || !details) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide id, date, and details',
        required: ['id', 'date', 'details']
      });
    }

    // Check if event with same ID already exists
    const existingEventIndex = events.findIndex(event => event.id === id);

    const eventData = {
      id,
      date,
      details,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingEventIndex !== -1) {
      // Update existing event
      eventData.createdAt = events[existingEventIndex].createdAt;
      events[existingEventIndex] = eventData;
    } else {
      // Create new event
      events.push(eventData);
    }

    // Save event data to Firebase Storage
    try {
      const fileName = `events/event_${id}_${Date.now()}.json`;
      const file = bucket.file(fileName);
      
      await file.save(JSON.stringify(eventData, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            eventId: id,
            uploadedAt: new Date().toISOString(),
            source: 'saveEvent-api'
          }
        }
      });

      console.log(`Event ${id} saved to Firebase Storage: ${fileName}`);
      
      // Add cloud storage info to response
      eventData.cloudStorageFile = fileName;
      
    } catch (storageError) {
      console.error('Failed to save to Firebase Storage:', storageError);
      // Continue with local storage even if cloud storage fails
      eventData.cloudStorageError = 'Failed to save to cloud storage';
    }

    if (existingEventIndex !== -1) {
      res.json({
        message: 'Event updated successfully',
        event: eventData,
        action: 'updated'
      });
    } else {
      res.status(201).json({
        message: 'Event created successfully',
        event: eventData,
        action: 'created'
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save event',
      details: error.message
    });
  }
});

// GET endpoint to retrieve all events
app.get('/api/events', (req, res) => {
  try {
    // Sort events by creation date (newest first)
    const sortedEvents = events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: 'Events retrieved successfully',
      data: sortedEvents,
      count: sortedEvents.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve events',
      details: error.message
    });
  }
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
