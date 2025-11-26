// registration-service.js
const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Database Sederhana (Disimpan dalam memory/RAM sementara)
const patients = [];

// API 1: Mendaftarkan Pasien Baru
app.post('/register', (req, res) => {
    const { name, age, keluhan } = req.body;
    
    // Simulasi ID Unik
    const id = 'PASIEN-' + (patients.length + 1);

    const newPatient = { id, name, age, keluhan, registeredAt: new Date() };
    patients.push(newPatient);

    console.log(`[Registration Service] Pasien baru terdaftar: ${name}`);
    
    res.status(201).json({
        message: 'Pendaftaran Berhasil',
        data: newPatient
    });
});

// API 2: Mengambil Data Pasien
app.get('/patients/:id', (req, res) => {
    const patient = patients.find(p => p.id === req.params.id);
    
    if (!patient) {
        return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }
    
    res.json(patient);
});

// API 3: Cek List Semua Pasien
app.get('/patients', (req, res) => {
    res.json(patients);
});

app.listen(PORT, () => {
    console.log(`Registration Service berjalan di http://localhost:${PORT}`);
});