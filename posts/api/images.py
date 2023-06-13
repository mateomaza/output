import mimetypes
import imghdr
import pyclamd
from PIL import Image

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from googleapiclient.http import MediaFileUpload


MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_FORMATS = ('JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'SVG')




def get_drive_service():
    credentials = Credentials.from_authorized_user_file(r'C:\Users\Usuario\Documents\GitHub\keys\holi-storage-8de9a8a45d7c.json')
    service = build('drive', 'v3', credentials=credentials)
    return service


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
    drive_service = get_drive_service()
    file_metadata = {'name': f'resized_{image_file.name}'}
    mime_type, _ = mimetypes.guess_type(image_file.name)
    media = MediaFileUpload(resized_image, mimetype=mime_type)
    try:
        file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        file_id = file.get ('id')
        url = f'https://drive.google.com/uc?id={file_id}'
        return url
    except HttpError as e:
        return None


def validate_image(image_file):
    file_format = imghdr.what(image_file)
    if not file_format or not file_format.startswith('image/'):
        raise ValueError('Invalid file format. Only image files are allowed.')
    if file_format not in ALLOWED_FORMATS:
        raise ValueError(f'Invalid image format. Only {", ".join(ALLOWED_FORMATS)} files are allowed.')
    mime_type, _ = mimetypes.guess_type(image_file.name)
    if 'image' not in mime_type:
        raise ValueError('Invalid file type. Only image files are allowed.')
    if image_file.size > MAX_FILE_SIZE:
        raise ValueError('File size exceeds the maximum allowed limit.')
    try:
        image_file.seek(0)
        Image.open(image_file).verify()
    except:
        raise ValueError('Invalid image format.')
    clamd = pyclamd.ClamdUnixSocket()
    image_file.seek(0)
    scan_result = clamd.scan_stream(image_file.read())
    scan_test = clamd.scan_stream(r'C:\Users\Usuario\Documents\GitHub\virus_test.bat')
    if scan_result:
        raise ValueError('Virus detected in the image.')
    if scan_test:
        raise ValueError('Fake virus detected lol')
    

image_path = r'C:\Users\Usuario\Documents\GitHub\images\jpg.jpg'
with open(image_path, 'rb') as image_file:
    url = resize_image(image_file)
    if url:
        print(f"Image uploaded to Google Drive: {url}")
    else:
        print("Image upload failed.")