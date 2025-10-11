const { Router } = require('express');
const Hikvision = require('../controllers/Hikvision');
const multer = require('multer');
const route = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get('/get', Hikvision.get);
route.post('/capabilities', Hikvision.capabilities); // 1
route.post('/getUsers', Hikvision.getUsers);
route.post('/intervalTime', Hikvision.intervalTime); // 1
route.post('/photos', Hikvision.getPhotos);
route.post('/getfaceID', Hikvision.getFaceID);
route.post('/updateUserDevice', Hikvision.updateUser); // 1
route.post('/deleteUserDevice', Hikvision.deleteUser); // 1
route.post('/deleteAllUserDevice', Hikvision.deleteAllUserDevice); // 1
route.post('/uplode_img', upload.single('image'), Hikvision.Uplode_img); // 1
route.post('/update_img', upload.single('image'), Hikvision.Update_img); // 1

route.post('/event', upload.any(), Hikvision.event);

module.exports = route;