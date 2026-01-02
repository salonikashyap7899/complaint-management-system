# Windows Build Files Index

यह document सभी Windows build related files की list है।

---

## 📚 Documentation Files

### 1. `WINDOWS-BUILD-GUIDE.md` ⭐ (Main Guide)
- **क्या है:** Complete detailed guide
- **कब use करें:** जब आप step-by-step instructions चाहते हों
- **क्या मिलेगा:**
  - Requirements
  - Step-by-step instructions
  - Troubleshooting
  - Distribution guide
  - Advanced options

### 2. `WINDOWS-QUICK-START.md` ⚡ (Quick Reference)
- **क्या है:** Quick start guide
- **कब use करें:** जब आप fast track चाहते हों
- **क्या मिलेगा:**
  - Fastest method
  - Quick commands
  - File locations

---

## 🔧 Automation Scripts

### 3. `build-on-windows.bat` 🪟 (Batch Script)
- **क्या है:** Windows Batch file
- **कैसे use करें:** Double-click करें या Command Prompt में run करें
- **क्या करेगा:**
  - Node.js check करेगा
  - Dependencies install करेगा
  - Next.js build करेगा
  - .exe file बनाएगा
  - Success message दिखाएगा

**Usage:**
```cmd
build-on-windows.bat
```

### 4. `build-on-windows.ps1` 💻 (PowerShell Script)
- **क्या है:** PowerShell script (more modern)
- **कैसे use करें:** PowerShell में run करें
- **क्या करेगा:** Batch file जैसा ही, लेकिन better error handling के साथ

**Usage:**
```powershell
.\build-on-windows.ps1
```

---

## 🎯 कौन सा File कब Use करें?

### पहली बार Build कर रहे हैं?
👉 **`WINDOWS-BUILD-GUIDE.md`** पढ़ें

### Fast Track चाहिए?
👉 **`build-on-windows.bat`** को double-click करें

### PowerShell Prefer करते हैं?
👉 **`build-on-windows.ps1`** run करें

### Quick Reference चाहिए?
👉 **`WINDOWS-QUICK-START.md`** देखें

---

## 📋 Complete Workflow

### Windows Machine पर:

1. **Project Copy करें**
   - Project folder को Windows पर copy करें

2. **Node.js Install करें**
   - https://nodejs.org/ से download करें
   - Install करें

3. **Build Script Run करें**
   - `build-on-windows.bat` को double-click करें
   - या PowerShell में `.\build-on-windows.ps1` run करें

4. **.exe File लें**
   - `dist` folder में `.exe` file मिलेगी

---

## 🔍 File Locations

```
saloni_project/
├── build-on-windows.bat          ← Windows Batch Script
├── build-on-windows.ps1           ← PowerShell Script
├── WINDOWS-BUILD-GUIDE.md         ← Detailed Guide
├── WINDOWS-QUICK-START.md         ← Quick Reference
└── WINDOWS-BUILD-INDEX.md         ← This File
```

---

## ✅ Checklist

Windows पर build करने से पहले:

- [ ] Project folder Windows पर copy हो गया
- [ ] Node.js installed है
- [ ] Internet connection है
- [ ] `build-on-windows.bat` file project folder में है
- [ ] `.env.local` file बनानी है (MongoDB connection के लिए)

---

## 🆘 Help

अगर कोई problem आए:

1. **`WINDOWS-BUILD-GUIDE.md`** में Troubleshooting section देखें
2. Error messages carefully read करें
3. Scripts automatically helpful messages दिखाती हैं

---

## 🎉 Success!

अगर सब कुछ सही से हुआ:

- ✅ `.exe` file `dist` folder में मिलेगी
- ✅ Installer: `dist\Complaint Management System Setup 0.1.0.exe`
- ✅ Portable: `dist\win-unpacked\Complaint Management System.exe`

**Happy Building! 🚀**

