// gateway-service.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// LOGGING
app.use((req, res, next) => {
    console.log(`[GATEWAY] Menerima request ke: ${req.url}`);
    next();
});

// Request ke /api/registration -> Arahkan ke Port 3001
app.use('/api/registration', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/registration': '', // Hapus prefix saat diteruskan
    },
}));

// Request ke /api/medical -> Arahkan ke Port 3002
app.use('/api/medical', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/medical': '', 
    },
}));

app.listen(PORT, () => {
    console.log(`API GATEWAY berjalan di http://localhost:${PORT}`);
});