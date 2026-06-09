/**
 * API 客户端 - 封装 Fetch + JWT 请求 + 自动刷新 Token
 */
const API_BASE = 'http://127.0.0.1:8000/api';

class ApiClient {
    constructor() {
        this.accessToken = localStorage.getItem('access_token') || null;
    }

    setToken(access) {
        this.accessToken = access;
        localStorage.setItem('access_token', access);
    }

    clearToken() {
        this.accessToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    isLoggedIn() {
        return !!this.accessToken;
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        let response;
        try {
            response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
            });
        } catch (networkError) {
            // 网络不可达时抛出明确错误
            throw new Error(`无法连接到服务器 (${API_BASE})，请确认后端已启动`);
        }

        // Access Token 过期，尝试刷新
        if (response.status === 401 && this.accessToken) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                headers['Authorization'] = `Bearer ${this.accessToken}`;
                response = await fetch(`${API_BASE}${endpoint}`, {
                    ...options,
                    headers,
                });
            } else {
                this.clearToken();
                location.reload();
            }
        }

        return response;
    }

    async refreshToken() {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return false;

        try {
            const res = await fetch(`${API_BASE}/auth/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });

            if (res.ok) {
                const data = await res.json();
                this.setToken(data.access);
                if (data.refresh) {
                    localStorage.setItem('refresh_token', data.refresh);
                }
                return true;
            }
        } catch (e) {
            console.error('Token 刷新失败:', e);
        }
        return false;
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }
}

const api = new ApiClient();
