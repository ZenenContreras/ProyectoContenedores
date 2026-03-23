const path = require('path');

module.exports = {
    // Carpeta donde se guardará el código temporal de cada microservicio
    tempServicesDir: path.join(__dirname, '../../temp_services'),
    // Carpeta donde están nuestras plantillas base
    templatesDir: path.join(__dirname, '../../templates'),
    // Puerto inicial para los contenedores (se incrementará dinámicamente)
    startingPort: 4000,
    // Prefijo para identificar fácilmente nuestros contenedores
    containerPrefix: 'ms-dinamico-'
};