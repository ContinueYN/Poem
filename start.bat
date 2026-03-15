@echo off
chcp 65001 >nul
echo ========================================
echo   诗之古河 - 数字雅集 - 快速启动
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [√] 检测到 Python，正在启动 HTTP 服务器...
    echo.
    echo 访问地址：http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
    goto :end
)

REM 检查 Python3 是否安装
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [√] 检测到 Python3，正在启动 HTTP 服务器...
    echo.
    echo 访问地址：http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    python3 -m http.server 8000
    goto :end
)

echo [×] 未检测到 Python
echo.
echo 请选择以下任一方式启动：
echo.
echo 1. 安装 Python: https://www.python.org/
echo 2. 使用 VS Code Live Server 扩展
echo 3. 使用 Node.js: npm install -g http-server ^&^& http-server -p 8000
echo.
pause

:end
