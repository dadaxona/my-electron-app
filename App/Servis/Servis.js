const Help = require("./Help");
const FormData = require('form-data');
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); 
const { Mijoz } = require('../../models/index.js');

class Servis extends Help {
    constructor (option) {
        super(option);
        this.option = option;
        this.auth = this.basicAuth();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async capabilities () {
        const random = this.randoms();
        const timeStamp = this.timeStamp();
        // 1-bosqich
        try {
            const oneStep = await this.apiGET(`https://${this.option.ip}/ISAPI/Security/sessionLogin/capabilities?username=${this.option.username}&random=${random}`, this.auth);
            const resultXml = await this.opentXml(oneStep.data);
            // hash algoritimi
            const cap = resultXml.SessionLoginCap;
            const resultHash = this.hashPassword (cap.salt, cap.challenge, cap.iterations);
            // 1-bosqich xmlni ochish
            const readyXml = this.createXml(resultHash, cap.sessionID, cap.sessionIDVersion);
            // 2-bosqich
            const twoStep = await this.apiPOST(`https://${this.option.ip}/ISAPI/Security/sessionLogin?timeStamp=${timeStamp}`, readyXml, this.auth);
            // 2-bosqich xmlni ochish
            const resultXml2 = await this.opentXml(twoStep.data);
            // 2-bosqich cookieni ochish
            const [WebSession_34B6851DDD] = twoStep.headers['set-cookie'][0].split(';');
            // 3-bosqich
            // const freeStep = await this.apiGETAuth(`https://${this.option.ip}/ISAPI/Security/capabilities?username=${this.option.username}`, WebSession_34B6851DDD, resultXml2.SessionLogin.sessionTag, this.auth);
            // 3-bosqich xmlni ochish
            // const resultXml3 = await this.opentXml(freeStep.data);
            return { statusCode: 200, items: {
                // sessionId: cap,
                sessionTags: resultXml2.SessionLogin.sessionTag,
                cookie: WebSession_34B6851DDD,
                // finallyXml: resultXml3.SecurityCap
            }}
        } catch (error) {
            return { statusCode: 404 }
        }
    }

    getTodayTimeRange() {
        const now = new Date();
        const offset = '+05:00';
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const startTime = `${year}-${month}-${day}T00:00:00${offset}`;
        const endTime = `${year}-${month}-${day}T23:59:59${offset}`;
        return { startTime, endTime };
    }

    async users () {
        try {
            const usersData = await this.getUsers(`https://${this.option.ip}/ISAPI/AccessControl/UserInfo/Search?format=json`, this.auth);
            const image = usersData.data.UserInfoSearch.UserInfo;
            for (let i = 0; i < image.length; i++) {
                if (image[i].faceURL) {
                    const respons = await this.getImage(image[i].faceURL, this.auth);
                    const base64 = Buffer.from(respons.data).toString('base64');  
                    image[i].faceURL = base64;
                }
            }
            return { statusCode: 200, items: image }
        } catch (error) {
            return { statusCode: 404 };
        }
    }
    
    async deleteUser () {
        const data = {
            UserInfoDetail: {
            mode: "byEmployeeNo",
            EmployeeNoList: [
                { employeeNo: String(this.option.employeeNo) }
            ]
            }
        };
        const respon = await this.deleteUserDevice(`https://${this.option.ip}/ISAPI/AccessControl/UserInfoDetail/Delete?format=json`, this.auth, data);
        return respon && respon.data.statusCode === 1 && respon.data.statusString === 'OK' ? { statusCode: 200 } : { statusCode: 404 };
    }

    async deleteAllUser () {        
        try {
            for (let i = 0; i < this.option.alluser.length; i++) {
                let data = {
                    UserInfoDetail: {
                        mode: "byEmployeeNo",
                        EmployeeNoList: [
                            { employeeNo: String(this.option.alluser[i].id) }
                        ]
                    }
                };
                await this.deleteUserDevice(`https://${this.option.ip}/ISAPI/AccessControl/UserInfoDetail/Delete?format=json`, this.auth, data);
                await this.sleep(300);
            }
            return { statusCode: 200 };
        } catch (error) {
            return { statusCode: 404 };
        }
    }

    async intervalTime () {
        try {
            // sessiya vaqti interval time.            
            const respons = await this.apiPUT(`https://${this.option.ip}/ISAPI/Security/sessionHeartbeat`, this.auth);
            // xmlni ochish
            const resultXml3 = await this.opentXml(respons.data);
            return resultXml3 ? { statusCode: 200 } : { statusCode: 404 }
        } catch (error) {
            return { statusCode: 404 }
        }
    }

    async getPhotos () {
        // Rasimlarni olish.
        try {
            const respons = await this.getImage(this.option.images, this.auth);
            const base64 = Buffer.from(respons.data).toString('base64');
            return base64 ? { statusCode: 200, items: base64 } : { statusCode: 404 }
        } catch (error) {
            throw new Error(`Qurilmaga yuborishda xatolik: ${error.message}`);
        }
    }
    
    async getFaceID () {
        try {
            const respons = await this.getFaceIDphoto(`https://${this.option.ip}/ISAPI/AccessControl/CaptureFaceData`, this.auth);
            if (!respons) {
                return { statusCode: 404 }
            }
            const utf8data = Buffer.from(respons.data).toString('utf8');
            const resultXml3 = await this.opentXml(utf8data);
            if (!resultXml3 && !resultXml3.CaptureFaceData && !resultXml3.CaptureFaceData.faceDataUrl) {
                return { statusCode: 404 }
            }
            const respon = await this.getImage(resultXml3.CaptureFaceData.faceDataUrl, this.auth);
            const base64 = Buffer.from(respon.data).toString('base64');
            return base64 ? { statusCode: 200, items: base64 } : { statusCode: 404 }
        } catch (error) {
            throw new Error(`Qurilmaga yuborishda xatolik: ${error.message}`);
        }
    }

    formatLocal(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
    }

    async sendToDevice() {        
        const beginTime = this.formatLocal(new Date(2025, 7, 9, 0, 0, 0));
        const endTime = this.formatLocal(new Date(2035, 7, 9, 23, 59, 59)); 
        try {
            const data = {
                UserInfo: {
                    employeeNo: this.option.employeeNo,
                    name: this.option.name,
                    userType: "normal",
                    Valid: {
                        enable: true,
                        beginTime,
                        endTime,
                        timeType: "local"
                    },
                    RightPlan: [
                        { doorNo: 1, planTemplateNo: "1" }
                    ],
                    doorRight: "1",
                    gender: "male",
                    localUIRight: false,
                    groupId: 1,
                    userLevel: "Employee",
                    floorNumbers: [],
                    callNumbers: [],
                    closeDelayEnabled: false,
                    onlyVerify: false
                }
            };
            const respon1 = await this.registerUser(`https://${this.option.ip}/ISAPI/AccessControl/UserInfo/Record?format=json`, this.auth, data);
            return respon1 && respon1.data.statusCode === 1 && respon1.data.statusString === 'OK' ? { statusCode: 200 } : { statusCode: 404 };
        } catch (error) {
            return { statusCode: 404 }
        }
    }

    async updateUser () {        
        const beginTime = this.formatLocal(new Date(2025, 7, 9, 0, 0, 0));
        const endTime = this.formatLocal(new Date(2035, 7, 9, 23, 59, 59)); 
        const userData = {
            UserInfo: {
                employeeNo: this.option.employeeNo,
                name: this.option.name,
                userType: "normal",
                Valid: {
                    enable: true,
                    beginTime,
                    endTime,
                    timeType: "local"
                },
                RightPlan: [
                { doorNo: 1, planTemplateNo: "1" }
                ],
                doorRight: "1",
                gender: "male",
                localUIRight: false,
                userVerifyMode: "",
                groupId: 1,
                userLevel: "Employee",
                floorNumbers: [],
                callNumbers: [],
                password: "",
                closeDelayEnabled: false,
                onlyVerify: false
            }
        };
        const respon = await this.updateUserDevice(`https://${this.option.ip}/ISAPI/AccessControl/UserInfo/Modify?format=json`, this.auth, userData);
        return respon && respon.data.statusCode === 1 && respon.data.statusString === 'OK' ? { statusCode: 200 } : { statusCode: 404 };
    }

    async uplodePhoto (file) {
        const uploadDir = path.join(__dirname, "../../uploads");

        // katalog bo'lmasa, yaratib qo'yamiz
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Eski rasmni bazadan olib kelamiz
        const mijoz = await Mijoz.findOne({
            where: { id: Number(this.option.employeeNo) }
        });

        if (mijoz && mijoz.rasm) {
            const oldPath = path.join(uploadDir, mijoz.rasm);
            if (fs.existsSync(oldPath)) {
                try {
                    fs.unlinkSync(oldPath); // eski faylni o'chirish
                    console.log("Eski rasm o'chirildi:", oldPath);
                } catch (err) {
                    console.error("Eski rasmni o‘chirishda xato:", err);
                }
            }
        }

        // Yangi faylni saqlaymiz
        const uniqueName = `${uuidv4()}.jpg`;
        const savePath = path.join(uploadDir, uniqueName);
        fs.writeFileSync(savePath, file);

        await Mijoz.update(
            { rasm: uniqueName },
            { where: { id: Number(this.option.employeeNo) } }
        );
    }

    async uplodeImgDevice (optimizedBuffer) {
        try {
            const formData2 = new FormData();
            formData2.append(
                'FaceDataRecord',
                Buffer.from(JSON.stringify({
                    faceLibType: 'blackFD',
                    FDID: '1',
                    FPID: String(this.option.employeeNo)
                })),
                { filename: 'FaceDataRecord', contentType: 'application/json' }
            );
            formData2.append('FaceImage', optimizedBuffer, {
                filename: 'face.jpg',
                contentType: 'image/jpeg'
            });
            const respon2 = await this.Uplode_Image(`https://${this.option.ip}/ISAPI/Intelligent/FDLib/FDSetUp?format=json`, this.auth, formData2);            
            return respon2 && respon2.data.statusCode === 1 && respon2.data.statusString === 'OK'
                ? { statusCode: 200 }
                : { statusCode: 404 };
        } catch (error) {
            console.log(error);
            return { statusCode: 404 };
        }
    }

    async findUser () {
        const data = {
            UserInfoSearchCond: {
                searchID: "1",
                searchResultPosition: 0,
                maxResults: 1,
                EmployeeNoList: [
                    { employeeNo: this.option.employeeNo }
                ]
            }
        };

        try {
            const res = await this.findUserData(`https://${this.option.ip}/ISAPI/AccessControl/UserInfo/Search?format=json`, this.auth, data)
            console.log(res.data.UserInfoSearch.UserInfo[0].faceURL);
            if (res && res.data.UserInfoSearch) {
                return await this.getImg(res.data.UserInfoSearch.UserInfo[0].faceURL);
            }
        } catch (err) {
            console.error("Xatolik:", err.message);
        }
    }

    async getImg (faceURL) {
        try {
            const respon = await this.getImage(faceURL, this.auth);
            const base64 = Buffer.from(respon.data).toString('base64');
            console.log(base64);
            
            // return base64 ? { statusCode: 200, items: base64 } : { statusCode: 404 }
        } catch (error) {
            throw new Error(`Qurilmaga yuborishda xatolik: ${error.message}`);
        }
    }
}
module.exports = Servis;