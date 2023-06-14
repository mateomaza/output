import numeral from 'numeral';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

export function DisplayCount(props) {
  return (
    <span className={props.className}>
      {numeral(props.children).format('0a')}
    </span>
  );
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch('http://localhost:8000/api/posts/create/', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  return data.url;
};

export const Dropzone = () => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const url = await uploadImage(file);
    console.log(url);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  console.log(preview);

  return (
    <div {...getRootProps()} className='d-flex justify-content-center'>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt='Preview' className='mt-4 border' style={{ width: '45%' }}></img>
      ) : (
        <div className='d-flex justify-content-center border rounded p-2 col-5 pointer2' style={{ height: '25px' }}>
          <p className='font9 text-white'>Drag and drop an image here, or click to select one</p>
        </div>
      )}
    </div>
  );
};