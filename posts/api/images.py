

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

import os
import magic
import pyclamd
from PIL import Image
import requests
from io import BytesIO

from rest_framework.response import Response
from rest_framework.decorators import api_view

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from googleapiclient.http import MediaFileUpload


MAX_FILE_SIZE = 10 * 1024 * 1024


@api_view(['GET', 'POST'])
def resize_image(request):
    if request.FILES['image']:
        image_file = request.FILES['image']
        try:
            validate_image(image_file)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)
        image = Image.open(image_file)
        resized_image = image.resize((800, 800))
        filename = f'{settings.MEDIA_ROOT}/resized/{image_file.name}'
        path = default_storage.save(filename, ContentFile(resized_image))
        url = f'{settings.MEDIA_URL}{path}'
        return Response({'url': url})
    return Response({'error': 'No image uploaded'}, status=400)


def validate_image(image_file):
    response = requests.get(image_file)
    if response.status_code != 200:
        raise ValueError('Failed to download the image.')
    with Image.open(BytesIO(response.content)) as img:
        mime_type = magic.Magic(mime=True).from_buffer(response.content)
        if 'image' not in mime_type:
            raise ValueError(
                'Invalid file type. Only image files are allowed.')
        if len(response.content) > MAX_FILE_SIZE:
            raise ValueError('File size exceeds the maximum allowed limit.')
        try:
            img.verify()
        except:
            raise ValueError('Invalid image format.')
        with magic.Magic() as m:
            file_type = m.id_buffer(response.content)
            if not file_type.startswith('image/'):
                raise ValueError(
                    'Invalid file type. Only image files are allowed.')
        clamd = pyclamd.ClamdUnixSocket()
        scan_result = clamd.scan_stream(response.content)
        if scan_result:
            raise ValueError('Virus detected in the image.')



SCOPES = ['https://www.googleapis.com/auth/drive.file']
cred = Credentials.from_authorized_user_file('/path/to/credentials.json', SCOPES)

def upload_to_google_drive(image_file):
    filename = os.path.basename(image_file)
    try:
        service = build('drive', 'v3', credentials=cred)

        file_metadata = {'name': filename}
        media = MediaFileUpload(image_file, mimetype='image/jpeg')

        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print(f'File ID: {file.get("id")}')
    except HttpError as error:
        print(f'An error occurred: {error}')
        file = None
    return file.get('id')