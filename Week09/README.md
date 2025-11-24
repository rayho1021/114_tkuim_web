# Week09
更新 Week 7 的會員註冊系統 :   
將送出流程改為呼叫 fetch 、 新增「查看報名清單」按鈕，顯示報名清單。

## 環境需求
- Node.js

- npm 

- VS Code extension : Live Server (用於啟動前端).

- API 測試工具 : Postman / Thunder Client (用於測試 API).

## 啟動方式
### 啟動後端 (server)
(1) 進入目錄: 進入 server 目錄：
```bash
cd Week09/server
```
(2) 安裝依賴: package.json 中列出的所有模組：
```bash
npm install express cors dotenv nanoid
npm install -D nodemon
npm pkg set type="module"
```
(3) 啟動伺服器
```bash
npm run dev 
```

### 啟動前端 (Client)
(1) 開啟瀏覽器並運行 : http://localhost:3001   
(2) 或者使用 vs code 在 week7_signup_form.html 檔案中，啟動 Live Server。

## API 端點與測試
### 端點列表
| 方法 | 路徑 | 說明 |
|------|------|:----|
| GET | /api/signup | 查詢所有報名者的列表 |
| POST | /api/signup | 新增一位報名者 | 
| DELETE | /api/signup/:id | 刪除指定 ID 的報名者 (:id 為變數)
| GET | /health | 伺服器健康檢查端點 |

### 測試
#### 方法一 : 使用 Postman

(1) 驗證服務狀態
```bash
GET http://localhost:3001/health
```

(2) 建立 Collection，設定環境 

URL 設定 :
```
{{baseUrl}} = http://localhost:3001。
```

Body 設定 : raw ，格式選擇 :  JSON 。

(2) 測試 POST 請求

測試資料範例:
```json
{
  "name": "王小明",
  "email": "wangxiaoming@example.com",
  "phone": "0987654321",
  "password": "mySecurePass123",
  "confirmPassword": "mySecurePass123",
  "interests": ["reading", "music"],
  "terms": true
}
```

(3) 點擊 Send

成功應看見 : 201 Created  ；  
響應中包含 message : "報名成功" 和新的 participant 資料.


---

#### 方法二 : 使用 curl

(1) 查詢報名清單 (GET)
```bash
curl http://localhost:3001/api/signup
```

(2) 新增報名者 (POST)

```bash
curl -X POST http://localhost:3001/api/signup \
    -H "Content-Type: application/json" \
    -d '{
      "name": "測試使用者",
      "email": "test@example.com",
      "phone": "0911222333",
      "password": "testPass88",
      "confirmPassword": "testPass88",
      "interests": ["game", "reading"],
      "terms": true
    }'
```
(3) 成功範例
```json
{
  "message": "報名成功",
  "participant": {
    "id": "...", 
    "name": "測試使用者",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

