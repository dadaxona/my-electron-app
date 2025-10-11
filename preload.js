const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setTimeApi: (data) => ipcRenderer.invoke('setTimeApi', data),
  verifyToken: (data) => ipcRenderer.invoke('verify', data),
  apiKeyKl: (data) => ipcRenderer.invoke('apiKeyKl', data),
  login: (username, password) => ipcRenderer.invoke('login', { username, password }),
  updateProfile: (data) => ipcRenderer.invoke('updateProfile', data),
  setusername: (data) => ipcRenderer.invoke('setusername', data),
  getProfilApi: (data) => ipcRenderer.invoke('getProfilApi', data),
  deleteProfile: (data) => ipcRenderer.invoke('deleteProfile', data),

  getDeviceApi: (data) => ipcRenderer.invoke('getDeviceApi', data),
  createDevice: (data) => ipcRenderer.invoke('createDevice', data),
  updateDevice: (data) => ipcRenderer.invoke('updateDevice', data),
  deleteDevice: (data) => ipcRenderer.invoke('deleteDevice', data),

  getSmenApi: (data) => ipcRenderer.invoke('getSmenApi', data),
  createSmen: (data) => ipcRenderer.invoke('createSmen', data),
  updateSmen: (data) => ipcRenderer.invoke('updateSmen', data),
  deleteSmen: (data) => ipcRenderer.invoke('deleteSmen', data),

  getConrtolApi: (data) => ipcRenderer.invoke('getConrtolApi', data),
  getAllApi: (data) => ipcRenderer.invoke('getAllApi', data),
  exportExcel: (data) => ipcRenderer.invoke('exportExcel', data),
  exportExcelDash: (data) => ipcRenderer.invoke('exportExcelDash', data),
  exportExcelCon: (data) => ipcRenderer.invoke('exportExcelCon', data),
  exportExcelKelma: (data) => ipcRenderer.invoke('exportExcelKelma', data),
  getAnalizApi: (data) => ipcRenderer.invoke('getAnalizApi', data),
  getUserApi: (data) => ipcRenderer.invoke('getUserApi', data),
  getMijozApi: (data) => ipcRenderer.invoke('getMijozApi', data),
  createUser: (data) => ipcRenderer.invoke('createUser', data),
  updateUser: (data) => ipcRenderer.invoke('updateUser', data),
  deleteUser: (data) => ipcRenderer.invoke('deleteUser', data),
  conrtolDelete: (data) => ipcRenderer.invoke('conrtolDelete', data)
});