const express = require('express');
const userCode = require('./userCode'); // Este archivo lo genera el orquestador 

const app = express();
app.use(express.json()); 

app.all('/', async (req, res) => {
    try {
        // Ejecutamos la función del usuario enviándole query y body
        const result = await userCode.handler(req.query, req.body);
        
        // retornar siempre JSON
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Microservicio Nodejs corriendo en puerto ${PORT}`));