# Table-booker API Specification

Base URL: http://localhost:5000/api

## 1. Authentication
管理員身分驗證相關介面。

### POST /auth/login
驗證管理員身分並獲取 JWT Token。
- Request Body :
```json
{
  "username": "admin",
  "password": "adminpassword123"
}
```

- Success Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
}
```


## 2. Bookings (Public)
提供給一般顧客使用的公開介面。

### GET /bookings/availability
查詢特定日期的名額狀況。

- Query Params: date (格式: YYYY-MM-DD)

- Success Response (200 OK):
```json
[
  { "time": "11:00", "remaining": 5 },
  { "time": "12:00", "remaining": 3 }
]
```

### POST /bookings
提交預約申請。

- Request Body :
```json
{
  "name": "王小明",
  "phone": "0912345678",
  "partySize": 2,
  "date": "2026-01-13",
  "timeSlot": "12:00"
}
```

- Success Response (201 Created):
```json
{ "message": "預約成功", "data": { ... } }  
```

## 3. Bookings (Protected)
需帶上 Authorization: Bearer <Token> 才能訪問的管理端介面。

### GET /bookings/admin/all
獲取所有預約紀錄。

- Success Response (200 OK):
```json
[
  {
    "_id": "65a...",
    "name": "王小明",
    "status": "pending",
    "date": "2026-01-13",
    "timeSlot": "12:00"
  }
]
```

### PATCH /bookings/:id/status
更新預約狀態（報到或取消）。

- Request Body:
```json
{ "status": "checked-in" } // 或 "cancelled"
```