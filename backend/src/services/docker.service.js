const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const crypto = require('crypto');
const config = require('../config/docker.config');

const execPromise = util.promisify(exec);
let currentPort = config.startingPort;

const listContainers = async () => {
    const command = `docker ps -a --filter "name=${config.containerPrefix}" --format '{"id":"{{.ID}}", "name":"{{.Names}}", "status":"{{.Status}}", "state":"{{.State}}", "ports":"{{.Ports}}", "description":"{{.Label "desc"}}"}'`;
    const { stdout } = await execPromise(command);
    
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
    await execPromise(`docker rm -f ${containerName}`); 
};

const createAndDeploy = async (name, language, code, description) => {
    const serviceId = crypto.randomUUID().substring(0, 8);
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
        await fs.copyFile(path.join(langTemplateDir, 'Dockerfile'), path.join(serviceDir, 'Dockerfile'));
        await fs.copyFile(path.join(langTemplateDir, 'server.js'), path.join(serviceDir, 'server.js'));
        await fs.copyFile(path.join(langTemplateDir, 'package.json'), path.join(serviceDir, 'package.json'));
        
        const userCodeWrapped = `module.exports.handler = async (query, body) => {\n${code}\n};`;
        await fs.writeFile(path.join(serviceDir, 'userCode.js'), userCodeWrapped);

    } else if (language === 'python') {
        await fs.copyFile(path.join(langTemplateDir, 'Dockerfile'), path.join(serviceDir, 'Dockerfile'));
        await fs.copyFile(path.join(langTemplateDir, 'server.py'), path.join(serviceDir, 'server.py'));
        await fs.copyFile(path.join(langTemplateDir, 'requirements.txt'), path.join(serviceDir, 'requirements.txt'));
        
        const userCodeWrapped = `from flask import request\n\ndef handler(query, body):\n` + code.split('\n').map(line => `    ${line}`).join('\n'); 
        
        await fs.writeFile(path.join(serviceDir, 'userCode.py'), userCodeWrapped);    
    } else {
        throw new Error('Lenguaje no soportado actualmente');
    } 

    // 3. Construir la imagen Docker
    await execPromise(`docker build -t ${imageName} ${serviceDir}`);

    // 4. Ejecutar el contenedor
    const safeDescription = description ? description.replace(/"/g, '\\"') : 'Sin descripción';
    await execPromise(`docker run -d -p ${assignedPort}:3000 --name ${containerName} --label desc="${safeDescription}" --label "com.docker.compose.project=proyectocontenedores" ${imageName}`);

    return {
        id: containerName,
        name: safeName,
        language,
        port: assignedPort,
        endpoint: `http://localhost:${assignedPort}/`,
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