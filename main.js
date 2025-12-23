const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const multer = require("multer");

const AdminController = require(path.join(__dirname, "App", "controllers", "AdminController"));
const { verifyToken } = require(path.join(__dirname, "App", "Middleware", "Auth"));
const Apikey = require(path.join(__dirname, "App", "controllers", "Apikey"));
const DeviceController = require(path.join(__dirname, "App", "controllers", "DeviceController"));
const SmenController = require(path.join(__dirname, "App", "controllers", "SmenController"));
const UserController = require(path.join(__dirname, "App", "controllers", "UserController"));
const upload = multer();
const express = require("express");
const cors = require("cors");
const route = require(path.join(__dirname, "App", "Routes", "route"));
// ------------------- Express server -------------------
const api = express();
api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

// Event route
api.post("/event", upload.any(), UserController.Event);
api.use(route);

// const PORT = 8989;
// const HOST = 8989;
// api.listen(PORT, () => {
//   console.log(`✅ Express server running on http://localhost:${PORT}`);
// });
const POST = 8989;
const HOST = "0.0.0.0";
api.listen(POST, HOST);


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    frame: true,
    icon: path.join(__dirname, "id.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "App", "Pages", "home.html"));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ------------------- IPC handlers -------------------
// Admin
ipcMain.handle("login", (_, data) => AdminController.create(data));
ipcMain.handle("getProfilApi", (_, data) => AdminController.getProfilApi(data));
ipcMain.handle("setTimeApi", (_, data) => AdminController.setTimeApi(data));
ipcMain.handle("updateProfile", (_, data) => AdminController.updateProfile(data));
ipcMain.handle("deleteProfile", (_, data) => AdminController.deleteProfile(data));

// API Keys
ipcMain.handle("setusername", (_, data) => Apikey.setusername(data));
ipcMain.handle("apiKeyKl", (_, data) => Apikey.apiKeyKl(data));
ipcMain.handle("verify", (_, data) => verifyToken(data));

// Devices
ipcMain.handle("getDeviceApi", (_, data) => DeviceController.getDeviceApi(data));
ipcMain.handle("createDevice", (_, data) => DeviceController.createDevice(data));
ipcMain.handle("updateDevice", (_, data) => DeviceController.updateDevice(data));
ipcMain.handle("deleteDevice", (_, data) => DeviceController.deleteDevice(data));

// Smen
ipcMain.handle("getSmenApi", (_, data) => SmenController.getSmenApi(data));
ipcMain.handle("createSmen", (_, data) => SmenController.createSmen(data));
ipcMain.handle("updateSmen", (_, data) => SmenController.updateSmen(data));
ipcMain.handle("deleteSmen", (_, data) => SmenController.deleteSmen(data));

// Users
ipcMain.handle("getConrtolApi", (_, data) => UserController.getConrtolApi(data));
ipcMain.handle("getAllApi", (_, data) => UserController.getAllApi(data));
ipcMain.handle("exportExcel", (_, data) => UserController.exportExcel(data));
ipcMain.handle("exportExcelDash", (_, data) => UserController.exportExcelDash(data));
ipcMain.handle("exportExcelCon", (_, data) => UserController.exportExcelCon(data));
ipcMain.handle("exportExcelKelma", (_, data) => UserController.exportExcelKelma(data));
ipcMain.handle("getAnalizApi", (_, data) => UserController.getAnalizApi(data));
ipcMain.handle("getUserApi", (_, data) => UserController.getUserApi(data));
ipcMain.handle("getMijozApi", (_, data) => UserController.getMijozApi(data));
ipcMain.handle("createUser", (_, data) => UserController.createUser(data));
ipcMain.handle("updateUser", (_, data) => UserController.updateUser(data));
ipcMain.handle("deleteUser", (_, data) => UserController.deleteUser(data));
ipcMain.handle("conrtolDelete", (_, data) => UserController.conrtolDelete(data));

