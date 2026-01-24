@echo off
REM AgroConnect - Production Verification Script (Windows)

setlocal enabledelayedexpansion

echo.
echo 🔍 AgroConnect Production Verification
echo.

set BACKEND_URL=http://localhost:5000
set FRONTEND_URL=http://localhost
set TESTS_PASSED=0
set TESTS_FAILED=0

REM Test 1: Backend Health
echo Testing Backend Health...
for /f %%i in ('curl -s -o nul -w "%%{http_code}" %BACKEND_URL%/health 2^>nul') do (
    if "%%i"=="200" (
        echo ✓ Backend Health: OK
        set /a TESTS_PASSED+=1
    ) else (
        echo ✗ Backend Health: Failed (%%i)
        set /a TESTS_FAILED+=1
    )
)

REM Test 2: Backend Root
echo Testing Backend Root...
for /f %%i in ('curl -s -o nul -w "%%{http_code}" %BACKEND_URL%/ 2^>nul') do (
    if "%%i"=="200" (
        echo ✓ Backend Root: OK
        set /a TESTS_PASSED+=1
    ) else (
        echo ✗ Backend Root: Failed (%%i)
        set /a TESTS_FAILED+=1
    )
)

REM Test 3: Frontend
echo Testing Frontend...
for /f %%i in ('curl -s -o nul -w "%%{http_code}" %FRONTEND_URL%/ 2^>nul') do (
    if "%%i"=="200" (
        echo ✓ Frontend: OK
        set /a TESTS_PASSED+=1
    ) else (
        echo ✗ Frontend: Failed (%%i)
        set /a TESTS_FAILED+=1
    )
)

REM Test 4: Environment File
if exist ".env.production" (
    echo ✓ .env.production exists
    set /a TESTS_PASSED+=1
) else (
    echo ✗ .env.production not found
    set /a TESTS_FAILED+=1
)

REM Test 5: Docker
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Docker installed
    set /a TESTS_PASSED+=1
    
    docker ps | find "agroconnect" >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✓ AgroConnect containers running
        set /a TESTS_PASSED+=1
    ) else (
        echo ⚠ AgroConnect containers not found
    )
) else (
    echo ⚠ Docker not installed
)

REM Test 6: File Sizes
if exist "Frontend\dist" (
    echo ✓ Frontend built
    set /a TESTS_PASSED+=1
) else (
    echo ✗ Frontend not built
    set /a TESTS_FAILED+=1
)

echo.
echo ========================================
echo Tests Passed: !TESTS_PASSED!
echo Tests Failed: !TESTS_FAILED!
echo ========================================

if !TESTS_FAILED! equ 0 (
    echo.
    echo ✓ All checks passed! Ready for production.
    echo.
    exit /b 0
) else (
    echo.
    echo ✗ Some checks failed. Review above.
    echo.
    exit /b 1
)

endlocal
