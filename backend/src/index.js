const express = require('express')
const app = express()
const cors = require('cors')
const microservicesRoutes = require('./routes/microservices.routes')
const PORT = 5500

// Permitir peticiones desde el front
app.use(cors())

// Entender los json de req desde el frontend
app.use(express.json())

//Ruta de microservicios
app.use('/api/microservices', microservicesRoutes)

app.get('/' , (req, res) => {
    res.json({message: 'Backend de microservicios funcionando correctamente'})
})

app.listen(PORT, () => {
    console.log(`Backend Microservicios corriendo en http://localhost:${PORT}`)
})

