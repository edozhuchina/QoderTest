"""
用户模块 Models。
当前使用 Django 内置 User 模型，如需扩展可在此添加 Profile 等模型。
"""
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    用户扩展资料，与内置 User 一对一关联。
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField('昵称', max_length=64, blank=True, default='')
    avatar = models.URLField('头像', blank=True, default='')
    bio = models.TextField('个人简介', blank=True, default='')
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        verbose_name = '用户资料'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f'{self.user.username} 的资料'
