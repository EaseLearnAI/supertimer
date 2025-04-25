# SuperTimer 后端 API 文档

本文档详细描述了 SuperTimer 应用的后端 API 接口，基于 Supabase 构建。

## 基础信息

- **基础 URL**: `/api/v1`
- **认证方式**: JWT Token (通过 Supabase Auth)
- **响应格式**: JSON

所有请求需要在 Header 中包含授权信息：
```
Authorization: Bearer {token}
```

## 用户管理

### 获取当前用户信息

```
GET /users/me
```

**响应示例**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "用户名",
  "avatar_url": "https://example.com/avatar.png",
  "created_at": "2023-05-01T12:00:00Z",
  "updated_at": "2023-05-01T12:00:00Z"
}
```

### 更新用户信息

```
PATCH /users/me
```

**请求参数**:
```json
{
  "display_name": "新用户名",
  "avatar_url": "https://example.com/new-avatar.png"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "新用户名",
  "avatar_url": "https://example.com/new-avatar.png",
  "updated_at": "2023-05-02T12:00:00Z"
}
```

## 任务管理

### 获取任务集合列表

```
GET /task-groups
```

**响应示例**:
```json
[
  {
    "id": "uuid",
    "name": "健身",
    "icon": "dumbbell",
    "icon_color": "#FF3B30",
    "is_open": true,
    "created_at": "2023-05-01T12:00:00Z",
    "updated_at": "2023-05-01T12:00:00Z",
    "tasks": [
      {
        "id": "uuid",
        "content": "练肩",
        "completed": false,
        "created_at": "2023-05-01T12:00:00Z"
      }
    ]
  }
]
```

### 创建任务集合

```
POST /task-groups
```

**请求参数**:
```json
{
  "name": "学习",
  "icon": "book",
  "icon_color": "#34C759"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "name": "学习",
  "icon": "book",
  "icon_color": "#34C759",
  "is_open": true,
  "created_at": "2023-05-02T12:00:00Z",
  "updated_at": "2023-05-02T12:00:00Z"
}
```

### 更新任务集合

```
PATCH /task-groups/:id
```

**请求参数**:
```json
{
  "name": "学习计划",
  "is_open": false
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "name": "学习计划",
  "icon": "book",
  "icon_color": "#34C759",
  "is_open": false,
  "updated_at": "2023-05-02T13:00:00Z"
}
```

### 删除任务集合

```
DELETE /task-groups/:id
```

**响应**: 204 No Content

### 获取任务列表

```
GET /tasks
```

**查询参数**:
- `group_id`: 按集合筛选 (可选)
- `quadrant`: 按四象限筛选 (可选，1-4)
- `completed`: 按完成状态筛选 (可选，true/false)

**响应示例**:
```json
[
  {
    "id": "uuid",
    "group_id": "uuid",
    "quadrant": 1,
    "content": "练肩",
    "completed": false,
    "priority": "high",
    "due_date": "2023-05-03T10:00:00Z",
    "location": "健身房",
    "created_at": "2023-05-01T12:00:00Z",
    "updated_at": "2023-05-01T12:00:00Z"
  }
]
```

### 创建任务

```
POST /tasks
```

**请求参数**:
```json
{
  "group_id": "uuid",
  "quadrant": 1,
  "content": "Swift课程",
  "priority": "medium",
  "due_date": "2023-05-04T14:00:00Z",
  "location": "家里"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "group_id": "uuid",
  "quadrant": 1,
  "content": "Swift课程",
  "completed": false,
  "priority": "medium",
  "due_date": "2023-05-04T14:00:00Z",
  "location": "家里",
  "created_at": "2023-05-02T12:00:00Z",
  "updated_at": "2023-05-02T12:00:00Z"
}
```

### 更新任务

```
PATCH /tasks/:id
```

**请求参数**:
```json
{
  "content": "学习Swift",
  "completed": true
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "content": "学习Swift",
  "completed": true,
  "updated_at": "2023-05-02T15:00:00Z"
}
```

### 删除任务

```
DELETE /tasks/:id
```

**响应**: 204 No Content

## 习惯跟踪

### 获取习惯列表

```
GET /habits
```

**响应示例**:
```json
[
  {
    "id": "uuid",
    "name": "阅读",
    "icon": "book",
    "color": "#5AC8FA",
    "streak": 28,
    "created_at": "2023-04-01T12:00:00Z",
    "updated_at": "2023-05-01T12:00:00Z",
    "logs": [
      {
        "id": "uuid",
        "completed_at": "2023-05-01",
        "skipped": false
      }
    ]
  }
]
```

### 创建习惯

```
POST /habits
```

**请求参数**:
```json
{
  "name": "冥想",
  "icon": "spa",
  "color": "#AF52DE"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "name": "冥想",
  "icon": "spa",
  "color": "#AF52DE",
  "streak": 0,
  "created_at": "2023-05-02T12:00:00Z",
  "updated_at": "2023-05-02T12:00:00Z"
}
```

### 更新习惯

```
PATCH /habits/:id
```

**请求参数**:
```json
{
  "name": "日常冥想",
  "color": "#9F52CE"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "name": "日常冥想",
  "icon": "spa",
  "color": "#9F52CE",
  "updated_at": "2023-05-02T13:00:00Z"
}
```

### 删除习惯

```
DELETE /habits/:id
```

**响应**: 204 No Content

### 记录习惯完成

```
POST /habits/:id/logs
```

**请求参数**:
```json
{
  "completed_at": "2023-05-02",
  "skipped": false
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "habit_id": "uuid",
  "completed_at": "2023-05-02",
  "skipped": false,
  "created_at": "2023-05-02T12:00:00Z"
}
```

### 获取习惯记录

```
GET /habits/:id/logs
```

**查询参数**:
- `start_date`: 开始日期 (YYYY-MM-DD)
- `end_date`: 结束日期 (YYYY-MM-DD)

**响应示例**:
```json
[
  {
    "id": "uuid",
    "habit_id": "uuid",
    "completed_at": "2023-05-01",
    "skipped": false,
    "created_at": "2023-05-01T12:00:00Z"
  }
]
```

## 日历管理

### 获取日历事件

```
GET /calendar-events
```

**查询参数**:
- `start_date`: 开始日期 (YYYY-MM-DD)
- `end_date`: 结束日期 (YYYY-MM-DD)

**响应示例**:
```json
[
  {
    "id": "uuid",
    "title": "团队周会",
    "start_time": "2023-05-03T10:00:00Z",
    "end_time": "2023-05-03T11:30:00Z",
    "location": "会议室A",
    "description": "讨论项目进度",
    "icon": "briefcase",
    "color": "#007AFF",
    "created_at": "2023-05-01T12:00:00Z",
    "updated_at": "2023-05-01T12:00:00Z"
  }
]
```

### 创建日历事件

```
POST /calendar-events
```

**请求参数**:
```json
{
  "title": "阅读时间",
  "start_time": "2023-05-04T19:00:00Z",
  "end_time": "2023-05-04T20:00:00Z",
  "location": "家里",
  "icon": "book",
  "color": "#5AC8FA"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "title": "阅读时间",
  "start_time": "2023-05-04T19:00:00Z",
  "end_time": "2023-05-04T20:00:00Z",
  "location": "家里",
  "icon": "book",
  "color": "#5AC8FA",
  "created_at": "2023-05-02T12:00:00Z",
  "updated_at": "2023-05-02T12:00:00Z"
}
```

### 更新日历事件

```
PATCH /calendar-events/:id
```

**请求参数**:
```json
{
  "title": "个人阅读时间",
  "end_time": "2023-05-04T20:30:00Z"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "title": "个人阅读时间",
  "end_time": "2023-05-04T20:30:00Z",
  "updated_at": "2023-05-02T13:00:00Z"
}
```

### 删除日历事件

```
DELETE /calendar-events/:id
```

**响应**: 204 No Content

## 番茄钟

### 创建番茄钟会话

```
POST /pomodoro-sessions
```

**请求参数**:
```json
{
  "task_id": "uuid",
  "duration": 25,
  "start_time": "2023-05-02T14:00:00Z"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "task_id": "uuid",
  "duration": 25,
  "completed": false,
  "start_time": "2023-05-02T14:00:00Z",
  "created_at": "2023-05-02T14:00:00Z"
}
```

### 完成番茄钟会话

```
PATCH /pomodoro-sessions/:id
```

**请求参数**:
```json
{
  "completed": true,
  "end_time": "2023-05-02T14:25:00Z"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "completed": true,
  "end_time": "2023-05-02T14:25:00Z",
  "updated_at": "2023-05-02T14:25:00Z"
}
```

### 获取用户番茄钟记录

```
GET /pomodoro-sessions
```

**查询参数**:
- `start_date`: 开始日期 (YYYY-MM-DD)
- `end_date`: 结束日期 (YYYY-MM-DD)
- `task_id`: 按任务ID筛选 (可选)

**响应示例**:
```json
[
  {
    "id": "uuid",
    "task_id": "uuid",
    "task": {
      "id": "uuid",
      "content": "学习Swift"
    },
    "duration": 25,
    "completed": true,
    "start_time": "2023-05-01T10:00:00Z",
    "end_time": "2023-05-01T10:25:00Z",
    "created_at": "2023-05-01T10:00:00Z"
  }
]
```

## 统计分析

### 获取每日统计数据

```
GET /statistics/daily
```

**查询参数**:
- `start_date`: 开始日期 (YYYY-MM-DD)
- `end_date`: 结束日期 (YYYY-MM-DD)

**响应示例**:
```json
[
  {
    "id": "uuid",
    "date": "2023-05-01",
    "completed_tasks": 6,
    "completed_habits": 3,
    "focus_minutes": 150,
    "created_at": "2023-05-01T23:59:59Z",
    "updated_at": "2023-05-01T23:59:59Z"
  }
]
```

### 获取周统计数据

```
GET /statistics/weekly
```

**响应示例**:
```json
{
  "days": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  "tasks": [5, 7, 4, 6, 8, 3, 6],
  "habits": [3, 3, 2, 4, 3, 2, 3],
  "focus_hours": [2.5, 3, 1.5, 4, 3.5, 1, 2.5]
}
```

### 获取月统计数据

```
GET /statistics/monthly
```

**响应示例**:
```json
{
  "task_completion_rate": 75,
  "habit_completion_rate": 85,
  "focus_efficiency": 65
}
```

### 获取年统计数据

```
GET /statistics/yearly
```

**响应示例**:
```json
{
  "months": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "tasks": [65, 70, 75, 80, 85, 90, 0, 0, 0, 0, 0, 0],
  "habits": [50, 55, 60, 70, 80, 85, 0, 0, 0, 0, 0, 0],
  "focus_hours": [30, 35, 40, 45, 50, 55, 0, 0, 0, 0, 0, 0]
}
```

## AI 秘书

### 获取 AI 设置

```
GET /ai-settings
```

**响应示例**:
```json
{
  "id": "uuid",
  "access_calendar": true,
  "access_tasks": true,
  "auto_voice_reply": false,
  "created_at": "2023-05-01T12:00:00Z",
  "updated_at": "2023-05-01T12:00:00Z"
}
```

### 更新 AI 设置

```
PATCH /ai-settings
```

**请求参数**:
```json
{
  "access_calendar": true,
  "access_tasks": true,
  "auto_voice_reply": true
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "access_calendar": true,
  "access_tasks": true,
  "auto_voice_reply": true,
  "updated_at": "2023-05-02T12:00:00Z"
}
```

### 发送消息到 AI 助手

```
POST /ai-assistant/messages
```

**请求参数**:
```json
{
  "text": "帮我安排今天的日程"
}
```

**响应示例**:
```json
{
  "id": "uuid",
  "text": "我分析了你的日程安排，今天你有以下几个任务需要完成：",
  "cards": [
    {
      "type": "task",
      "title": "团队周会",
      "time": "10:00 - 11:30",
      "location": "会议室A",
      "priority": "high"
    },
    {
      "type": "task",
      "title": "项目方案审核",
      "time": "14:00 - 15:00",
      "location": "办公室",
      "priority": "medium"
    }
  ],
  "created_at": "2023-05-02T12:00:00Z"
}
```

### 获取 AI 助手对话历史

```
GET /ai-assistant/messages
```

**响应示例**:
```json
[
  {
    "id": "uuid",
    "text": "你好！我是你的AI助手，有什么可以帮助你的吗？",
    "isUser": false,
    "time": "09:30",
    "created_at": "2023-05-02T09:30:00Z"
  },
  {
    "id": "uuid",
    "text": "我想创建一个提醒，明天上午9点提醒我参加会议。",
    "isUser": true,
    "time": "09:31",
    "created_at": "2023-05-02T09:31:00Z"
  }
]
```

## 错误响应

所有接口在出错时返回统一的错误格式：

```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "用户未认证或认证已过期",
    "status": 401
  }
}
```

常见错误代码：
- `AUTHENTICATION_ERROR`: 401 认证错误
- `PERMISSION_ERROR`: 403 权限错误
- `NOT_FOUND`: 404 资源不存在
- `VALIDATION_ERROR`: 422 请求数据验证失败
- `SERVER_ERROR`: 500 服务器内部错误
