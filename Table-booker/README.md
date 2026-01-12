# Table-booker 餐廳預約與報到管理系統

## 1. 專案簡介
- 專案名稱：Table-booker 餐廳預約與管理系統。

- 目標：自動化管理餐廳名額，解決傳統紙本預約容易出錯且難以即時更新名額的痛點，並提供安全的後台管理介面。

## 2. 核心功能介紹
- 顧客端：
    - 查看即時剩餘名額
    - 兩天內預約登記
    - 開放登記時段 11:00 - 20:00
    - 防止超額預約

- 管理端：
    - JWT 登入 / 登出驗證管理員身分
    - 詳細預約者資訊
    - 一鍵更新報到 / 取消狀態（連動名額釋放）

## 3. 系統架構
- 前端：React.js + Tailwind CSS (Vite 構建)，確保 UI 響應式佈局。

- 後端：Node.js + Express.js 處理 RESTful API，並透過中間層 (Middleware) 實施 JWT 權限攔截。

- 資料庫：MongoDB (透過 Docker Compose 部署)。

- 認證機制：JWT (JSON Web Token) 非狀態化驗證，使用 Bcrypt 加密管理員密碼。

## 4. 使用技術說明

### 核心設計亮點：
- 採用 MongoDB, Express, React, Node.js 的 MERN Stack 全端架構 : 核心優勢在於全端均使用 JavaScript，減少了開發時語言切換的上下文開銷，且 MongoDB 的 JSON 格式文件非常適合儲存變動快速的預約資料。
- 後端二次驗證：在預約寫入資料庫前，後端會再次執行 `countDocuments`，徹底杜絕因前端延遲導致的超額預約。

- 無狀態認證：採用 JWT Token 儲存於 LocalStorage，減少伺服器負擔。

## 5. 安裝與執行指引

### 環境準備
- Git
- Docker
- Node.js (v18+)

### 步驟 1：下載專案
開啟終端機，執行以下指令將專案下載至您的本機：
```bash
# 複製倉庫
git clone https://github.com/您的用戶名/您的倉庫名.git

# 進入專案資料夾
cd Table-booker
```

### 步驟2 : 啟動環境與資料庫

本專案採用容器化技術管理資料庫，請確保 Docker 已開啟，並在專案根目錄執行以下指令啟動 MongoDB：
```bash
# 啟動 Docker 容器
docker-compose up -d

# 確認容器是否正常運作
docker ps
```

### 步驟 3：後端設定與管理員初始化

進入後端目錄進行套件安裝，為了確保管理後台安全，先手動建立一個初始管理員帳號：
```bash
# 進入後端目錄並安裝相依套件
cd backend
npm install

# 初始化管理員 (執行一次即可)，預設帳號: admin / 預設密碼: adminpassword123
node seedAdmin.js

# 啟動後端伺服器
npm run dev

```
註：成功後，終端機應顯示 MongoDB 連線成功

### 步驟 4：前端設定與啟動

開啟另一個終端機，進入前端目錄：
```bash
# 進入前端目錄並安裝相依套件
cd ../frontend
npm install

# 啟動前端開發環境
npm run dev
```
啟動後，請訪問終端機顯示的網址（通常為: http://localhost:5173）。

### 步驟 5 : 開始使用
``` bash
顧客預約頁面 : 瀏覽器開啟 http://localhost:5173
後臺管理頁面 : 瀏覽器開啟 http://localhost:5173/admin
```

## 6. 常見錯誤
1. CORS 阻擋：已在後端配置 cors() 中間件允許前端跨網域請求。

2. Token 過期：前端具備 401 自動攔截器，若 Token 失效將自動重導向至登入頁。