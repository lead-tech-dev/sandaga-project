import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Close from "../../assets/icons/Close";
import Resizer from "react-image-file-resizer";
import {ADS_IMAGE_URL} from "../../hooks/useConfig";

interface FileProps {
  fileNumber: string;
  handleAddFile: (option: {
    label: string;
    value: string | File | Blob | ProgressEvent<FileReader>;
  }) => void;
  handleRemoveData: (label: string) => void;
  annonceFiles: any;
}
const File: FunctionComponent<FileProps> = ({
  fileNumber,
  handleAddFile,
  handleRemoveData,
  annonceFiles,
}) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [resizedImage, setResizedImage] = useState<{
    resizedImage: string | File | Blob | ProgressEvent<FileReader>;
  }>({ resizedImage: "" });

  useEffect(() => {
   // resizeImage(annonceFiles);
  }, [annonceFiles]);

  const callback = useCallback(
    (newFileUri: string | File | Blob | ProgressEvent<FileReader>) => {
      setResizedImage({ resizedImage: newFileUri });
    },
    [],
  );

  const resizeImage = (imageFile: File) => {
    try {
      Resizer.imageFileResizer(imageFile, 150, 150, "JPEG", 100, 0, callback);
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileNumber: string,
  ) => {
    if (e.target.files) {
      handleAddFile({ label: fileNumber, value: e.target.files[0] });
    }
  };

  const handleImageRemove = (fileNumber: string) => {
    fileNumber && handleRemoveData(fileNumber);
    setImage(null);
  };

  console.log(annonceFiles)

  return (
    <div className=" nice-input-upload">
      <input
        type="file"
        onChange={(e) => handleFileChange(e, fileNumber)}
        className="form-control-file text-primary font-weight-bold"
        data-title={`${fileNumber}`}
        value=""
      />
      {annonceFiles && (
        <div className="image">
          <img src={annonceFiles ? ADS_IMAGE_URL + annonceFiles : resizedImage.resizedImage.toString()} alt="" />
          <Close onClick={() => handleImageRemove(fileNumber)} />
        </div>
      )}
    </div>
  );
};

export default File;
