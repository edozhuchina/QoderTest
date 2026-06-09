/**
 * 认证逻辑 - 登录 / 注册 / 登出
 */

async function login(username, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (res.ok) {
            const data = await res.json();
            api.setToken(data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return { success: true };
        }
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.message || '登录失败，请检查用户名和密码' };
    } catch (e) {
        console.error('登录请求失败:', e);
        return { success: false, message: '无法连接到服务器，请确认后端已启动 (http://127.0.0.1:8000)' };
    }
}

async function register(username, email, password, passwordConfirm) {
    try {
        const res = await fetch(`${API_BASE}/users/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password,
                password_confirm: passwordConfirm,
            }),
        });
        if (res.ok) {
            return { success: true, message: '注册成功，请登录' };
        }
        const err = await res.json().catch(() => ({}));
        let message = err.message || '注册失败';
        if (err.errors && typeof err.errors === 'object') {
            const msgs = [];
            for (const field in err.errors) {
                const val = err.errors[field];
                msgs.push(`${field}: ${Array.isArray(val) ? val.join(', ') : val}`);
            }
            message = msgs.join('；');
        }
        return { success: false, message };
    } catch (e) {
        console.error('注册请求失败:', e);
        return { success: false, message: '无法连接到服务器，请确认后端已启动 (http://127.0.0.1:8000)' };
    }
}

async function getProfile() {
    try {
        const res = await api.get('/users/profile/');
        if (res.ok) {
            const data = await res.json();
            return data.data || data;
        }
    } catch (e) {
        console.error('获取用户信息失败:', e);
    }
    return null;
}

function logout() {
    api.clearToken();
    location.reload();
}
