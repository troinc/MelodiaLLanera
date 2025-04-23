const db = require('../config/db'); // Database connection pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Load .env relative to this file

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email y contraseña son requeridos.' });
    }

    try {
        // 1. Find user by email
        // IMPORTANT: Adjust table and column names if they are different in your DB
        const [rows] = await db.query('SELECT * FROM administradores WHERE email_admin = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' }); // User not found
        }

        const adminUser = rows[0];

        // 2. Compare password
        // IMPORTANT: Assumes password_admin column stores the hashed password
        const isMatch = await bcrypt.compare(password, adminUser.password_admin);

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas.' }); // Password doesn't match
        }

        // 3. Generate JWT if credentials are valid
        const payload = {
            id: adminUser.cod_admin, // Assuming primary key is cod_admin
            email: adminUser.email_admin,
            // Add other relevant non-sensitive info if needed (e.g., name, role)
            name: adminUser.nom_admin // Assuming name column is nom_admin
        };

        if (!JWT_SECRET) {
            console.error('JWT_SECRET no está definido en el archivo .env');
            return res.status(500).json({ status: 'error', message: 'Error de configuración del servidor.' });
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // 4. Send JWT back to the client (e.g., in the response body)
        // Consider using HttpOnly cookies for better security in a real application
        res.json({
            status: 'success',
            message: 'Login exitoso.',
            token: token,
            user: { // Send back some user info (excluding password)
                id: adminUser.cod_admin,
                email: adminUser.email_admin,
                name: adminUser.nom_admin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor durante el login.' });
    }
};

// TODO: Implement other auth functions like logout, checkSession if needed
