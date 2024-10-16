from rest_framework.response import Response # type: ignore
from django.http import HttpResponse
import json

def create_response( status_code, message, data=None):
    response_data = {
        "status": status_code,
        "message": message
    }
    if data is not None:
        response_data['data']= data
    return Response(response_data, status=status_code)


def create_response_http(status_code, message, data=None):
    response_data = {
        "status": status_code,
        "message": message
    }
    if data is not None:
        response_data['data'] = data

    response_json = json.dumps(response_data)

    return HttpResponse(response_json, content_type='application/json', status=status_code)
