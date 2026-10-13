# Electron IPC — Secure Main ↔ Renderer Communication

**An Agent Wallboard desktop prototype showing how an Electron UI talks to the main process safely: a typed `contextBridge` API, request/response IPC, and input validation in the main process.**

![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

> **ENGSE203, Lab 8.2: IPC Communication.** Previous: [8.1 First Electron app](https://github.com/tawan230666/Lab-8.1-Electron.js) · Next: [8.3 Native APIs](https://github.com/tawan230666/Lab-8.3-Native-APIs-System-Integration).
>
> ▶️ [Watch the demo video](docs/media/lab8-2-demo.mp4)

## How it works

```mermaid
sequenceDiagram
    participant R as Renderer (index.html)
    participant P as preload.js (contextBridge)
    participant M as Main process
    participant F as agent-data.json
    R->>P: window.electronAPI.changeAgentStatus("A001", "Break")
    P->>M: ipcRenderer.invoke("change-agent-status", …)
    M->>M: validate status against allow-list
    M->>F: read · update · write
    M-->>R: { success, agent, message }
```

**Security model**

- The renderer runs with `contextIsolation: true`, `nodeIntegration: false` and `sandbox: true`, so it has no access to Node.js or the file system.
- `preload.js` exposes exactly four functions on `window.electronAPI` and nothing else.
- The main process treats renderer input as untrusted: the agent status is checked against an allow-list before anything is written.
- `ipcMain.handle` / `ipcRenderer.invoke` give promise-based request/response calls with structured `{ success, error }` results.

## Demos

| # | Demo | IPC channel |
|---|---|---|
| 1 | Send a message and receive a JSON reply | `send-message` |
| 2 | Agent greeting with a random welcome message | `say-hello` |
| 3 | Load agents and change their status (persisted to JSON) | `get-agents`, `change-agent-status` |
| 4 | Process information panel | — |

| Send a message | Agent greeting | Load agents | Change status |
|---|---|---|---|
| ![](docs/images/demo1_send.png) | ![](docs/images/demo2_login.png) | ![](docs/images/demo3_load.png) | ![](docs/images/demo3_change.png) |

## Run

```bash
git clone https://github.com/tawan230666/Lab-8.2-IPC-Communication.git
cd Lab-8.2-IPC-Communication
npm install
npm start
```

> The demo video is stored with Git LFS; run `git lfs pull` after cloning to download it.

---

**Author:** Tawan Tiphkun (ธาวัน ทิพคุณ), 67543210033-6, [@tawan230666](https://github.com/tawan230666), Software Engineering, RMUTL Chiang Mai
