const { Smen } = require('../../models/index.js');
const { verifyToken } = require('../Middleware/Auth');
class SmenController
{
    async getSmenApi (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {
                const result = await Smen.findAll({ where: {adminId: Number(token.id)}})
                return result ? {statusCode: 200, items: result} : {statusCode: 404};
            } else {
                return { statusCode: 404 };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }

    async createSmen (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {
                const result = await Smen.create({...data, adminId: token.id})
                return result ? {statusCode: 200, items: result} : {statusCode: 404};
            } else {
                return { statusCode: 404 };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }

    async updateSmen (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {
                const result = await Smen.update({
                    ...data,
                    adminId: token.id
                }, {where: {id: Number(data.id)}})
                return result ? { statusCode: 200 } : { statusCode: 404 }
            } else {
                return { statusCode: 404 };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }
    async deleteSmen (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {        
                await Smen.destroy({where: {id: Number(data.id)}})
                return { statusCode: 200 };
            } else {
                return { statusCode: 404 };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }
}
module.exports = new SmenController();