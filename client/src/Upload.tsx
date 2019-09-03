import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { observer } from "mobx-react";
import { ArrowDownward } from "@material-ui/icons";
import { FileWithPath } from "file-selector";
import TextInput from "./components/TextInput";
import Button from "./components/Button";
import UploadModel, { AcceptedFormatsList } from "./models/Upload";

const uploadStore = UploadModel.create();

const MyDropzone = observer(() => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    uploadStore.setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/json, .csv"
  });

  const failure = (
    uploadStore.input_status === "REJECTED" ||
    uploadStore.reader_status === "REJECTED" ||
    uploadStore.transaction.status === "FAILURE"
  );

  return (
    <div className="fileUpload" {...getRootProps()}>
      <div className="border">
        <div className="arrowContainer">
          <div className="sidebars" />
          <ArrowDownward
            style={{
              fill: "rgba(255, 255, 255, 0.51)",
              width: "7vw",
              height: "12vh"
            }}
          />
          <div className="sidebars" />
          <input {...getInputProps()} />
        </div>
        <div className="line" />
        <div className="fileText">Please select a file</div>
      </div>
      <style jsx>{`
        .fileText {
          font-size: calc(12px + 0.3vw);
          color: rgba(255, 255, 255, 0.51);
        }
        .arrowContainer {
          justify-content: space-between;
          align-items: flex-end;
          display: flex;
          flex-direction: row;
          width: 14vw;
        }
        .line {
          background: rgba(255, 255, 255, 0.51);
          height: 1vh;
          width: 14vw;
          margin-bottom: 2vh;
        }
        .sidebars {
          background: rgba(255, 255, 255, 0.51);
          height: 4vh;
          width: 1vh;
        }

        .fileUpload {
          background: rgba(0, 62, 134, 0.2);
          border-radius: 20px;
          height: 25vh;
          width: 65vh;
          justify-content: center;
          align-items: center;
          display: flex;
          margin-top: 2vh;
          cursor: pointer;
        }
        .border {
          border: 1px dashed ${failure ? "red" : "rgba(255, 255, 255, 0.51)"};
          height: 23vh;
          width: 63vh;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
});

const Upload = observer(() => (
  <div className="container">
    <div className="body">
      <div className="title">Upload Data</div>
      <TextInput
        label="Data Title"
        value={uploadStore.name}
        onChange={e => uploadStore.setName(e.target.value)}
      />
      <div className="text">Import a File</div>
      <div className="smallText">({AcceptedFormatsList.join(", ")})</div>
      <div className="middle">
        <div className="side" />
        <MyDropzone />
        <div className="side">
          <div className="exampleText">Example</div>
          <a
            href="https://docs.google.com/spreadsheets/d/1Y7L5oxdPaHkUHjywM9vkALWlJZ_yeLmDYSmADO4zWfg/edit?usp=sharing"
            target="_blank"
          >
            <img
              src="/static/images/spreadsheet.png"
              alt="spreadsheet"
              style={{
                borderRadius: "10px",
                height: "9vh",
                overflow: "hidden",
                cursor: "pointer"
              }}
            />
          </a>
        </div>
      </div>
    </div>
    <Button
      onClick={uploadStore.upload}
      disabled={!uploadStore.canUpload}
      loading={uploadStore.transaction.status === "PENDING"}
      undertext={
        uploadStore.transaction.status === "FAILURE"
          ? "Something went bad, please retry"
          : ""
      }
    >
      GO
    </Button>

    <style jsx>{`
      .exampleText {
        font-size: calc(12px + 0.3vw);
        margin-bottom: 2vh;
      }
      .middle {
        justify-content: space-around;
        align-items: center;
        display: flex;
        flex-direction: row;
      }
      .side {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;

        width: 20vw;
      }
      .text {
        margin-top: 4vh;
        font-size: calc(12px + 0.6vw);
      }
      .smallText {
        font-size: calc(12px + 0.2vw);
      }
      .body {
        height: 65vh;
        justify-content: flex-start;
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: 8vh;
      }
      .title {
        display: flex;
        justify-content: center;
        margin-top: 3vh;
        margin-bottom: 2vh;
        font-size: calc(12px + 1vw);
      }
      .container {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        margin: none;
        color: white;
        padding-left: 10vh;
        padding-right: 10vh;
        padding-top: 0;
        padding-bottom: 0;
      }
    `}</style>
  </div>
));

export default Upload;
