const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile')
const { getBestProfession, getBestClients } = require('../controllers/admin')

const route = Router();

/**
 * @returns best profession
 */
 route.get('/best-profession', getProfile, async (req, res) =>{
    try {
        const { start, end } = req.query;
        const profile = await getBestProfession(start, end);
        res.json(profile);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

/**
 * @returns best clients
 */
 route.get('/best-clients', getProfile, async (req, res) =>{
    try {
        const { start, end, limit } = req.query
        const profile = await getBestClients(start, end, limit)
        res.json(profile)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
});

module.exports = route;