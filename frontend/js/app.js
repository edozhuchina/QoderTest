/**
 * 业务逻辑入口 - 页面交互控制
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginSection    = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const profileSection  = document.getElementById('profile-section');
    const userInfo        = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    // 显示/隐藏区块的辅助函数
    function showSection(section) {
        loginSection.style.display    = 'none';
        registerSection.style.display = 'none';
        profileSection.style.display  = 'none';
        if (section) section.style.display = 'block';
    }

    // ========== 初始化页面状态 ==========
    if (api.isLoggedIn()) {
        showSection(profileSection);
        userInfo.style.display = 'inline';
        loadProfile();
    } else {
        showSection(loginSection);
        userInfo.style.display = 'none';
    }

    // ========== 登录表单 ==========
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('login-error');
        errorEl.textContent = '';

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        const result = await login(username, password);
        if (result.success) {
            location.reload();
        } else {
            errorEl.textContent = result.message;
        }
    });

    // ========== 注册表单 ==========
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl   = document.getElementById('register-error');
        const successEl = document.getElementById('register-success');
        errorEl.textContent   = '';
        successEl.textContent = '';

        const username        = document.getElementById('reg-username').value.trim();
        const email           = document.getElementById('reg-email').value.trim();
        const password        = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;

        const result = await register(username, email, password, passwordConfirm);
        if (result.success) {
            successEl.textContent = result.message;
            setTimeout(() => {
                showSection(loginSection);
                successEl.textContent = '';
            }, 1500);
        } else {
            errorEl.textContent = result.message;
        }
    });

    // ========== 切换登录/注册 ==========
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registerSection);
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });

    // ========== 退出 ==========
    document.getElementById('btn-logout').addEventListener('click', logout);

    // ========== 加载个人信息 ==========
    async function loadProfile() {
        const profile = await getProfile();
        if (profile) {
            usernameDisplay.textContent = profile.username;
            const infoDiv = document.getElementById('profile-info');
            infoDiv.innerHTML = `
                <div class="info-row">
                    <span class="info-label">ID</span>
                    <span class="info-value">${profile.id}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">用户名</span>
                    <span class="info-value">${profile.username}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">邮箱</span>
                    <span class="info-value">${profile.email || '未设置'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">注册时间</span>
                    <span class="info-value">${new Date(profile.date_joined).toLocaleString('zh-CN')}</span>
                </div>
            `;
        } else {
            logout();
        }
    }
});
