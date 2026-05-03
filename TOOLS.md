# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## PDF 讀取技巧

當收到 PDF 檔案時，按順序嘗試以下方法：

### 1. 先檢查環境有什麼工具
```bash
which pdftotext mutool pdfinfo gs pdftoppm 2>/dev/null
pip list 2>/dev/null | grep -i pdf
node -e "require('pdf-parse')"  # 檢查 Node.js pdf-parse
```

### 2. Google Drive PDF（可下載的情況）
- 直接下載：`curl -L -o file.pdf "https://drive.google.com/uc?export=download&id=FILEID"`
- 不適用 web_fetch（會拿到二進制）

### 3. Node.js pdf-parse（本書環境首選）
```bash
cd /home/node/.openclaw/workspace && npm install pdf-parse
```

```javascript
const { PDFParse } = require('pdf-parse');
const buf = require('fs').readFileSync('file.pdf');
const p = new PDFParse(new Uint8Array(buf));
p.load().then(() => p.getText()).then(d => {
  // d.pages = array of {num, text}
  // d.text = full text string
  console.log(d.text);
});
```

### 4. 其他方法（本書可能沒裝）
- Python pypdf2 / fitz（需 pip）
- pdftotext（poppler-utils）
- Ghostscript（gs）
- ImageMagick（convert）


### 5. 注意事項
- ImageMagick 有安全策略阻止處理 PDF，需用 gs
- 建議不要用 `read` 工具嘗試讀 PDF 純文字（它是給文字檔用的）
- 先下載到本地再處理，不要依賴 web_fetch 解析 PDF

---

Add whatever helps you do your job. This is your cheat sheet.
