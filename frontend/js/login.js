/**
 * 登录页面逻辑
 */
document.addEventListener('DOMContentLoaded', () => {
    // 已登录则直接跳转
    if (api.isLoggedIn()) {
        window.location.replace('profile.html');
        return;
    }

    const form       = document.getElementById('login-form');
    const btnLogin   = document.getElementById('btn-login');
    const alertBox   = document.getElementById('login-alert');
    const alertMsg   = document.getElementById('login-alert-msg');
    const togglePwd  = document.getElementById('toggle-pwd');
    const pwdInput   = document.getElementById('login-password');
    const eyeIcon    = document.getElementById('eye-icon');

    // 密码显隐切换
    togglePwd.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        eyeIcon.textContent = isPwd ? '🙈' : '👁';
    });

    // 表单提交
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        clearFieldErrors();

        const username = document.getElementById('login-username').value.trim();
        const password = pwdInput.value;

        // 前端校验
        if (!username) {
            showFieldError('err-username', '请输入用户名');
            document.getElementById('login-username').classList.add('input-error');
            return;
        }
        if (!password) {
            showFieldError('err-password', '请输入密码');
            pwdInput.classList.add('input-error');
            return;
        }

        // 按钮加载状态
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            // 登录成功，跳转个人中心
            window.location.replace('profile.html');
        } else {
            setLoading(false);
            showAlert(result.message);
        }
    });

    // ========== 辅助函数 ==========
    function setLoading(loading) {
        btnLogin.querySelector('.btn-text').style.display    = loading ? 'none' : '';
        btnLogin.querySelector('.btn-loading').style.display = loading ? 'flex' : 'none';
        btnLogin.disabled = loading;
    }

    function showAlert(msg) {
        alertMsg.textContent = msg;
        alertBox.style.display = 'flex';
    }

    function hideAlert() {
        alertBox.style.display = 'none';
    }

    function showFieldError(id, msg) {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    }

    function clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }

    // Enter 键提交
    document.querySelectorAll('#login-form input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
        });
    });
});
