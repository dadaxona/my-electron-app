const { Admin } = require('../../models/index.js');
const { verifyToken } = require('../Middleware/Auth');
class Apikey
{
    async setusername(data) {
        try {
            const token = verifyToken(data)
            if (token.statusCode === 200) {
                const model = await Admin.findOne({
                    where: {
                        id: token.id,
                        username: token.username,
                        password: token.password,
                    }
                })
                if (model && model.key) {
                    return { statusCode: 200, key: model.key };
                } else {                    
                    return { statusCode: 404, key: false }
                }
            } else {
                return { statusCode: 404, msg: 'setusername' }
            }
        } catch (error) {
            return { statusCode: 404, msg: error }
        }
    }

    async apiKeyKl (data) {
        try {
            const token = verifyToken(data)
            if (token.statusCode === 200) {
                const model = await Admin.findOne({
                    where: {
                        id: token.id,
                        username: token.username,
                        password: token.password,
                    }
                })
                if (model) {
                    model.key = data.key;
                    await model.save();
                    return { statusCode: 200 };
                } else {                    
                    return { statusCode: 404 }
                }
            } else {
                return { statusCode: 404 }
            }
        } catch (error) {
            return { statusCode: 404 }
        }
    }
}
module.exports = new Apikey();