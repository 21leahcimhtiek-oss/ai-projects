# 🛠️ Tools

A collection of utility scripts and tools for Android device management and Python automation.

## Android Tools

### Android Debloat Helper (`android/android-debloat-helper.py`)
A GUI application built with Tkinter that allows users to:
- Connect to Android devices via ADB
- List all installed packages
- Uninstall selected bloatware packages
- Restore previously uninstalled packages

**Requirements:**
- Python 3.x
- ADB (Android Debug Bridge) installed
- USB debugging enabled on Android device

**Usage:**
```bash
python android/android-debloat-helper.py
```

---

## Python Tools

### `python/original.py`
A Python script demonstrating a basic calculation with a secret key.

### `python/obfuscated.py`
A demonstration of Python code obfuscation using Base64 encoding.

### `python/client.py`
A client script that periodically fetches and executes commands from a remote source.

### `python/server.py`
A server-side script for creating command pastes via the Pastebin API.

### Python Obfuscation Guide (`python/python-obfuscation-guide.pdf`)
A comprehensive guide covering Python code obfuscation techniques including:
- Name mangling
- String encoding
- PyInstaller packaging
- PyArmor protection
- Cython compilation