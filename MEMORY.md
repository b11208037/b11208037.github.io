# MEMORY.md - 長期記憶

_這是我的長期記憶，記錄重要資訊_

---

## 用戶資訊
- **姓名**：欒帥
- **時區**：UTC+8（台灣）

---

## 重要設定

### 對話規則
- **語言**：全部使用繁體中文回答
- **網路圖**：使用 D3.js 生成（不要用 Plotly）

### ElevenLabs 語音
- API Key：環境變數 `$ElevenLabs`
- Voice ID：`V2Qp7CrxJtLL0a5YYNap`
- 模型：`eleven_multilingual_v2`（飽滿聲音）
- 設定：
  - stability: 0.4
  - similarity_boost: 0.9
  - style: 0.4
  - use_speaker_boost: true
- 用法：
  - 「用說的給我聽」→ 中文
  - 「用英文說給我聽」→ 英文

### GitHub
- Repository：`ntust2026/ntust2026.github.io`
- GitHub Pages 網址：`https://ntust2026.github.io/`
- **重要**：HTML 檔案上傳到 repo 根目錄（main 分支），URL 直接用 `https://ntust2026.github.io/<檔名>.html`，<strong>不要</strong>放在 `claw/` 子目錄

---

## 專案

### agent-browser
- 安裝：`npm install -g agent-browser`（v0.21.4）
- 用途：晨報截圖、互動式網頁操作

---

### X (Twitter) 連結處理
- 收到 x.com 連結時，先轉換成 `api.vxtwitter.com` 再抓取內容
- 格式：`https://api.vxtwitter.com/{screen_name}/status/{tweet_id}`
- 這個方法可以成功取得推文原文、媒體、互動數據

---

## スキル
- `skills/line-voice` - 用 ElevenLabs 產生語音並上傳到 GitHub Pages

---

_更新日期：2026-04-28_
