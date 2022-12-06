const { Contract } = require('../model')
const { Op } = require('sequelize')

const getContractById = async (id, profile_id) => {
    const contract = await Contract.findOne({
        where: {
            id,
            [Op.or]: {
                ClientId: profile_id,
                ContractorId: profile_id,
            }
        }
    })
    return contract
}

const getContracts = async (profile_id) => {
    const contract = await Contract.findAll({
        where: {
            [Op.or]: {
                ClientId: profile_id,
                ContractorId: profile_id,
            }
        }
    })
    return contract;
}

module.exports = { getContractById, getContracts };