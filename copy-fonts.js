const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(
  __dirname,
  "node_modules/bootstrap-icons/font/fonts"
);
const destDir = path.resolve(__dirname, "src/assets/fonts/bootstrap-icons");

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  const files = fs.readdirSync(from);
  for (const file of files) {
    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

copyFolderSync(sourceDir, destDir);
console.log("Fonts copiadas com sucesso!");
