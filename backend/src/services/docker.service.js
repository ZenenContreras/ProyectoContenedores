const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/docker.config');

const execPromise = util.promisify(exec);
let currentPort = config.startingPort;


const listContainers = async () => {
    // Listamos solo los contenedores que tengan nuestro prefijo
    const command = `docker ps -a --filter "name=${config.containerPrefix}" --format '{"id":"{{.ID}}", "name":"{{.Names}}", "status":"{{.Status}}", "state":"{{.State}}", "ports":"{{.Ports}}"}'`;
    const { stdout } = await execPromise(command);
    
    // Parseamos la salida de Docker a un array JSON
    if (!stdout.trim()) return [];
    return stdout.trim().split('\n').map(line => JSON.parse(line));
};

const startContainer = async (containerName) => {
    await execPromise(`docker start ${containerName}`);
};

const stopContainer = async (containerName) => {
    await execPromise(`docker stop ${containerName}`);
};

const deleteContainer = async (containerName) => {
    // -f fuerza la eliminación incluso si está corriendo
    await execPromise(`docker rm -f ${containerName}`); 
};

const createAndDeploy = async (name, language, code) => {
    const serviceId = uuidv4().substring(0, 8); // Un ID corto
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const serviceDir = path.join(config.tempServicesDir, `${safeName}-${serviceId}`);
    const assignedPort = currentPort++;
    const containerName = `${config.containerPrefix}${safeName}-${serviceId}`;
    const imageName = `img-${safeName}-${serviceId}`;

    // 1. Crear carpeta temporal
    await fs.mkdir(serviceDir, { recursive: true });

    // 2. Preparar archivos según el lenguaje
    const langTemplateDir = path.join(config.templatesDir, language);
    
    if (language === 'nodejs') {
        // Copiamos el Dockerfile y el server base
        await fs.copyFile(path.join(langTemplateDir, 'Dockerfile'), path.join(serviceDir, 'Dockerfile'));
        await fs.copyFile(path.join(langTemplateDir, 'server.js'), path.join(serviceDir, 'server.js'));
        await fs.copyFile(path.join(langTemplateDir, 'package.json'), path.join(serviceDir, 'package.json'));
        
        // Inyectamos el código del usuario en un módulo exportable
        const userCodeWrapped = `module.exports.handler = async (query, body) => {\n${code}\n};`;
        await fs.writeFile(path.join(serviceDir, 'userCode.js'), userCodeWrapped);
    } else if (language === 'python') {
        // Aquí iría la lógica similar para Python
    } else {
        throw new Error('Lenguaje no soportado actualmente');
    }

    // 3. Construir la imagen Docker
    await execPromise(`docker build -t ${imageName} ${serviceDir}`);

    // 4. Ejecutar el contenedor
    await execPromise(`docker run -d -p ${assignedPort}:3000 --name ${containerName} ${imageName}`);

    return {
        id: containerName,
        name: safeName,
        language,
        port: assignedPort,
        endpoint: `http://localhost:${assignedPort}/`, // Cumple con exponer el endpoint HTTP [cite: 9]
        status: 'running'
    };
};

module.exports = {
    listContainers,
    startContainer,
    stopContainer,
    deleteContainer,
    createAndDeploy
};