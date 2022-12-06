const { Profile, Contract, Job } = require('../model')
const { Op, literal, fn, col } = require('sequelize')

const getBestProfession = async (start, end) => {
    const profile = await Profile.findAll({
        attributes: [
            [fn('sum', col('Contractor.Jobs.price')), 'total'],
            'profession'
        ],
        subQuery: false,
        include: [{
            attributes: [],
            model: Contract,
            as: 'Contractor',
            required: true,
            include: [{
                attributes: [],
                model: Job,
                required: true,
                where: {
                    paymentDate: {
                        [Op.between]: [start, end]
                    }
                }
            }]
        }],
        group: ['profession'],
        order: [['total', 'desc']],
        limit: 1,
        raw: true,
    });
    return profile
}

const getBestClients = async (start, end, limit=2) => {
    const profile = await Profile.findAll({
        attributes: [
            'Profile.id',
            [literal(`firstName || ' ' || lastName`), 'fullName'],
            [fn('sum', col('Client.Jobs.price')), 'paid'],
        ],
        subQuery: false,
        include: [{
            attributes: [],
            model: Contract,
            as: 'Client',
            required: true,
            include: [{
                attributes: [],
                model: Job,
                required: true,
                where: {
                    paymentDate: {
                        [Op.between]: [start, end]
                    }
                }
            }]
        }],
        group: ['Profile.id'],
        order: [['paid', 'desc']],
        limit: limit,
        raw: true,
    });
    return profile;
}

module.exports = { getBestProfession, getBestClients };