const { Device } = require('../../models/index.js');
const { verifyToken } = require('../Middleware/Auth');
class DeviceController
{
    async getDeviceApi (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {
                const result = await Device.findAll({ where: {adminId: Number(token.id)}})
                return result && result.length > 0 ? {statusCode: 200, items: result} : {statusCode: 404};
            } else {
                return { statusCode: 404 };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }

    async createDevice (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {
                const result = await Device.create({...data, adminId: token.id})
                return result ? {statusCode: 200, items: result} : {statusCode: 404};
            } else {
                return { statusCode: 404 };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }

    async updateDevice (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {
                const result = await Device.update({
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
    async deleteDevice (data) {
        try {
            const token = verifyToken(data)
            if (token && token.statusCode === 200) {        
                await Device.destroy({where: {id: Number(data.id)}})
                return { statusCode: 200 };
            } else {
                return { statusCode: 404, msg: 'deleteDevice' };
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }
}
module.exports = new DeviceController();