const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile')
const { getUnpaid, pay } = require('../controllers/jobs')

const route = Router();

/**
 * @returns all unpaid jobs
 */
 route.get('/unpaid', getProfile, async (req, res) =>{
    try {
        const { profile_id } = req.headers
        const jobs = await getUnpaid(profile_id)
        res.json(jobs)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
});

/**
 * @returns job paid
 */
 route.post('/:jobId/pay', getProfile, async (req, res) =>{
    try {
        const { profile_id } = req.headers
        const { jobId } = req.params
        const result = await pay(profile_id, jobId);
        res.json(result);
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
});

module.exports = route;