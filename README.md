# 傷病給付申請指南

這是一個不需要安裝或建置的純靜態網站，可直接上傳到 GitHub Pages。

## 網站檔案

- `index.html`：網站入口
- `assets/site.css`：網站樣式
- `assets/site.js`：問答、判斷與文件清單互動
- `og.png`：分享預覽圖片
- `.nojekyll`：避免 GitHub Pages 使用 Jekyll 處理網站

## 發布到 GitHub Pages

1. 將整個資料夾上傳到 GitHub repository 的 `main` 分支。
2. 前往 **Settings → Pages**。
3. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
4. 等候 `Deploy static site to GitHub Pages` 完成。

網站網址通常為：

```text
https://你的帳號.github.io/你的-repository/
```

也可以直接雙擊 `index.html` 檢查頁面內容，不需要 Node.js 或其他工具。

## 隱私

網站不會把問答或勾選結果傳送到伺服器，所有互動都只存在目前頁面中。
