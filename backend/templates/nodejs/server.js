const express = require('express');
const userCode = require('./userCode');

const app = express();
app.use(express.json());

app.all('/', async (req, res) => {
    try {
        const query = req.query || {};
        const body = req.body || {};
        
        // Ejecutamos la función inyectada con params
        const resultado = await userCode.handler(query, body);

        // retorna json
        res.json({ success: true, data: resultado });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Microservicio Node.js activo en puerto 3000'));