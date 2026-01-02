# Windows पर .exe File बनाने की Complete Guide

यह guide आपको Windows machine पर Complaint Management System का `.exe` file बनाने में मदद करेगी।

---

## 📋 Requirements (जरूरी चीजें)

1. **Windows 10 या Windows 11**
2. **Node.js** (version 18 या उससे ऊपर)
3. **Internet Connection** (dependencies download के लिए)
4. **MongoDB Connection String** (application के लिए)

---

## 🚀 Step-by-Step Guide

### Step 1: Node.js Install करें

1. Browser में जाएं: https://nodejs.org/
2. **LTS version** download करें (जैसे: v20.x.x)
3. Downloaded file को run करें
4. Installation के दौरान **"Add to PATH"** option को check करें
5. Installation complete होने के बाद Command Prompt restart करें

**Verify करें:**
```cmd
node --version
npm --version
```

दोनों commands version दिखानी चाहिए।

---

### Step 2: Project को Windows पर Copy करें

1. Project folder को USB drive या cloud storage से Windows machine पर copy करें
2. Project folder को कहीं safe जगह रखें (जैसे: `C:\Projects\saloni_project`)

---

### Step 3: Dependencies Install करें

1. Project folder में जाएं
2. Command Prompt या PowerShell open करें
3. Run करें:

```cmd
npm install
```

यह process 2-5 minutes ले सकती है। सभी packages download हो जाएंगी।

---

### Step 4: Environment File बनाएं

1. Project folder में `.env.local` file बनाएं
2. इसमें अपना MongoDB connection string add करें:

```env
MONGO_URL=mongodb://localhost:27017/complaint_management
```

या MongoDB Atlas के लिए:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/complaint_management?retryWrites=true&w=majority
```

**Note:** `.env.local` file को Git में commit न करें (यह sensitive information है)

---

### Step 5: Next.js Application Build करें

```cmd
npm run build
```

यह process 1-2 minutes ले सकती है। Build successful होने पर आपको success message दिखेगा।

---

### Step 6: .exe File बनाएं

**Option A: Automated Script Use करें (Recommended)**

```cmd
build-on-windows.bat
```

या PowerShell में:

```powershell
.\build-on-windows.ps1
```

**Option B: Manual Command**

```cmd
npm run build:exe
```

यह process 5-10 minutes ले सकती है क्योंकि:
- Electron download होगा (~150 MB)
- Windows tools download होंगे
- Application package होगा

---

### Step 7: .exe File ढूंढें

Build complete होने के बाद, आपकी `.exe` files यहाँ मिलेंगी:

**Installer (Distribution के लिए):**
```
dist\Complaint Management System Setup 0.1.0.exe
```
Size: ~176 MB

**Portable Executable (Direct Run के लिए):**
```
dist\win-unpacked\Complaint Management System.exe
```
Size: ~202 MB

---

## 🎯 Quick Build Scripts

### Method 1: Batch File (build-on-windows.bat)

Double-click करें या Command Prompt में run करें:

```cmd
build-on-windows.bat
```

### Method 2: PowerShell Script (build-on-windows.ps1)

PowerShell में run करें:

```powershell
.\build-on-windows.ps1
```

---

## ⚠️ Troubleshooting (समस्याओं का समाधान)

### Problem 1: "node is not recognized"

**Solution:**
- Node.js properly install नहीं हुआ है
- Command Prompt restart करें
- Node.js को PATH में add करें

### Problem 2: "npm install" fails

**Solution:**
- Internet connection check करें
- Antivirus temporarily disable करें
- Administrator rights के साथ run करें

### Problem 3: Build fails with memory error

**Solution:**
- System में कम से कम 4GB RAM होनी चाहिए
- अन्य applications close करें
- Virtual memory increase करें

### Problem 4: ".exe file not found"

**Solution:**
- `dist` folder check करें
- Build process complete हुई है या नहीं verify करें
- Error messages को carefully read करें

### Problem 5: Application doesn't start

**Solution:**
- MongoDB connection string check करें
- `.env.local` file सही location में है या नहीं
- Windows Firewall settings check करें

---

## 📦 Distribution (दूसरों को देने के लिए)

### Installer File Distribute करें:

1. `dist\Complaint Management System Setup 0.1.0.exe` file को share करें
2. Users को बताएं:
   - File को download करें
   - Double-click करके install करें
   - Application launch होगा

### Portable Version Distribute करें:

1. `dist\win-unpacked` पूरा folder zip करें
2. Users को बताएं:
   - Folder extract करें
   - `Complaint Management System.exe` को run करें
   - No installation needed!

---

## 🔧 Advanced Options

### Custom Icon Add करें:

1. `.ico` format में icon file बनाएं (256x256 recommended)
2. `public/` folder में रखें
3. `electron-builder.yml` में icon path update करें

### Version Number Change करें:

`package.json` में version update करें:
```json
"version": "1.0.0"
```

---

## ✅ Checklist

Build करने से पहले verify करें:

- [ ] Node.js installed है
- [ ] Project folder Windows पर copy हो गया है
- [ ] `npm install` successfully complete हुआ है
- [ ] `.env.local` file बन गई है
- [ ] MongoDB connection string सही है
- [ ] `npm run build` successful है
- [ ] `npm run build:exe` successful है
- [ ] `.exe` file `dist` folder में मिल रही है

---

## 📞 Support

अगर कोई problem आए:

1. Error message को carefully read करें
2. Troubleshooting section check करें
3. Build logs check करें (`dist/builder-debug.yml`)
4. GitHub issues पर question post करें

---

## 🎉 Success!

अगर सब कुछ सही से हुआ है, तो आपकी `.exe` file ready है!

**Next Steps:**
1. `.exe` file को test करें
2. अपने friends/colleagues को share करें
3. Feedback collect करें
4. Improvements करें

**Happy Building! 🚀**

