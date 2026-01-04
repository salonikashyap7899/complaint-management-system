function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = "http://localhost:3000";

  mainWindow.loadURL(startUrl);

  // ✅ VERY IMPORTANT
  mainWindow.webContents.once("did-finish-load", () => {
    mainWindow.show();
  });

  // ✅ SHOW ERRORS IF ANY
  mainWindow.webContents.on("did-fail-load", (_, errorCode, errorDesc) => {
    console.error("Failed to load:", errorCode, errorDesc);
  });

  // OPTIONAL (DEV ONLY)
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
