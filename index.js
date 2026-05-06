const fs = require("fs");
const path = require("path");
const os = require("os");

const downloads = path.join(os.homedir(), "Downloads");

const folders = {
    Images: [".png", ".jpg", ".jpeg", ".gif"],
    Videos: [".mp4", ".mkv", ".avi"],
    PDFs: [".pdf"],
    Zips: [".zip", ".rar", ".7z"],
    Installers: [".exe", ".msi"]
};

// 🔥 tunnista kansio
function getFolder(ext) {
    for (const [folder, exts] of Object.entries(folders)) {
        if (exts.includes(ext)) return folder;
    }
    return "Other";
}

// 📁 varmista kansio
function ensureFolder(name) {
    const dir = path.join(downloads, name);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

// ⏳ tarkista onko tiedosto valmis
function isFileStable(filePath) {
    try {
        const size1 = fs.statSync(filePath).size;

        // pieni viive
        const start = Date.now();
        while (Date.now() - start < 1500) {}

        const size2 = fs.statSync(filePath).size;

        return size1 === size2;
    } catch {
        return false;
    }
}

// 📦 siirrä tiedosto
function moveFile(file) {
    const oldPath = path.join(downloads, file);

    if (!fs.existsSync(oldPath)) return;
    if (!fs.statSync(oldPath).isFile()) return;

    const ext = path.extname(file).toLowerCase();
    const folder = getFolder(ext);

    ensureFolder(folder);

    const newPath = path.join(downloads, folder, file);

    fs.renameSync(oldPath, newPath);
}

// 🔍 käsittele downloads
function scanDownloads() {
    const files = fs.readdirSync(downloads);

    for (const file of files) {
        const full = path.join(downloads, file);

        try {
            if (!fs.statSync(full).isFile()) continue;

            // 🔥 tärkein: älä koske jos ei valmis
            if (!isFileStable(full)) continue;

            moveFile(file);
        } catch {
            // ignore
        }
    }
}

// 🚀 käynnistys (täysin silent)
scanDownloads();

// 🔁 jatkuva tausta
setInterval(scanDownloads, 60 * 1000); // 1 min välein