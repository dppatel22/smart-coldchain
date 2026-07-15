require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');

// Initialize the application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Security feature to allow React to talk to this API
app.use(express.json()); // Allows our API to read JSON data sent from the frontend

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Smart Cold-Chain API is securely running.'
    });
});
// GET: Fetch all clinics
app.get('/api/clinics', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clinics')
            .select('*'); // '*' selects all columns

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch clinics.' });
    }
});
// POST: Create a new Clinic
app.post('/api/clinics', async (req, res) => {
    try {
        // 1. Extract the data sent by the user (the React frontend)
        const { name, county } = req.body;

        // 2. Security Check: Ensure they didn't send blank data
        if (!name || !county) {
            return res.status(400).json({ error: 'Clinic name and county are required.' });
        }

        // 3. Insert the data into our Supabase database
        const { data, error } = await supabase
            .from('clinics')
            .insert([{ name: name, county: county }])
            .select(); // .select() tells Supabase to return the newly created row

        // 4. Handle any database errors (like connection issues)
        if (error) throw error;

        // 5. Send a success response back to the frontend
        res.status(201).json({
            message: 'Clinic created successfully!',
            clinic: data[0]
        });

    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to create clinic. Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`[SERVER] API is actively listening on http://localhost:${PORT}`);
});