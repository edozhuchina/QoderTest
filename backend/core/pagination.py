"""
自定义分页器。
"""
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """
    标准分页器，支持客户端自定义每页数量。
    示例：?page=2&page_size=10
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
