// gateway-service.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000; // Port Pintu Gerbang Utama

app.use(cors()); // Izinkan Frontend mengakses Gateway

// LOGGING (Untuk BUKTI Presentasi)
app.use((req, res, next) => {
    console.log(`[GATEWAY] Menerima request ke: ${req.url}`);
    next();
});

// ATURAN 1: Kalau ada request ke /api/registration -> Arahkan ke Port 3001
app.use('/api/registration', createProxyMiddleware({
    target: 'http://localhost:3001', // Arahkan ke Service 1
    changeOrigin: true,
    pathRewrite: {
        '^/api/registration': '', // Hapus prefix saat diteruskan
    },
}));

// ATURAN 2: Kalau ada request ke /api/medical -> Arahkan ke Port 3002
app.use('/api/medical', createProxyMiddleware({
    target: 'http://localhost:3002', // Arahkan ke Service 2
    changeOrigin: true,
    pathRewrite: {
        '^/api/medical': '', 
    },
}));

app.listen(PORT, () => {
    console.log(`API GATEWAY berjalan di http://localhost:${PORT}`);
});