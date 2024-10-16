from datetime import datetime, timedelta, timezone
from rest_framework import exceptions # type: ignore
import jwt

import logging

logger = logging.getLogger(__name__)
def create_access_token(id):
    now = datetime.now(timezone.utc)
    exp = now + timedelta(seconds=6000)
    payload = {
        'user_id': id,
        'exp': exp,
        'iat': now
    }
    token = jwt.encode(payload, 'access_secret', algorithm='HS256')
    return token

    
def decode_access_token(token):
    try:
        payload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('Token has expired')
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed('Invalid token')
    except Exception:
        raise exceptions.AuthenticationFailed('Unauthenticated')

def create_refresh_token(id):
    now = datetime.now(timezone.utc)
    exp = now + timedelta(seconds=300)
    payload = {
        'user_id': id,
        'exp': exp,
        'iat': now
    }
    return jwt.encode(payload, 'refresh_secret', algorithm='HS256')

def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'refresh_secret', algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('Token has expired')
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed('Invalid token')
    except:
        raise exceptions.AuthenticationFailed('Unauthenticated')
