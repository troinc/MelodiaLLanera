require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
// const db = require('./config/db'); // We'll create this later

const app = express();
const PORT = process.env.API_PORT || 5001; // Use port from .env or default to 5001

// --- Middleware ---
// Enable CORS for requests from the React frontend (adjust origin in production)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001', // Allow frontend origin
  credentials: true // If you need to handle cookies/sessions
}));

// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies (optional, but good practice)
app.use(express.urlencoded({ extended: true }));

// --- Basic Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Admin API is running!' });
});

// --- API Routes ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// TODO: Add other routes (products, categories, etc.) here
// Example: app.use('/api/products', require('./routes/productRoutes'));

// --- Error Handling Middleware (Basic) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Admin API server listening on port ${PORT}`);
  // Optional: Test DB connection on startup
  /*
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Database connected successfully!');
    connection.release();
  });
  */
});
