

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image

from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET', 'POST'])
def resize_image(request):
    if request.FILES['image']:
        image_file = request.FILES['image']
        image = Image.open(image_file)
        resized_image = image.resize((800, 800))
        filename = f"{settings.MEDIA_ROOT}/resized/{image_file.name}"
        path = default_storage.save(filename, ContentFile(resized_image))
        url = f"{settings.MEDIA_URL}{path}"
        return Response({'url': url})
    return Response({'error': 'No image uploaded'}, status=400)