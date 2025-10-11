const { Op } = require('sequelize');
const { Mijoz, Smen, Analiz, Control, Device } = require('../../models/index.js');
const { verifyToken } = require('../Middleware/Auth');
const fs = require("fs");
const path = require("path");

const HelpControl = require('./HelpControl');

class UserController
{
  async Event (req, res) {
    const rawEvent = req.body.AccessControllerEvent || req.body.event_log;
    const event = JSON.parse(rawEvent);    
    if (event.AccessControllerEvent?.employeeNoString) {
      const employeeNo = event.AccessControllerEvent?.employeeNoString || null;            
      if (employeeNo) {
        try {
            if (event.ipAddress) {
              const device = await Device.findOne({
                where: {ip: event.ipAddress}
              })
              if (device && device.method === 'Barchasi') {
                new HelpControl().createOrupdate(employeeNo)
              }
              if (device && device.method === 'Kirish') {
                new HelpControl().create(employeeNo)
              }
              if (device && device.method === 'Chiqish') {
                new HelpControl().update(employeeNo)
              }
            }
        } catch (error) {
          return res.status(200).send('OK');
        }
      }
    }
    return res.status(200).send('OK');
  }

  // async Event2 (req, res) {
  //   const rawEvent = req.body.AccessControllerEvent || req.body.event_log;
  //   const event = JSON.parse(rawEvent);
  //   if (event.AccessControllerEvent?.employeeNoString) {
  //     const employeeNo = event.AccessControllerEvent?.employeeNoString || null;
  //     if (employeeNo) {
  //       try {
  //         const result = await Mijoz.findOne({
  //           where: { id: Number(employeeNo) },
  //           include: [
  //             {
  //               model: Smen
  //             }
  //           ]
  //         })
  //         await new HelpControl().update(result);
  //       } catch (error) {
  //         return res.status(200).send('OK');
  //       }
  //     }
  //   }
  //   return res.status(200).send('OK');
  // }

  async getConrtolApi (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const page = Number(data.page) || 1;
        const limit = Number(data.limit) || 15;
        const offset = (page - 1) * limit;
        const result = await Control.findAll({
          limit: limit,
          offset: offset,
          order: [['id', 'DESC']],
          include: [
            {
              model: Mijoz
            }
          ]
        })
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {      
      return { statusCode: 404, msg: error }
    }
  }

  async exportExcelCon (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const result = await Control.findAll({
          where: {adminId: Number(token.id)}
        })
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {      
      return { statusCode: 404, msg: error }
    }
  }

  async exportExcel (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const mijoz = await Mijoz.findAll({ 
          where: {adminId: Number(token.id)},
          include: [
            {
              model: Smen
            }
          ]
        })
        const jsonResult = mijoz.map(r => r.toJSON());
        return mijoz ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async exportExcelDash (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const option = new HelpControl().option(data, token)
        const result = await Analiz.findAll({...option})
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async getAllApi (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const option = new HelpControl().option(data, token)
        const { today } = new HelpControl().dateTime()
        const mijoz = await Mijoz.findAll({ where: {adminId: Number(token.id)}})
        const analiz = await Analiz.findAll({...option})
        const control = await Control.findAll({where: {adminId: Number(token.id)}})
        const kelmagan = await Mijoz.findAll({ 
          where: {adminId: Number(token.id), 
          [Op.or]: [
            { date: { [Op.ne]: String(today)} },
            { date: null }
            ]
          }
        })
        return {statusCode: 200, items: {
          mijoz: mijoz.length,
          analiz: analiz.length,
          control: control.length,
          kelmagan: kelmagan.length
        }}
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {      
      return { statusCode: 404, msg: error }
    }
  }

  async getAnalizApi (data) {
    try {
      const token = verifyToken(data)      
      if (token && token.statusCode === 200) {
        const option = new HelpControl().option(data, token)
        const page = Number(data.page2) || 1;
        const limit = Number(data.limit2) || 15;
        const offset = (page - 1) * limit;
        const result = await Analiz.findAll({
          ...option,
          limit: limit,
          offset: offset,
          order: [['id', 'DESC']],
          include: [
            {
              model: Mijoz
            }
          ]
        })
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async exportExcelKelma (data) {
     try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const { today } = new HelpControl().dateTime()
        const result = await Mijoz.findAll({
          where: {
            adminId:  Number(token.id),
            [Op.or]: [
              { date: { [Op.ne]: String(today)} },
              { date: null }
            ]
          },
          include: [
            {
              model: Smen
            }
          ]
        })
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async getMijozApi (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const { today } = new HelpControl().dateTime()
        const result = await Mijoz.findAll({
          where: {
            adminId:  Number(token.id),
            [Op.or]: [
              { date: { [Op.ne]: String(today)} },
              { date: null }
            ]
          },
          include: [
            {
              model: Smen
            }
          ]
        })
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }
  
  async getUserApi (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const page = Number(data.page) || 1;
        const limit = Number(data.limit) || 15;
        const offset = (page - 1) * limit;
        const result = await Mijoz.findAll({
          where: {
            adminId:  Number(token.id),
            [Op.or]: [
              { ism: { [Op.like]: `%${data.search}%` } },
              { fam: { [Op.like]: `%${data.search}%` } },
              { shar: { [Op.like]: `%${data.search}%` } },
            ]
          },
          limit: limit,
          offset: offset,
          order: [['id', 'DESC']],
          include: [
            {
              model: Smen
            }
          ]
        })
        const jsonResult = result.map(r => r.toJSON());
        return result ? {statusCode: 200, items: jsonResult} : {statusCode: 404};
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async createUser(data) {
    try {
      const token = verifyToken(data);
      if (!(token && token.statusCode === 200)) {
        return { statusCode: 404 };
      }      
      const result = await Mijoz.create({
        ism: data.ism,
        fam: data.fam,
        shar: data.shar,
        smenId: Number(data.smen),
        adminId: token.id,
      });
      return result ? { statusCode: 200, items: result } : { statusCode: 404 };
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async updateUser(data) {
    try {
      const token = verifyToken(data);
      if (!(token && token.statusCode === 200)) {
        return { statusCode: 404 };
      }
      const result = await Mijoz.update(
        {
          ism: data.ism,
          fam: data.fam,
          shar: data.shar,
          smenId: Number(data.smen),
          adminId: token.id,
        },
        { where: { id: Number(data.id) } }
      );
      return result ? { statusCode: 200, items: {
        dataValues: {
          id: Number(data.id)
        }
      } } : { statusCode: 404 };
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async deleteUser (data) {
    const uploadDir = path.join(__dirname, "../../uploads");
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {
        const oldUser = await Mijoz.findOne({ where: { id: Number(data.id) } });
        if (!oldUser) {
          return { statusCode: 404 };
        }
        if (oldUser.rasm) {
          const oldPath = path.join(uploadDir, oldUser.rasm);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        await oldUser.destroy()
        return { statusCode: 200 };
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }

  async conrtolDelete (data) {
    try {
      const token = verifyToken(data)
      if (token && token.statusCode === 200) {        
        await Control.destroy({where: {id: Number(data.id)}})
        return { statusCode: 200 };
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 404, msg: error }
    }
  }
}
module.exports = new UserController();