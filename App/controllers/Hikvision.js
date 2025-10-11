const Servis = require("../Servis/Servis");
class Hikvision {
    async get (req, res) {
        return res.json({keldi: 'data'})
    }

    async capabilities (req, res) {
        const { deviceData } = req.body;
        let arr = []
        for (let i = 0; i < deviceData.length; i++) {
            const result = await new Servis(deviceData[i]).capabilities();
            if (result.statusCode === 200) {
                arr.push({
                   sessionTag: result.items.sessionTags,
                   cookie: result.items.cookie,
                })
            } else {
                return res.json({statusCode: 404})
            }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        return res.json({statusCode: 200, items: arr});
    }

    async getUsers (req, res) {
        const result = await new Servis(req.body).users();
        return res.json(result);
    }

    async intervalTime (req, res) {
        let statusCode = '';
        const {deviceData, deviceRespons} = req.body;
        for (let i = 0; i < deviceData.length; i++) {            
            const result = await new Servis({...deviceData[i], ...deviceRespons[i]}).intervalTime();
            if (result && result.statusCode === 200) {
                statusCode = 200
            } else {
               return res.json({statusCode: 404})
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return res.json({statusCode});
    }

    async getPhotos (req, res) {
        const result = await new Servis(req.body).getPhotos();
        return res.json(result);
    }

    async getFaceID (req, res) {
        const result = await new Servis(req.body).getFaceID();
        return res.json(result);
    }

    async deleteUser (req, res) {
        let statusCode = '';
        const {employeeNo, deviceData, deviceRespons} = req.body;
        for (let i = 0; i < deviceData.length; i++) {            
            const result = await new Servis({employeeNo, ...deviceData[i], ...deviceRespons[i]}).deleteUser();
            if (result && result.statusCode === 200) {
                statusCode = 200
            } else {
               return res.json({statusCode: 404})
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return res.json({statusCode});
    }

    async deleteAllUserDevice (req, res) {
        let statusCode = '';
        const {alluser, deviceData, deviceRespons} = req.body;
        for (let i = 0; i < deviceData.length; i++) {            
            const result = await new Servis({alluser, ...deviceData[i], ...deviceRespons[i]}).deleteAllUser();
            if (result && result.statusCode === 200) {
                statusCode = 200
            } else {
               return res.json({statusCode: 404})
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return res.json({statusCode});
    }

    async updateUser (req, res) {
        let statusCode = '';
        const { employeeNo, name, deviceData, deviceRespons } = req.body;
        for (let i = 0; i < deviceData.length; i++) {
            const result = await new Servis({employeeNo, name, ...deviceData[i], ...deviceRespons[i]}).updateUser();
            if (result.statusCode === 200) {
                statusCode = 200
            } else {
                return res.json({statusCode: 404});
            }
        }
        return res.json({statusCode});
    }

    async Uplode_img (req, res) {
        const { employeeNo, name, deviceData, deviceRespons } = req.body;
        const deviceDatas = JSON.parse(deviceData)
        const deviceResponses = JSON.parse(deviceRespons)
        const file = req.file;
        if (employeeNo && name && file) {
            let statusCode = '';
            const optimizedBuffer = await new Servis({employeeNo, name}).imgSize(file.buffer);
            await new Servis({employeeNo, name}).uplodePhoto(optimizedBuffer);
            for (let i = 0; i < deviceDatas.length; i++) {
                const result = await new Servis({employeeNo, name, ...deviceDatas[i], ...deviceResponses[i]}).sendToDevice();
                if (result.statusCode === 200) {
                    const result = await new Servis({employeeNo, name, ...deviceDatas[i], ...deviceResponses[i]}).uplodeImgDevice(optimizedBuffer);
                    if (result.statusCode === 200) {
                        statusCode = 200
                    } else {
                        return res.json({statusCode: 404});
                    }
                } else {
                    return res.json({statusCode: 404});
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return res.json({statusCode});
        } else {
            let statusCode = '';
            for (let i = 0; i < deviceDatas.length; i++) {
                const result = await new Servis({employeeNo, name, ...deviceDatas[i], ...deviceResponses[i]}).sendToDevice();
                if (result.statusCode === 200) {
                    statusCode = 200
                } else {
                    return res.json({statusCode: 404});
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return res.json({statusCode});
        }
    }

    async Update_img (req, res) {
        const { employeeNo, name, deviceData, deviceRespons } = req.body;
        const deviceDatas = JSON.parse(deviceData)
        const deviceResponses = JSON.parse(deviceRespons)
        const file = req.file;
        if (employeeNo && name && file) {
            let statusCode = '';
            const optimizedBuffer = await new Servis({employeeNo, name}).imgSize(file.buffer);
            await new Servis({employeeNo, name}).uplodePhoto(optimizedBuffer);
            for (let i = 0; i < deviceDatas.length; i++) {
                const result = await new Servis({employeeNo, name, ...deviceDatas[i], ...deviceResponses[i]}).updateUser();
                if (result.statusCode === 200) {
                    const result = await new Servis({employeeNo, name, ...deviceDatas[i], ...deviceResponses[i]}).uplodeImgDevice(optimizedBuffer);
                    if (result.statusCode === 200) {
                        statusCode = 200
                    } else {
                        return res.json({statusCode: 404});
                    }
                } else {
                    return res.json({statusCode: 404});
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return res.json({statusCode});
        } else {
            let statusCode = '';
            for (let i = 0; i < deviceDatas.length; i++) {
                const result = await new Servis({employeeNo, name, ...deviceDatas[i], ...deviceResponses[i]}).updateUser();
                if (result.statusCode === 200) {
                    statusCode = 200
                } else {
                    return res.json({statusCode: 404});
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return res.json({statusCode});
        }
    }

    async event (req, res) {
        if (req.body.AccessControllerEvent) {
            try {
                const data = JSON.parse(req.body.AccessControllerEvent);
                const event = data.AccessControllerEvent;
                if (event?.employeeNoString) {
                    console.log('✅ Employe:', event.employeeNoString);
                }
            } catch (err) {
                console.error('JSON parse error:', err.message);
            }
        }
        res.status(200).send('OK');
    }
}

module.exports = new Hikvision;