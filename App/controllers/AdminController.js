const { Admin } = require('../../models/index.js');
const { generateToken, verifyToken } = require('../Middleware/Auth');

class AdminController {
  async getProfilApi (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const model = await Admin.findOne({
          where: {
            username: token.username,
            password: token.password,
          }
        })
        return model && model.id ? { statusCode: 200, 
          items: {
            id: model.id,
            username: model.username,
            password: model.password,
          }
         } : { statusCode: 404, msg: 'getProfilApi'};
      } else {
        return { statusCode: 404, msg: 'getProfilApi' };
      }
    } catch (error) {
      return { statusCode: 404, msg: error };
    }
  }

  async setTimeApi (data) {
    try {
      const model = await Admin.findAll()
      if (model && model.length > 0) {
        const result = model[0];
        if (Number(result.count) > Number(result.count2)) {
          result.count2 = Number(result.count2) + Number(data.time);
          await result.save()
          return { statusCode: 200 }
        } else {
          return { statusCode: 300, key: model.key }
        }
      } else {
        return { statusCode: 404, msg: 'setTimeApi' }
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async create(data) {
    try {
      const model = await Admin.findAll()
      if (model && model.length > 0) {
        if (model[0].username === data.username && model[0].password === data.password) {
          const token = generateToken({
            id: model[0].id,
            username: model[0].username,
            password: model[0].password
          });
          return { statusCode: 200, token };
        } else {
          return { statusCode: 404, msg: 'create' };
        }
      } else {
        const result = await Admin.create(data);
        if (result) {
          const token = generateToken({
            id: result.id,
            username: result.username,
            password: result.password
          });
          return { statusCode: 200, token };
        } else {
          return { statusCode: 404, msg: 'create' };
        }
      }
    } catch (error) {
      return { statusCode: 404, msg: error };
    }
  }
  async updateProfile (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const result = await Admin.update({
          username: data.username,
          password: data.password,
        }, {where: {id: Number(data.id)}})
        return result ? { statusCode: 200 } : { statusCode: 404 }
      } else {
        return { statusCode: 404, msg: 'updateProfile' };
      }
    } catch (error) {
      return { statusCode: 404, msg: error};
    }
  }
  async deleteProfile (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {        
        await Admin.destroy({where: {id: Number(token.id)}})
        return { statusCode: 200 };
      } else {
        return { statusCode: 404, msg: 'deleteProfile' };
      }
    } catch (error) {
      return { statusCode: 404, msg: error };
    }
  }
}

module.exports = new AdminController();
