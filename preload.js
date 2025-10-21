// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('🌉 [PRELOAD] ตั้งค่า security bridge');

const api = {
  // ส่งข้อความทั่วไป
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),

  // ทักทาย
  sayHello: (name) => ipcRenderer.invoke('say-hello', name),

  // Agent wallboard
  getAgents: () => ipcRenderer.invoke('get-agents'),
  changeAgentStatus: (agentId, newStatus) =>
    ipcRenderer.invoke('change-agent-status', { agentId, newStatus }),
};

// ✅ expose แค่ครั้งเดียว
contextBridge.exposeInMainWorld('electronAPI', api);

console.log('✅ [PRELOAD] Security bridge พร้อมแล้ว');
