// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function resolveDataPath(filename) {
  return path.join(app.getAppPath(), filename); // ให้ชี้ถูกทั้ง dev/packaged
}

function registerIpcHandlers() {
  // ===== IPC HANDLERS =====
  ipcMain.handle('send-message', (event, message) => {
    const res = {
      original: message,
      reply: `Server ได้รับ: "${message}"`,
      timestamp: new Date().toISOString(),
      status: 'success',
    };
    return res;
  });

  ipcMain.handle('say-hello', (event, name) => {
    const greetings = [
      `สวัสดี ${name}! ยินดีต้อนรับสู่ Agent Wallboard`,
      `หวัดดี ${name}! วันนี้พร้อมทำงานหรือยัง?`,
      `Hello ${name}! มีความสุขในการทำงานนะ`,
    ];
    return {
      greeting: greetings[Math.floor(Math.random() * greetings.length)],
      name,
      time: new Date().toLocaleString('th-TH'),
      agentCount: 3,
    };
  });

  ipcMain.handle('get-agents', async () => {
    try {
      const dataPath = resolveDataPath('agent-data.json');
      const data = await fs.readFile(dataPath, 'utf8');
      return { success: true, data: JSON.parse(data), timestamp: new Date().toISOString() };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('change-agent-status', async (event, { agentId, newStatus }) => {
    try {
      const dataPath = resolveDataPath('agent-data.json');
      const raw = await fs.readFile(dataPath, 'utf8');
      const db = JSON.parse(raw);
      const agent = db.agents.find(a => a.id === agentId);
      if (!agent) throw new Error(`ไม่พบ agent ID: ${agentId}`);
      agent.status = newStatus;
      agent.lastStatusChange = new Date().toISOString();
      await fs.writeFile(dataPath, JSON.stringify(db, null, 2));
      return { success: true, agent, message: `เปลี่ยนสถานะเป็น ${newStatus} แล้ว` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  console.log('🔧 [MAIN] IPC Handlers พร้อมแล้ว');
}

function createWindow() {
  console.log('🖥️ [MAIN] สร้างหน้าต่าง...');
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // ปิด sandbox เพื่อให้ preload ใช้ได้
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); // เปิดเมื่อดีบั๊ก
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
