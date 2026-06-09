/**
 * 个人中心页面逻辑
 */
document.addEventListener('DOMContentLoaded', () => {
    // 未登录则跳转
    if (!api.isLoggedIn()) {
        window.location.replace('login.html');
        return;
    }

    // 显示当前日期
    const dateEl = document.getElementById('current-date');
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    // 显示 Token 预览
    const tokenPreview = document.getElementById('token-preview');
    const token = api.accessToken || '';
    tokenPreview.textContent = token
        ? token.substring(0, 20) + '...' + token.substring(token.length - 10)
        : '未获取';

    // 退出按钮
    document.getElementById('btn-logout').addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            logout();
        }
    });

    // 加载个人信息
    loadProfile();

    // ========== 编辑资料 ==========
    const btnEdit      = document.getElementById('btn-edit-profile');
    const editForm     = document.getElementById('edit-profile-form');
    const profileExt   = document.getElementById('profile-ext');
    const btnCancel    = document.getElementById('btn-cancel-edit');

    btnEdit.addEventListener('click', () => {
        profileExt.style.display = 'none';
        btnEdit.style.display    = 'none';
        editForm.style.display   = 'block';
    });

    btnCancel.addEventListener('click', () => {
        editForm.style.display   = 'none';
        profileExt.style.display = 'block';
        btnEdit.style.display    = '';
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nickname = document.getElementById('edit-nickname').value.trim();
        const bio      = document.getElementById('edit-bio').value.trim();

        const res = await api.patch('/users/profile/', {
            profile: { nickname, bio }
        });

        if (res.ok) {
            // 更新显示
            document.getElementById('profile-nickname').textContent = nickname || '未设置';
            document.getElementById('profile-bio').textContent      = bio || '未设置';

            editForm.style.display   = 'none';
            profileExt.style.display = 'block';
            btnEdit.style.display    = '';

            showToast('资料更新成功');
        } else {
            showToast('更新失败，请重试', true);
        }
    });

    // ========== 核心函数 ==========
    async function loadProfile() {
        const profile = await getProfile();
        if (!profile) {
            logout();
            return;
        }

        // 基本信息
        document.getElementById('profile-id').textContent       = profile.id;
        document.getElementById('profile-username').textContent  = profile.username;
        document.getElementById('profile-email').textContent     = profile.email || '未设置';
        document.getElementById('profile-date').textContent      = new Date(profile.date_joined).toLocaleString('zh-CN');

        // 头部
        document.getElementById('header-username').textContent  = profile.username;
        document.getElementById('welcome-username').textContent = profile.username;
        document.getElementById('user-avatar').textContent       = profile.username.charAt(0).toUpperCase();

        // 扩展资料
        if (profile.profile) {
            document.getElementById('profile-nickname').textContent = profile.profile.nickname || '未设置';
            document.getElementById('profile-bio').textContent      = profile.profile.bio || '未设置';

            // 预填编辑表单
            document.getElementById('edit-nickname').value = profile.profile.nickname || '';
            document.getElementById('edit-bio').value      = profile.profile.bio || '';
        }
    }

    // ========== Toast 提示 ==========
    function showToast(msg, isError = false) {
        const toast = document.createElement('div');
        toast.className = 'toast ' + (isError ? 'toast-error' : 'toast-success');
        toast.textContent = msg;
        document.body.appendChild(toast);

        // 动画显示
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // 注入 Toast 样式
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 9999;
            pointer-events: none;
        }
        .toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .toast-success { background: #1e8e3e; color: #fff; }
        .toast-error   { background: #d93025; color: #fff; }
    `;
    document.head.appendChild(style);
});
