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
set REPOSITORY=ramonbarbosdev/front-syncdb

:: Nome da imagem
set IMAGE_NAME=front-syncdb
set TAG=latest

:: Derruba e recria os containers
echo "Derrubando os containers existentes..."
docker-compose down

echo "Recriando e atualizando os containers..."
docker-compose up --build --force-recreate --remove-orphans

:: Build da imagem
echo "Construindo a imagem Docker..."
docker build -t %REPOSITORY%/%IMAGE_NAME%:%TAG% .

:: Push da imagem para o Docker Hub
echo "Enviando a imagem para o Docker Hub..."
docker push %REPOSITORY%/%IMAGE_NAME%:%TAG%

echo "Processo concluído!"
pause
