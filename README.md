# 🔄 Lab 8.2: IPC Communication  
## การสื่อสารระหว่าง Main Process และ Renderer Process

### 🎓 สำหรับนักศึกษาวิศวกรรมซอฟต์แวร์ ปีที่ 2  
**ระยะเวลา:** 1 สัปดาห์

---

## 🎯 วัตถุประสงค์ (Learning Objectives)
เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:
- 🔄 เข้าใจแนวคิด **IPC (Inter-Process Communication)** ใน Electron  
- 🛡️ สร้าง **preload.js** เพื่อเปิดใช้ API ที่ปลอดภัย (contextIsolation)  
- 📤 ใช้ `ipcRenderer.invoke()` ส่งข้อมูลจาก Renderer → Main  
- 📥 ใช้ `ipcMain.handle()` รับ/ประมวลผล และส่งผลกลับไป Renderer  
- 🔧 สร้าง **API ฟังก์ชัน** ของแอป (เช่น โหลด/อัปเดตข้อมูลเอเจนต์)  
- 📊 ประยุกต์ใช้กับ **Agent Wallboard** (โหลดข้อมูล, เปลี่ยนสถานะ ฯลฯ)

---

## ✅ Prerequisites
- พื้นฐาน JavaScript/HTML/CSS  
- ติดตั้ง Node.js + npm  
- ติดตั้ง Electron (devDependency)  

---

## 🗂️ โครงสร้างโปรเจกต์
```
lab8-2-ipc/
├── main.js          # Main Process + IPC handlers
├── preload.js       # Security bridge (contextBridge)
├── index.html       # UI + เรียก window.electronAPI
├── agent-data.json  # ข้อมูลจำลอง agents
└── package.json
```

---

## 🧠 ภาพรวมการทำงาน (IPC Flow)
```
Renderer (UI) ── invoke() ─▶  Preload (bridge) ── invoke() ─▶ Main (handle)
Renderer ◀─ result ───────── Preload ◀─────────── Main (return data)
```
- Renderer เรียก `window.electronAPI.*`  
- Preload ส่งต่อด้วย `ipcRenderer.invoke(channel, payload)`  
- Main ลงทะเบียน `ipcMain.handle(channel, handler)` ประมวลผลแล้วคืนค่า

---

## 🔐 ความปลอดภัยที่ใช้
- `webPreferences: { nodeIntegration: false, contextIsolation: true, preload: ... }`  
- เปิดเฉพาะ API ที่จำเป็นผ่าน `contextBridge.exposeInMainWorld('electronAPI', {...})`  
- (คำเตือน CSP ใน DevTools เป็นเพียง Warning ตอนพัฒนา)

---

## ▶️ วิธีรัน
```bash
npm install
npm start
```

---

## 🧪 สิ่งที่สาธิตในเดโม
- 📤 **ส่งข้อความ** จาก Renderer ไป Main และรับ JSON ตอบกลับ  
- 👋 **ระบบทักทาย** (sayHello) พร้อมเวลา/ชื่อ  
- 📊 **โหลดข้อมูล Agents** จาก `agent-data.json` ผ่าน IPC  
- 🔄 **เปลี่ยนสถานะ Agent** และบันทึกกลับไฟล์ (simulate persistence)

---

## 🎥 เดโมการรัน (Lab 8.2 – IPC)
> นำไฟล์คลิปไว้ในโปรเจกต์ เช่น `docs/media/lab8-2-demo.mp4` แล้วส่วนฝังด้านล่างจะแสดงผลบน GitHub ได้อัตโนมัติ

<video src="./docs/media/lab8-2-demo.mp4" controls width="720"></video>

> ถ้าคลิป > 100MB แนะนำใช้ Git LFS หรือบีบอัดด้วย ffmpeg:  
> `ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset veryfast -acodec aac -b:a 128k docs/media/lab8-2-demo.mp4`

---

## 📑 ตัวอย่าง API ที่เปิดให้ Renderer (preload.js)
- `sendMessage(message)` – ส่งข้อความไป Main  
- `sayHello(name)` – ทักทาย + เวลาปัจจุบัน (th-TH)  
- `getAgents()` – โหลดข้อมูลเอเจนต์จากไฟล์  
- `changeAgentStatus(agentId, newStatus)` – เปลี่ยนสถานะและบันทึก

---

## 🧰 เคล็ดลับ/แก้ปัญหาที่พบบ่อย
- **`getAgents is not a function`** → เช็กว่า preload ได้ **expose** ฟังก์ชันครบ และ **main.js** ชี้ `preload.js` ถูกไฟล์/พาธ  
- **`Cannot bind an API on top of an existing property on the window object`** → อย่าเรียก `exposeInMainWorld('electronAPI', ...)` ซ้ำหลายครั้ง (รวมโค้ด expose ไว้ที่เดียว)  
- **CSP Warning** → เป็นคำเตือนด้านความปลอดภัยตอน Dev (ไม่ส่งผลการทำงาน เบื้องต้นข้ามได้)

---

## 🏁 ผลลัพธ์ที่ได้จาก Lab
- เข้าใจการใช้ **IPC invoke/handle**  
- ใช้ **preload.js** สร้าง bridge ที่ปลอดภัย  
- สร้าง UI ที่เรียกใช้ **API ฝั่ง Main** ได้อย่างเป็นระบบ  
- วางรากฐานสำหรับ **Agent Wallboard** (โหลดข้อมูล/เปลี่ยนสถานะ)

---

## 🚀 Next Steps
- Lab 8.3: เรียก Native APIs / ระบบไฟล์ / Notification  
- Lab 8.4: Real-time (WebSocket) สำหรับสถานะสด  
- Lab 8.5: Build และ Distribution (Windows/macOS/Linux)
