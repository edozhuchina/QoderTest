/**
 * 注册页面逻辑 — 多步骤表单
 */
document.addEventListener('DOMContentLoaded', () => {
    // 已登录则跳转
    if (api.isLoggedIn()) {
        window.location.replace('profile.html');
        return;
    }

    const form       = document.getElementById('register-form');
    const alertBox   = document.getElementById('register-alert');
    const alertMsg   = document.getElementById('register-alert-msg');

    let currentStep = 1;

    // ========== 步骤导航 ==========
    document.getElementById('btn-step-next').addEventListener('click', () => {
        if (validateStep1()) {
            goToStep(2);
        }
    });

    document.getElementById('btn-step-back').addEventListener('click', () => {
        goToStep(1);
    });

    function goToStep(step) {
        // 隐藏所有步骤
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        document.getElementById(`form-step-${step}`).classList.add('active');

        // 更新指示器
        for (let i = 1; i <= 3; i++) {
            const dot = document.getElementById(`step-dot-${i}`);
            dot.classList.remove('active', 'done');
            if (i < step)  dot.classList.add('done');
            if (i === step) dot.classList.add('active');
        }

        currentStep = step;
        hideAlert();
    }

    // ========== 步骤1校验 ==========
    function validateStep1() {
        clearFieldErrors();
        let valid = true;

        const username = document.getElementById('reg-username').value.trim();
        const email    = document.getElementById('reg-email').value.trim();

        if (!username || username.length < 3 || username.length > 20) {
            showFieldError('err-reg-username', '用户名需要3-20个字符');
            document.getElementById('reg-username').classList.add('input-error');
            valid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showFieldError('err-reg-username', '用户名只能包含字母、数字和下划线');
            document.getElementById('reg-username').classList.add('input-error');
            valid = false;
        }

        if (!email) {
            showFieldError('err-reg-email', '请输入邮箱地址');
            document.getElementById('reg-email').classList.add('input-error');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError('err-reg-email', '请输入有效的邮箱地址');
            document.getElementById('reg-email').classList.add('input-error');
            valid = false;
        }

        return valid;
    }

    // ========== 密码强度检测 ==========
    const pwdInput     = document.getElementById('reg-password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        let score = 0;
        if (val.length >= 8)  score++;
        if (val.length >= 12) score++;
        if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
        if (/\d/.test(val))   score++;
        if (/[^a-zA-Z0-9]/.test(val)) score++;

        strengthFill.className = 'strength-fill';
        if (val.length === 0) {
            strengthText.textContent = '';
        } else if (score <= 2) {
            strengthFill.classList.add('weak');
            strengthText.textContent = '弱';
            strengthText.style.color = '#d93025';
        } else if (score <= 3) {
            strengthFill.classList.add('medium');
            strengthText.textContent = '中等';
            strengthText.style.color = '#f9ab00';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = '强';
            strengthText.style.color = '#1e8e3e';
        }
    });

    // ========== 密码显隐切换 ==========
    document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const isPwd = input.type === 'password';
            input.type = isPwd ? 'text' : 'password';
            btn.querySelector('span').textContent = isPwd ? '🙈' : '👁';
        });
    });

    // ========== 表单提交（步骤2） ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (currentStep !== 2) return;

        clearFieldErrors();
        hideAlert();

        const password        = pwdInput.value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;

        // 前端校验
        if (password.length < 8) {
            showFieldError('err-reg-password', '密码至少需要8个字符');
            pwdInput.classList.add('input-error');
            return;
        }
        if (password !== passwordConfirm) {
            showFieldError('err-reg-password-confirm', '两次输入的密码不一致');
            document.getElementById('reg-password-confirm').classList.add('input-error');
            return;
        }

        // 按钮加载状态
        const btnRegister = document.getElementById('btn-register');
        btnRegister.querySelector('.btn-text').style.display    = 'none';
        btnRegister.querySelector('.btn-loading').style.display = 'flex';
        btnRegister.disabled = true;

        const username = document.getElementById('reg-username').value.trim();
        const email    = document.getElementById('reg-email').value.trim();

        const result = await register(username, email, password, passwordConfirm);

        if (result.success) {
            // 成功：进入步骤3
            goToStep(3);
            // 2秒后跳转登录页
            setTimeout(() => {
                window.location.href = 'login.html?registered=1';
            }, 2000);
        } else {
            btnRegister.querySelector('.btn-text').style.display    = '';
            btnRegister.querySelector('.btn-loading').style.display = 'none';
            btnRegister.disabled = false;
            showAlert(result.message);
        }
    });

    // ========== 辅助函数 ==========
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
});
