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

// ═════════════════════════════════════════════════════════════════════════════
// Health Route
// ═════════════════════════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Smart Cold-Chain API is securely running.'
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// Clinics Routes
// ═════════════════════════════════════════════════════════════════════════════
app.get('/api/clinics', async (req, res) => {
    try {
        const { data, error } = await supabase.from('clinics').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch clinics.' });
    }
});

app.get('/api/clinics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('clinics')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(404).json({ error: 'Clinic not found.' });
    }
});

app.post('/api/clinics', async (req, res) => {
    try {
        const { name, county, contact_phone } = req.body;
        if (!name || !county) {
            return res.status(400).json({ error: 'Clinic name and county are required.' });
        }
        const { data, error } = await supabase
            .from('clinics')
            .insert([{ name, county, contact_phone: contact_phone || null }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'Clinic created successfully!', clinic: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to create clinic. Internal server error.' });
    }
});

app.put('/api/clinics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, county, contact_phone } = req.body;

        const { data, error } = await supabase
            .from('clinics')
            .update({ name, county, contact_phone })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ error: 'Clinic not found.' });
        res.status(200).json({ message: 'Clinic updated successfully!', clinic: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to update clinic.' });
    }
});

app.delete('/api/clinics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('clinics').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: 'Clinic removed successfully!' });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to remove clinic.' });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// Users Routes
// ═════════════════════════════════════════════════════════════════════════════
app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*, clinics ( name, county )');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, role, clinic_id } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ error: 'Name, email, and role are required.' });
        }
        if (!['admin', 'clinic_officer'].includes(role)) {
            return res.status(400).json({ error: "Role must be 'admin' or 'clinic_officer'." });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, role, clinic_id: clinic_id || null }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'User created successfully!', user: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// Batches (Medicine Inventory) Routes
// ═════════════════════════════════════════════════════════════════════════════
app.get('/api/batches', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('batches')
            .select('*, clinics ( name, county )');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch medicine batches.' });
    }
});

app.get('/api/batches/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('batches')
            .select('*, clinics ( name, county )')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(404).json({ error: 'Batch not found.' });
    }
});

app.post('/api/batches', async (req, res) => {
    try {
        const {
            name,
            clinic_id,
            expiry_date,
            quantity,
            unit,
            min_temp_c,
            max_temp_c
        } = req.body;

        if (!name || !expiry_date) {
            return res.status(400).json({ error: 'Medicine name and expiry date are required.' });
        }

        const insertPayload = {
            name,
            clinic_id: clinic_id || null,
            expiry_date,
            status: 'Usable'
        };
        // Only override the schema's defaults if the caller actually sent them
        if (quantity !== undefined) insertPayload.quantity = quantity;
        if (unit !== undefined) insertPayload.unit = unit;
        if (min_temp_c !== undefined) insertPayload.min_temp_c = min_temp_c;
        if (max_temp_c !== undefined) insertPayload.max_temp_c = max_temp_c;

        const { data, error } = await supabase
            .from('batches')
            .insert([insertPayload])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'Batch logged successfully!', batch: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to create batch.' });
    }
});

app.patch('/api/batches/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, status, expiry_date, min_temp_c, max_temp_c } = req.body;

        const updatePayload = {};
        if (quantity !== undefined) updatePayload.quantity = quantity;
        if (status !== undefined) updatePayload.status = status;
        if (expiry_date !== undefined) updatePayload.expiry_date = expiry_date;
        if (min_temp_c !== undefined) updatePayload.min_temp_c = min_temp_c;
        if (max_temp_c !== undefined) updatePayload.max_temp_c = max_temp_c;

        const { data, error } = await supabase
            .from('batches')
            .update(updatePayload)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ error: 'Batch not found.' });
        res.status(200).json({ message: 'Batch updated successfully!', batch: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to update batch.' });
    }
});

app.delete('/api/batches/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('batches').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: 'Batch removed successfully!' });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to remove batch.' });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// Shipments Routes
// ═════════════════════════════════════════════════════════════════════════════
app.get('/api/shipments', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('shipments')
            .select(`
                *,
                batches ( name, expiry_date, min_temp_c, max_temp_c ),
                origin:origin_clinic_id ( name, county ),
                destination:destination_clinic_id ( name, county )
            `);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch shipments.' });
    }
});

app.post('/api/shipments', async (req, res) => {
    try {
        const { batch_id, origin_clinic_id, destination_clinic_id, quantity } = req.body;

        if (!batch_id || !origin_clinic_id || !destination_clinic_id) {
            return res.status(400).json({
                error: 'batch_id, origin_clinic_id, and destination_clinic_id are required.'
            });
        }

        const { data, error } = await supabase
            .from('shipments')
            .insert([{
                batch_id,
                origin_clinic_id,
                destination_clinic_id,
                quantity: quantity || 0,
                status: 'Pending'
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'Shipment created successfully!', shipment: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to create shipment.' });
    }
});

// Update shipment status - stamps dispatched_at / delivered_at automatically
app.patch('/api/shipments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Pending', 'In Transit', 'Delivered', 'Failed'].includes(status)) {
            return res.status(400).json({ error: 'A valid status is required.' });
        }

        const updatePayload = { status };
        if (status === 'In Transit') updatePayload.dispatched_at = new Date().toISOString();
        if (status === 'Delivered') updatePayload.delivered_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('shipments')
            .update(updatePayload)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ error: 'Shipment not found.' });
        res.status(200).json({ message: 'Shipment updated successfully!', shipment: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to update shipment.' });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// Temperature Readings Routes (used by the IoT simulator)
// ═════════════════════════════════════════════════════════════════════════════
// GET readings for a clinic OR a shipment: /api/temperature-readings?clinic_id=...
// or /api/temperature-readings?shipment_id=...
app.get('/api/temperature-readings', async (req, res) => {
    try {
        const { clinic_id, shipment_id } = req.query;

        let query = supabase.from('temperature_readings').select('*').order('recorded_at', { ascending: false });
        if (clinic_id) query = query.eq('clinic_id', clinic_id);
        if (shipment_id) query = query.eq('shipment_id', shipment_id);

        const { data, error } = await query;
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch temperature readings.' });
    }
});

app.post('/api/temperature-readings', async (req, res) => {
    try {
        const { clinic_id, shipment_id, temperature } = req.body;

        if (temperature === undefined) {
            return res.status(400).json({ error: 'A temperature value is required.' });
        }
        if ((!clinic_id && !shipment_id) || (clinic_id && shipment_id)) {
            return res.status(400).json({
                error: 'Provide exactly one of clinic_id or shipment_id, not both or neither.'
            });
        }

        const { data, error } = await supabase
            .from('temperature_readings')
            .insert([{ clinic_id: clinic_id || null, shipment_id: shipment_id || null, temperature }])
            .select();

        if (error) throw error;

        // Automated cold-chain breach check: if this reading belongs to a
        // shipment, look up its batch's safe range and flag it if breached.
        if (shipment_id) {
            const { data: shipment, error: shipmentError } = await supabase
                .from('shipments')
                .select('batch_id, batches ( min_temp_c, max_temp_c )')
                .eq('id', shipment_id)
                .single();

            if (!shipmentError && shipment?.batches) {
                const { min_temp_c, max_temp_c } = shipment.batches;
                if (temperature < min_temp_c || temperature > max_temp_c) {
                    await supabase
                        .from('batches')
                        .update({ status: 'Compromised' })
                        .eq('id', shipment.batch_id);
                }
            }
        }

        res.status(201).json({ message: 'Reading logged successfully!', reading: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to log temperature reading.' });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// Redistributions Routes (Inter-Facility Surplus Marketplace)
// ═════════════════════════════════════════════════════════════════════════════
app.get('/api/redistributions', async (req, res) => {
    try {
        const { status } = req.query;

        let query = supabase
            .from('redistributions')
            .select(`
                *,
                batches ( name, expiry_date, unit ),
                offering:offering_clinic_id ( name, county ),
                claiming:claiming_clinic_id ( name, county )
            `);
        if (status) query = query.eq('status', status);

        const { data, error } = await query;
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to fetch redistribution listings.' });
    }
});

app.post('/api/redistributions', async (req, res) => {
    try {
        const { batch_id, offering_clinic_id, quantity_offered } = req.body;

        if (!batch_id || !offering_clinic_id) {
            return res.status(400).json({ error: 'batch_id and offering_clinic_id are required.' });
        }

        const { data, error } = await supabase
            .from('redistributions')
            .insert([{
                batch_id,
                offering_clinic_id,
                quantity_offered: quantity_offered || 0,
                status: 'Available'
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'Batch listed for redistribution!', redistribution: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to list batch for redistribution.' });
    }
});

// Claim a listed batch
app.patch('/api/redistributions/:id/claim', async (req, res) => {
    try {
        const { id } = req.params;
        const { claiming_clinic_id } = req.body;

        if (!claiming_clinic_id) {
            return res.status(400).json({ error: 'claiming_clinic_id is required.' });
        }

        const { data, error } = await supabase
            .from('redistributions')
            .update({
                claiming_clinic_id,
                status: 'Claimed',
                claimed_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('status', 'Available') // prevent double-claiming
            .select();

        if (error) throw error;
        if (!data.length) {
            return res.status(409).json({ error: 'Listing is no longer available.' });
        }
        res.status(200).json({ message: 'Redistribution claimed successfully!', redistribution: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to claim redistribution listing.' });
    }
});

app.patch('/api/redistributions/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('redistributions')
            .update({ status: 'Cancelled' })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ error: 'Listing not found.' });
        res.status(200).json({ message: 'Listing cancelled.', redistribution: data[0] });
    } catch (error) {
        console.error('[Database Error]:', error.message);
        res.status(500).json({ error: 'Failed to cancel listing.' });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// Server Initialization
// ═════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
    console.log(`[SERVER] API is actively listening on http://localhost:${PORT}`);
});