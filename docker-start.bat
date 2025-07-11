@echo off

:: Verifica se o Docker está instalado
docker --version >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo "Docker não encontrado. Certifique-se de que o Docker esteja instalado."
    pause
    exit /b
)

:: Verifica se o Docker Compose está instalado
docker-compose --version >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo "Docker Compose não encontrado. Certifique-se de que o Docker Compose esteja instalado."
    pause
    exit /b
)

:: Nome do seu repositório Docker Hub
set REPOSITORY=ramonbarbosdev
set IMAGE_NAME=front-syncdb
set TAG=latest
set PROJECT_NAME=docker-compose

docker login

echo.
echo === Construindo a imagem Docker ===
docker build -t %REPOSITORY%/%IMAGE_NAME%:%TAG% .

echo.
echo === Subindo containers com Docker Compose ===
docker-compose -p %PROJECT_NAME% up -d --build

echo.
echo === Enviando a imagem para o Docker Hub ===
docker push %REPOSITORY%/%IMAGE_NAME%:%TAG%

echo.
echo === Processo concluído com sucesso! ===
pause
