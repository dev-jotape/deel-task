const { Contract, Profile, Job } = require('../model')
const { Op, fn, col, literal } = require('sequelize')

const deposit = async (userId, value) => {
    try {
        // get unpaid
        const jobs = await Job.findAll({
            attributes: [[fn('sum', col('price')), 'total']],
            include: [{
                attributes: [],
                model: Contract,
                where: {
                    [Op.or]: {
                        ClientId: userId,
                        ContractorId: userId,
                    }
                }
            }],
            where: {
                paid: null
            },
            raw: true
        });

        const total = jobs[0].total + (jobs[0].total * (process.env.DEPOSIT_PERCENTAGE / 100));

        if (value > total) {
            throw new Error('DEPOSIT_OVER_LIMIT');
        }

        await Profile.update({
            balance: literal(`balance + ${value}`)
        }, {
            where: {
                id: userId,
            }
        });

        const profile = await Profile.findOne({
            where: {
                id: userId,
            }
        })
        return profile;
    } catch (error) {
        throw error;
    }
}

module.exports = { deposit };