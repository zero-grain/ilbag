# 傷病給付申請指南

一個可公開部署的純靜態網站，用簡單問答協助使用者初步區分「職保傷病給付」與「勞保普通傷病給付」，並整理申請文件與官方資訊。

## 本機預覽

需求：Node.js 22.13 以上版本。

```bash
npm install
npm run dev
```

建立正式靜態檔案：

```bash
npm run build
```

完成後的網站位於 `dist/`，不需要伺服器、資料庫或環境變數。

## 發布到 GitHub Pages

1. 在 GitHub 建立一個公開 repository。
2. 將這個資料夾的內容推送到 repository 的 `main` 分支。
3. 前往 repository 的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
5. 等候 `Deploy static site to GitHub Pages` workflow 完成。

之後每次推送到 `main`，網站都會自動重新建置與發布。網址通常為：

```text
https://你的帳號.github.io/你的-repository/
```

## 常用指令

```bash
npm run dev      # 本機開發
npm run build    # 型別檢查並產生靜態網站
npm run preview  # 預覽正式建置結果
npm run lint     # 程式碼檢查
```

## 資料與隱私

- 網站不會把問答或勾選結果傳送到任何伺服器。
- 所有互動只存在瀏覽器目前頁面，重新整理後即清除。
- 給付資格與金額僅供初步理解，實際結果以勞動部勞工保險局核定為準。
- 公開 repository 不應放入密碼、API 金鑰、個資或任何 `.env` 檔案。
