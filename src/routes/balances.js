const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile')
const { deposit } = require('../controllers/balances');

const route = Router();

/**
 * @returns updated profile
 */
 route.post('/deposit/:userId', getProfile, async (req, res) =>{
    try {
        const { userId } = req.params
        const { value } = req.body

        const profile = await deposit(userId, value)
        res.json(profile)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
});

module.exports = route;