# Windows पर Quick Start Guide

## 🚀 सबसे तेज़ तरीका (Fastest Way)

### Step 1: Node.js Install करें
- https://nodejs.org/ से LTS version download करें
- Install करें (Add to PATH check करें)

### Step 2: Project Folder खोलें
- Project folder में जाएं
- `build-on-windows.bat` file को double-click करें

**बस! Script automatically सब कुछ कर देगी!**

---

## 📝 Manual Steps (अगर script काम न करे)

### Command Prompt में:

```cmd
npm install
npm run build
npm run build:exe
```

### PowerShell में:

```powershell
npm install
npm run build
npm run build:exe
```

---

## 📦 .exe File कहाँ मिलेगी?

Build complete होने के बाद:

**Installer:**
```
dist\Complaint Management System Setup 0.1.0.exe
```

**Portable:**
```
dist\win-unpacked\Complaint Management System.exe
```

---

## ⚠️ Important Notes

1. **Internet Connection** जरूरी है (dependencies download के लिए)
2. **MongoDB Connection** setup करें (`.env.local` file में)
3. **Antivirus** temporarily disable करें (अगर build fail हो)
4. **Administrator Rights** use करें (अगर permission error आए)

---

## 🆘 Help चाहिए?

1. `WINDOWS-BUILD-GUIDE.md` file पढ़ें (detailed guide)
2. Error messages carefully read करें
3. Troubleshooting section check करें

---

## ✅ Success!

अगर सब कुछ सही से हुआ, तो आपकी `.exe` file ready है! 🎉

