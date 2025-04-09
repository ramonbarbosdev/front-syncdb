const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const indexPath = path.resolve(__dirname, '..', 'dist', 'browser', 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html não encontrado:', indexPath);
    return;
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true, // Segurança adicional
    },
    show: false // Evita tela branca antes do carregamento
  });

  win.loadFile(indexPath).then(() => {
    win.show(); // Mostra a janela somente após o carregamento
  }).catch((err) => {
    console.error('Erro ao carregar index.html:', err);
  });
}

app.whenReady().then(() => {
  createWindow();

  // No macOS, recria a janela ao clicar no ícone no dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
