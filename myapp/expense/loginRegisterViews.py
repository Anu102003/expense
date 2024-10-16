from rest_framework.views import APIView # type: ignore
from .serializers import UserSerializer
from rest_framework.response import Response # type: ignore
from rest_framework.exceptions import APIException # type: ignore
from .models import User
from .authentication import create_access_token, create_refresh_token,decode_refresh_token
from rest_framework import status # type: ignore
from django.db import DatabaseError
from rest_framework.exceptions import ValidationError # type: ignore
from .createResponse import create_response,create_response_http

import logging
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            user=User.objects.filter(email=request.data['email']).first()
            if not user:
                raise APIException('Incorrect email !')

            if not user.check_password(request.data['password']):
                raise APIException('Incorrect password !')

            access_token=create_access_token(user.id) # type: ignore
            refresh_token=create_refresh_token(user.id) # type: ignore
            response_data = {
                'access_token': access_token,
                'refresh_token':refresh_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }
            return create_response(status.HTTP_201_CREATED, 'Registered successfully',response_data)
        except ValidationError as ve:
            error_details = {field: [error for error in errors] for field, errors in ve.detail.items()}
            return create_response(status.HTTP_400_BAD_REQUEST, 'Validation error', error_details)
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user=User.objects.filter(email=request.data['email']).first()
            
            if not user:
                raise APIException('Incorrect email !')

            if not user.check_password(request.data['password']):
                raise APIException('Incorrect password !')

            access_token=create_access_token(user.id) # type: ignore
            refresh_token=create_refresh_token(user.id) # type: ignore
            
            response_data = {
                'access_token': access_token,
                'refresh_token':refresh_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }

            response=create_response_http(status.HTTP_200_OK,'Logined successfully',response_data)
            # response.set_cookie(key='refreshToken', value=refresh_token, secure=False)
            return response
        except ValidationError as ve:
            error_details = {field: [error for error in errors] for field, errors in ve.detail.items()}
            return create_response(status.HTTP_400_BAD_REQUEST, 'Validation error', error_details)
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except APIException as ae:
            return create_response(status.HTTP_401_UNAUTHORIZED, f'{ae}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')

class RefreshView(APIView):
    def post(self, request):
        try:
            refresh_token=request.COOKIES.get('refreshToken')
            if not refresh_token:
                raise APIException('Refresh token is missing')
            user_id=decode_refresh_token(refresh_token)
            if not user_id:
                raise APIException('Invalid refresh token')
            access_token=create_access_token(user_id)
            new_refresh_token = create_refresh_token(user_id)
            return create_response(status.HTTP_200_OK,'Retrieved Refresh token successfully',{
                'access_token': access_token,
                'refresh_token': new_refresh_token,
            })
        except APIException as ae:
            return create_response(status.HTTP_401_UNAUTHORIZED, f'Authentication error: {ae}')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,  f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')

class LogoutView(APIView):
    def post(self, _):
        try:
            return create_response(status.HTTP_200_OK,'Logout successfully')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,  f'An error occurred: {e}')
