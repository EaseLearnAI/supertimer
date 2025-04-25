# SuperTimer 产品功能执行流程

根据您的数据库设计和相关SQL文件，我将为您展示SuperTimer应用的主要功能执行流程。

## 1. 用户注册与登录流程

1. 用户通过Supabase Auth进行注册/登录
2. 登录成功后，触发`handle_new_user`函数自动创建用户个人资料
3. 用户被重定向到任务页面（通过middleware.ts中的路由保护）

```mermaid
graph TD
    A[用户访问网站] --> B{是否已登录?}
    B -->|否| C[重定向到登录页]
    B -->|是| D[重定向到任务页]
    C --> E[用户登录/注册]
    E --> F[创建profiles记录]
    F --> D
```

## 2. 任务管理流程

1. 用户创建任务集（分类）
2. 用户在任务集中创建任务
3. 用户可以设置任务优先级、紧急性和重要性
4. 用户完成任务后标记为已完成
5. 系统自动更新统计数据

```mermaid
graph TD
    A[用户访问任务页面] --> B[查看现有任务]
    A --> C[创建新任务集]
    A --> D[创建新任务]
    D --> E[设置任务属性]
    B --> F[标记任务完成]
    F --> G[触发on_task_completion_changed触发器]
    G --> H[更新statistics表]
```

## 3. 习惯追踪流程

1. 用户创建习惯（设置频率、图标等）
2. 用户每天打卡记录习惯完成情况
3. 系统自动计算连续打卡天数
4. 系统更新统计数据

```mermaid
graph TD
    A[用户访问习惯页面] --> B[查看现有习惯]
    A --> C[创建新习惯]
    B --> D[打卡记录]
    D --> E[创建habit_logs记录]
    E --> F[触发on_habit_log_created触发器]
    F --> G[更新habits表中的连续天数]
    E --> H[触发on_habit_log_inserted触发器]
    H --> I[更新statistics表]
```

## 4. 专注时间管理流程

1. 用户选择任务开始专注
2. 系统记录专注开始时间
3. 用户完成专注后，系统记录结束时间
4. 系统更新统计数据

```mermaid
graph TD
    A[用户选择任务] --> B[开始专注]
    B --> C[创建focus_sessions记录]
    C --> D[专注结束]
    D --> E[更新focus_sessions记录]
    E --> F[触发on_focus_session_completed触发器]
    F --> G[更新statistics表]
```

## 5. 日历事件管理流程

1. 用户创建日历事件
2. 用户可以将事件关联到特定任务
3. 系统在日历视图中展示事件和任务

```mermaid
graph TD
    A[用户访问日历页面] --> B[查看现有事件]
    A --> C[创建新事件]
    C --> D[可选:关联到任务]
    B --> E[查看事件详情]
```

## 6. AI助手交互流程

1. 用户向AI助手发送消息
2. 系统记录对话内容
3. AI分析用户数据和行为模式
4. AI提供个性化建议和鼓励

```mermaid
graph TD
    A[用户发送消息] --> B[记录到ai_conversations表]
    B --> C[AI分析用户数据]
    C --> D[查询用户历史数据]
    D --> E[生成个性化回复]
    E --> F[更新ai_conversations表]
    E --> G[可选:更新user_profiles表]
```

## 7. 统计分析流程

1. 系统自动记录用户每日完成的任务、习惯和专注时间
2. 用户可以查看统计数据和趋势图表

```mermaid
graph TD
    A[用户访问统计页面] --> B[查询statistics表]
    B --> C[生成趋势图表]
    C --> D[展示完成情况]
```

## 8. 用户画像构建流程

1. 系统分析用户行为模式
2. 系统更新用户画像数据
3. AI助手使用用户画像提供个性化服务

```mermaid
graph TD
    A[用户日常使用应用] --> B[系统收集行为数据]
    B --> C[分析行为模式]
    C --> D[更新user_profiles表]
    D --> E[AI使用画像数据]
    E --> F[提供个性化服务]
```

## 9. 旅行规划功能流程

1. 用户请求旅行规划
2. AI助手分析用户画像和偏好
3. AI生成个性化旅行计划
4. 系统保存旅行计划

```mermaid
graph TD
    A[用户请求旅行规划] --> B[AI查询user_profiles表]
    B --> C[分析用户偏好]
    C --> D[生成旅行计划]
    D --> E[保存到travel_plans表]
    E --> F[展示给用户]
```

这些流程展示了SuperTimer应用如何利用Supabase数据库实现任务管理、习惯追踪、AI助手等核心功能，以及如何通过触发器和RLS策略确保数据安全和自动化统计。