import numeral from 'numeral'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'


export function DisplayCount(props) {
    return <span className={props.className}>{numeral(props.children).format("0a")}</span>
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
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

    const response = await fetch('/api/posts/create/', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    return data.url;
}

export const Dropzone = () => {
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const url = await uploadImage(file);
        console.log(url);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop an image here, or click to select an image</p>
        </div>
    );
};

