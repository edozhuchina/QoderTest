"""
用户模块 Views。
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserCreateSerializer, UserSerializer, UserUpdateSerializer


class RegisterView(generics.CreateAPIView):
    """
    用户注册
    POST /api/users/register/
    """
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'code': 201,
                'message': '注册成功',
                'data': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    获取/更新当前用户个人信息
    GET  /api/users/profile/   — 获取个人信息
    PUT  /api/users/profile/   — 全量更新
    PATCH /api/users/profile/  — 部分更新
    """
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UserUpdateSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                'code': 200,
                'message': '更新成功',
                'data': UserSerializer(instance).data,
            }
        )


class UserListView(generics.ListAPIView):
    """
    用户列表（分页）
    GET /api/users/
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from django.contrib.auth.models import User
        return User.objects.all().select_related('profile').order_by('-date_joined')
