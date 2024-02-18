import React, {useEffect, useState, useCallback, FunctionComponent} from 'react';
import { useDropzone } from 'react-dropzone';
import './upload.style.scss';
import { UploadIcon } from '../../assets/icons/AllSvgIcon';
import Close from "../../assets/icons/Close";
import {ADS_IMAGE_URL} from "../../hooks/useConfig";

interface UploaderProps {
    imageURL?: string;
    fileNumber: string;
    handleAddFile: (option: {
        label: string;
        value: string | File | Blob | ProgressEvent<FileReader>;
    }) => void;
    handleRemoveData: (label: string, id: string) => void;
    adFiles: any;
    fileData?: any;
}

const Uploader: FunctionComponent<UploaderProps> = ({ fileData,imageURL, handleRemoveData, fileNumber, handleAddFile, adFiles }: any) => {
    const [files, setFiles] = useState(imageURL ? [{ name: 'demo', preview: imageURL }] : []
    );

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );
    const onChange = (file: any) => {
        handleAddFile({ label: `Photo ${Object.keys(fileData).length + 1}`, value: file[0] });
    }
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
        'image/jpeg': ['.jpeg']
        },
        multiple: false,
        onDrop: useCallback(
            (acceptedFiles: File[]) => {
                setFiles(
                    acceptedFiles.map((file: File) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                );
                onChange(acceptedFiles);
            },
            [onChange]
        ),
    });

    const thumbs = adFiles && adFiles.preview ? (

            <div className="thumbs" key={adFiles.name}>
                <div className="thumbs-inner">
                    <img src={adFiles.preview} alt={adFiles.name} />
                </div>
            </div>

    ) : adFiles && (
            <div className="thumbs">
                <div className="thumbs-inner">
                    <img src={ADS_IMAGE_URL + adFiles.name } alt=""/>
                </div>
            </div>
    );

    const handleImageRemove = (fileNumber: string) => {
        fileNumber && handleRemoveData(fileNumber, adFiles.id);
        setFiles([])
    };


    return (
        <div className="uploader">
            <div className="upload-wrapper" {...getRootProps()}>
                <input {...getInputProps()} />
                <UploadIcon />
                <span className="text">
                    <span className="text-highlighted"></span> {fileNumber}
                </span>
                {adFiles && (
                    <div className="thumbs-wrapper">
                        {thumbs}
                    </div>
                )}
            </div>
            {adFiles && (
                <div className="close">
                    <Close onClick={() => handleImageRemove(fileNumber)} />
                </div>
            )}
        </div>
    );
};

export default Uploader;
