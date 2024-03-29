import numeral from "numeral";
import { useDropzone } from "react-dropzone";
import React, { useState, useCallback } from "react";

export function DisplayCount(props) {
  return (
    <span className={props.className}>
      {numeral(props.children).format("0a")}
    </span>
  );
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const Dropzone = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="d-flex justify-content-center">
      <input {...getInputProps()} />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 border"
          style={{ width: "45%" }}
        ></img>
      ) : (
        <div
          className="d-flex justify-content-center border rounded p-2 col-5 pointer2"
          style={{ height: "25px" }}
        >
          <p className="font9 text-white">
            Drag and drop an image here, or click to select one
          </p>
        </div>
      )}
    </div>
  );
};
