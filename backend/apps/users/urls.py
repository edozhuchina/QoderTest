"""
用户模块 URL 路由。
"""
from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('', views.UserListView.as_view(), name='user_list'),
]
