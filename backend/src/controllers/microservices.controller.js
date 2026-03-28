const dockerService = require('../services/docker.service');

const createMicroservice = async (req, res) => {
    try {
        const { name, language, code, description } = req.body;

        if (!name || !code || !language) {
            return res.status(400).json({ success: false, error: "Faltan datos requeridos" });
        }
                   
        const newService = await dockerService.createAndDeploy(name, language, code, description);

        res.status(201).json({ success: true, data: newService });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const listMicroservices = async (req, res) => {
    try {
        // --> service
        const containers = await dockerService.listContainers();
        res.json({ success: true, data: containers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const startMicroservice = async (req, res) => {
    try {
        // -> service
        await dockerService.startContainer(req.params.id);
        res.json({ success: true, message: `Microservicio ${req.params.id} iniciado.` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const stopMicroservice = async (req, res) => {
    try {
        // -> service
        await dockerService.stopContainer(req.params.id);
        res.json({ success: true, message: `Microservicio ${req.params.id} detenido.` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteMicroservice = async (req, res) => {
    try {
        // -> service
        await dockerService.deleteContainer(req.params.id);
        res.json({ success: true, message: `Microservicio ${req.params.id} eliminado.` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createMicroservice,
    listMicroservices,
    startMicroservice,
    stopMicroservice,
    deleteMicroservice
};