# QoderTest

基于 **Django + DRF + JWT** 的前后端分离用户认证系统，前端使用原生 HTML/CSS/JavaScript 构建。

## 项目简介

QoderTest 是一个完整的全栈用户认证项目，实现了用户注册、登录（JWT）、个人信息管理等核心功能。

### 技术栈

| 层级 | 技术 |
|------|------|
| **后端框架** | Django 5.2 (LTS) |
| **REST API** | Django REST Framework 3.15+ |
| **认证方案** | djangorestframework-simplejwt (JWT) |
| **跨域处理** | django-cors-headers |
| **序列化/校验** | DRF Serializer（原生） |
| **前端** | HTML + CSS + JavaScript（原生，无框架） |
| **数据库** | SQLite（开发）/ PostgreSQL（生产） |

### 功能特性

- 用户注册（多步骤向导表单 + 密码强度检测）
- 用户登录（JWT Token 认证 + 自动刷新）
- 个人信息查看与编辑
- 密码显隐切换、前端表单校验
- 统一 API 错误响应格式
- 响应式 UI，适配移动端

## 项目结构

```
QoderTest/
├── backend/                     # Django 后端
│   ├── manage.py
│   ├── requirements.txt         # Python 依赖
│   ├── config/                  # Django 项目配置
│   │   ├── settings.py          # DRF / JWT / CORS 配置
│   │   ├── urls.py              # 根路由
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── apps/                    # 业务应用
│   │   └── users/               # 用户模块
│   │       ├── models.py        # UserProfile 模型
│   │       ├── serializers.py   # 序列化器
│   │       ├── views.py         # API 视图
│   │       └── urls.py          # 模块路由
│   └── core/                    # 公共模块
│       ├── exceptions.py        # 全局异常处理
│       ├── permissions.py       # 自定义权限类
│       └── pagination.py        # 分页器
├── frontend/                    # 前端静态文件
│   ├── index.html               # 入口（自动路由）
│   ├── login.html               # 登录页面
│   ├── register.html            # 注册页面（三步向导）
│   ├── profile.html             # 个人中心
│   ├── css/
│   │   └── style.css            # 全局样式
│   └── js/
│       ├── api.js               # API 客户端（Fetch + JWT 封装）
│       ├── auth.js              # 认证逻辑（登录/注册/登出）
│       ├── login.js             # 登录页交互
│       ├── register.js          # 注册页交互
│       └── profile.js           # 个人中心交互
└── 架构设计.md                   # 架构设计文档
```

## 安装与启动

### 环境要求

- **Python** >= 3.10
- **Node.js**（仅用于 Live Server，可选）
- **VS Code** + **Live Server** 插件（推荐）

### 1. 克隆项目

```bash
git clone https://github.com/edozhuchina/QoderTest.git
cd QoderTest
```

### 2. 启动后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 数据库迁移
python manage.py migrate

# 创建管理员账号（可选）
python manage.py createsuperuser

# 启动开发服务器
python manage.py runserver
```

后端启动后访问：http://127.0.0.1:8000

### 3. 启动前端

**方式一：VS Code Live Server（推荐）**

用 VS Code 打开项目，右键 `frontend/login.html` → **Open with Live Server**

**方式二：Python 简易服务器**

```bash
cd frontend
python -m http.server 5500
```

然后访问：http://localhost:5500

## API 接口

| 端点 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/auth/login/` | POST | 登录，返回 JWT Token | 无需 |
| `/api/auth/refresh/` | POST | 刷新 Access Token | 无需 |
| `/api/auth/verify/` | POST | 验证 Token 有效性 | 无需 |
| `/api/users/register/` | POST | 用户注册 | 无需 |
| `/api/users/profile/` | GET | 获取当前用户信息 | Bearer Token |
| `/api/users/profile/` | PUT/PATCH | 更新个人信息 | Bearer Token |
| `/api/users/` | GET | 用户列表（分页） | Bearer Token |

### 请求示例

**注册：**
```bash
curl -X POST http://127.0.0.1:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"YourPass123","password_confirm":"YourPass123"}'
```

**登录：**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"YourPass123"}'
```

**获取个人信息：**
```bash
curl http://127.0.0.1:8000/api/users/profile/ \
  -H "Authorization: Bearer <your_access_token>"
```

## 开发说明

- 后端修改代码后 Django 会自动重新加载
- 前端修改 HTML/CSS/JS 后在浏览器中刷新即可（Live Server 支持热更新）
- 数据库使用 SQLite，文件位于 `backend/db.sqlite3`
- Django Admin 后台：http://127.0.0.1:8000/admin/

## 许可证

MIT License
