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

### 環境需求
- Docker
- Node.js (v18+)

### 步驟 1：啟動環境與資料庫

在專案根目錄執行以下指令，啟動 MongoDB：
```bash
# 啟動 Docker 容器
docker-compose up -d

# 確認容器是否正常運作
docker ps
```

### 步驟 2：後端設定與管理員初始化
進入後端目錄進行套件安裝，並建立一個初始管理員帳號：
```bash
# 進入後端目錄
cd backend

# 安裝相依套件
npm install

# (選) 修改 .env 檔案設定 JWT_SECRET 與 MONGO_URI

# 執行初始化腳本 (將 admin 帳號寫入 MongoDB)
node seedAdmin.js
```
註：執行 seedAdmin.js 後，預設帳號為 admin，密碼為 adminpassword123。

### 步驟 3：啟動後端伺服器
```bash
# 啟動 Server
npm run dev
```
成功後，終端機應顯示 MongoDB 連線成功

### 步驟 4：前端設定與啟動
開啟另一個終端機，進入前端目錄：
```bash
# 進入前端目錄
cd ../frontend

# 安裝相依套件
npm install

# 啟動 Vite 開發伺服器
npm run dev
```
啟動後，請訪問終端機顯示的網址（通常為: http://localhost:5173）。


## 6. 常見錯誤
1. CORS 阻擋：已在後端配置 cors() 中間件允許前端跨網域請求。

2. Token 過期：前端具備 401 自動攔截器，若 Token 失效將自動重導向至登入頁。