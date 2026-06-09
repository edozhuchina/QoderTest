"""
自定义全局异常处理器，统一 API 错误响应格式。
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    全局异常处理器：
    - DRF 已知异常：保留原始响应，包装为统一格式
    - 未知异常：返回 500 服务器错误
    """
    response = exception_handler(exc, context)

    if response is not None:
        # DRF 已知异常，统一包装
        error_payload = {
            'code': response.status_code,
            'message': '请求错误',
            'errors': [],
        }
        # 处理详情
        if isinstance(response.data, dict):
            # 提取 detail 字段（如 JWT 错误）
            if 'detail' in response.data:
                error_payload['message'] = str(response.data['detail'])
            else:
                # 字段级别错误（如序列化校验失败）
                error_payload['errors'] = response.data
                error_payload['message'] = '字段校验失败'
        elif isinstance(response.data, list):
            error_payload['errors'] = response.data

        response.data = error_payload
    else:
        # 未知异常
        response = Response(
            {
                'code': 500,
                'message': '服务器内部错误',
                'errors': [],
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response
