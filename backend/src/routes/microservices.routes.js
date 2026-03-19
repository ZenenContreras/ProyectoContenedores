const express = require('express');
const router = express.Router();
const controller = require('../controllers/microservices.controller');

// Crear un nuevo microservicio
router.post('/', controller.createMicroservice);

// Listar los microservicios
router.get('/', controller.listMicroservices);

// Habilitar un microservicio
router.post('/:id/start', controller.startMicroservice);

// Deshabilitar un microservicio
router.post('/:id/stop', controller.stopMicroservice);

// Eliminar un microservicio
router.delete('/:id', controller.deleteMicroservice);

module.exports = router;