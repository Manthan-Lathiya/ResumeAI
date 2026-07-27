from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def jobs_health(request):
    return Response({'status': 'ok', 'app': 'jobs'})
