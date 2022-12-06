const { Contract, Profile, Job, sequelize } = require('../model')
const { Op, literal } = require('sequelize')

const getUnpaid = async (profile_id) => {
    const jobs = await Job.findAll({
        include: [{
            model: Contract,
            where: {
                [Op.or]: {
                    ClientId: profile_id,
                    ContractorId: profile_id,
                },
                status: 'in_progress',
            }
        }],
        where: {
            paid: null
        }
    })
    return jobs
}

const pay = async (profile_id, jobId) => {
    const t = await sequelize.transaction();
    try {
        const job = await Job.findOne({
            include: [{
                model: Contract,
                where: {
                    ClientId: profile_id,
                }
            }],
            where: {
                id: jobId,
                paid: null,
            }
        });

        if (!job) {
            throw new Error('JOB_NOT_FOUND')
        }

        const profile = await Profile.findOne({
            attributes: ['balance'],
            where: { id: profile_id }
        });

        if (!profile || profile.balance < job.price) {
            throw new Error('NOT_ENOUGH_BALANCE')
        }

        // client debit
        await Profile.update({
            balance: profile.balance - job.price
        }, {
            where: {
                id: profile_id
            },
            transaction: t
        });

        // contractor credit
        await Profile.update({
            balance: literal(`balance + ${job.price}`)
        }, {
            where: {
                id: job.Contract.ContractorId
            },
            transaction: t
        })

        // update job
        await Job.update({
            paid: true,
            paymentDate: new Date(),
        }, {
            where: {
                id: jobId
            },
            // returning: true, available only on Postgres
            transaction: t,
        });

        await t.commit();

        const jobUpdated = await Job.findOne({
            where: {
                id: jobId,
            }
        });

        return jobUpdated;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = { getUnpaid, pay };