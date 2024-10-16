from rest_framework.authentication import BaseAuthentication # type: ignore
from rest_framework.exceptions import AuthenticationFailed # type: ignore
from .models import User
from .authentication import decode_access_token

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise AuthenticationFailed('Authorization header missing')
        
        try:
            auth_type, token = auth_header.split()
            if auth_type.lower() != 'bearer':
                raise AuthenticationFailed('Invalid token type')
            
            user_id = decode_access_token(token)
            user = User.objects.get(pk=user_id)
            if not user:
                raise AuthenticationFailed('User not found')
            
            return (user, token)
        except ValueError:
            raise AuthenticationFailed('Invalid token format')
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication error: {str(e)}')

