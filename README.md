# File Manager (Node.js)

## 📄 Description

This is a command-line file manager built using **Node.js (v22+)** and native Node.js APIs. It supports file system navigation, file operations, hashing, compression, and basic OS information display.

The application is implemented in the scope of Node.js course in RS School: [Task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/file-manager/assignment.md)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YuliiaZas/file-manager.git
cd file-manager
```

### 2. Install Node.js (v22.14.0 or higher)
Make sure you're using Node.js version `22.x.x`:
```bash
node -v
```

###3. Run the application
```bash
npm install
npm run start -- --username=YourName
```

---
## 💻 Features
- Navigation: `up`, `cd`, `ls`

- File operations: `cat`, `add`, `rm`, `rn`, `cp`, `mv`, `mkdir`

- OS Info: `os`:  `--EOL`, `--cpus`, `--homedir`, `--username`, `--architecture`

- Hashing: `hash`

- Compression: `compress`, `decompress` using Brotli

- Graceful exit: `.exit` or `Ctrl + C`
  
- Help: `.help` command to display available commands
