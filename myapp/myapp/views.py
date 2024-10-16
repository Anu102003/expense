from django.http import JsonResponse
import logging

def message(request):
    logger=logging.getLogger("Testing")
    logger.debug(f'!!justing logging...')
    return JsonResponse({"Message" : "Hello"})