

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

import magic
import pyclamd
import imghdr
from PIL import Image

from rest_framework.response import Response
from rest_framework.decorators import api_view

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from googleapiclient.http import MediaFileUpload


MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_FORMATS = ('JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'SVG')


def resize_image(image_file):
    try:
        validate_image(image_file)
    except ValueError as e:
        return None
    image = Image.open(image_file)
    try:
        resized_image = image.resize((800, 800))
    except Exception as e:
        return None
    filename = f'{settings.MEDIA_ROOT}/resized/resized_{image_file.name}'
    path = default_storage.save(filename, ContentFile(resized_image))
    url = f'{settings.MEDIA_URL}{path}'
    return url


def validate_image(image_file):
    file_format = imghdr.what(image_file)
    if file_format not in ALLOWED_FORMATS:
        raise ValueError(f'Invalid image format. Only {", ".join(ALLOWED_FORMATS)} files are allowed.')
    mime_type = magic.Magic(mime=True).from_buffer(image_file.read())
    if 'image' not in mime_type:
        raise ValueError('Invalid file type. Only image files are allowed.')
    if image_file.size > MAX_FILE_SIZE:
        raise ValueError('File size exceeds the maximum allowed limit.')
    try:
        image_file.seek(0)
        Image.open(image_file).verify()
    except:
        raise ValueError('Invalid image format.')
    with magic.Magic() as m:
        image_file.seek(0)
        file_type = m.id_buffer(image_file.read())
        if not file_type.startswith('image/'):
            raise ValueError('Invalid file type. Only image files are allowed.')
    clamd = pyclamd.ClamdUnixSocket()
    image_file.seek(0)
    scan_result = clamd.scan_stream(image_file.read())
    if scan_result:
        raise ValueError('Virus detected in the image.')