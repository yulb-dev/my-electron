const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Menu,
  MenuItem,
  globalShortcut,
} = require("electron")
const path = require("path")

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  win.webContents.on("select-bluetooth-device", (event, deviceList, callback) => {
    event.preventDefault()
    if (deviceList && deviceList.length > 0) {
      callback(deviceList[0].deviceId)
    }
  })

  win.loadFile("index.html")

  win.webContents.openDevTools()

  // 拦截快捷键
  win.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.key.toLowerCase() === "i") {
      console.log("Pressed Control+I")
      event.preventDefault()
    }
  })

  win.webContents.session.on("select-hid-device", (event, details, callback) => {
    event.preventDefault()
    if (details.deviceList && details.deviceList.length > 0) {
      callback(details.deviceList[0].deviceId)
    }
  })

  win.webContents.session.on("hid-device-added", (event, device) => {
    console.log("hid-device-added FIRED WITH", device)
  })

  win.webContents.session.on("hid-device-removed", (event, device) => {
    console.log("hid-device-removed FIRED WITH", device)
  })

  win.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "hid" && details.securityOrigin === "file:///") {
        return true
      }
    }
  )

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "hid" && details.origin === "file://") {
      return true
    }
  })

  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light"
    } else {
      nativeTheme.themeSource = "dark"
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system"
  })
}

const menu = new Menu()
menu.append(
  new MenuItem({
    label: "Electron",
    submenu: [
      {
        role: "help",
        accelerator: process.platform === "darwin" ? "Alt+Cmd+I" : "Alt+Shift+I",
        click: () => {
          console.log("Electron rocks!")
        },
      },
    ],
  })
)

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
  // 全局快捷键
  globalShortcut.register("Alt+CommandOrControl+I", () => {
    console.log("Electron loves global shortcuts!")
  })

  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
