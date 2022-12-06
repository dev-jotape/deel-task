const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile')
const { getContractById, getContracts } = require('../controllers/contracts');

const route = Router();

/**
 * @returns contract by id
 */
route.get('/:id', getProfile, async (req, res) =>{
    try {
        const { id } = req.params
        const { profile_id } = req.headers
        const contract = await getContractById(id, profile_id);
        if(!contract) return res.status(400).send({ error: 'CONTRACT_NOT_FOUND' })
        res.json(contract)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
});

/**
 * @returns contracts by profile id
 */
route.get('/', getProfile, async (req, res) =>{
    try {
        const { profile_id } = req.headers
        const contract = await getContracts(profile_id);
        res.json(contract)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
    
});

module.exports = route;
