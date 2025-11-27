// medical-service.js
const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();
const PORT = 3002;

app.use(cors()); 

app.use(express.json());

// Database Sederhana untuk Rekam Medis
const medicalRecords = [];

// URL Service Tetangga (Registration Service)
const REGISTRATION_SERVICE_URL = 'http://localhost:3001';

// API: Dokter Input Diagnosa
app.post('/diagnose', async (req, res) => {
    const { patientId, diagnosis, resep } = req.body;

    try {
        // STEP 1: Komunikasi Antar Layanan
        // Cek apakah Patient ID valid dengan bertanya ke Registration Service
        await axios.get(`${REGISTRATION_SERVICE_URL}/patients/${patientId}`);

        // STEP 2: Jika pasien ada, simpan diagnosa
        const newRecord = {
            recordId: 'REC-' + (medicalRecords.length + 1),
            patientId,
            diagnosis,
            resep,
            timestamp: new Date()
        };
        
        medicalRecords.push(newRecord);
        console.log(`[Medical Service] Diagnosa ditambahkan untuk: ${patientId}`);

        res.status(201).json({
            message: 'Diagnosa berhasil disimpan',
            data: newRecord
        });

    } catch (error) {
        // Jika Registration Service merespon 404 (Pasien tidak ketemu)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Error: ID Pasien tidak ditemukan di sistem pendaftaran.' });
        }
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// Cek semua rekam medis
app.get('/records', (req, res) => {
    res.json(medicalRecords);
});

app.listen(PORT, () => {
    console.log(`Medical Record Service berjalan di http://localhost:${PORT}`);
});