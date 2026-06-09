"""
自定义权限类。
"""
from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    仅允许对象所有者访问。
    要求对象有 user 或 owner 属性，且与当前用户匹配。
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        return False
