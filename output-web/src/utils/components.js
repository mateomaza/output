import numeral from 'numeral'
import { useDropzone } from 'react-dropzone'
import { useState } from 'react';
import axios from 'axios';


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

export function MyDropzone() {
    const [files, setFiles] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.map(file => (
        <div key={file.name}>
            <div>
                <img
                    src={file.preview}
                    alt={file.name}
                />
            </div>
            <div>
                {file.name}
            </div>
        </div>
    ));

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <div>{thumbs}</div>
        </div>
    );
}

export function Dropzone() {
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleDrop = async (files) => {
        const formData = new FormData();
        formData.append('image', files[0]);
        const response = await axios.post('/api/upload/', formData);
        setUploadedFile(response.data);
    };

    return (
        <MyDropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {uploadedFile ? (
                        <img src={uploadedFile} alt="Uploaded file" />
                    ) : (
                        <p>Drag and drop an image here, or click to select a file</p>
                    )}
                </div>
            )}
        </MyDropzone>
    );
}