import Header from "../src/components/Header";
import TextInput from "../src/components/TextInput";
import Button from "../src/components/Button";
import { ArrowDownward } from "@material-ui/icons";

const arrowStyle = {
  fill: "rgba(255, 255, 255, 0.51)",
  width: "7vw",
  height: "12vh"
};

export default () => (
  <div className="container">
    <Header homepage={false} />

    <div className="body">
      <div className="title">Upload Data</div>
      <TextInput label="Data Title" />
      <div className="text">Import a File</div>
      <div className="smallText">(.json, etc, etc, etc)</div>
      <div className="middle">
        <div className="side" />
        <div className="fileUpload">
          <div className="border">
            <div className="arrowContainer">
              <div className="sidebars" />
              <ArrowDownward style={arrowStyle} />
              <div className="sidebars" />
            </div>
            <div className="line" />
            <div className="fileText">Please select a file</div>
          </div>
        </div>
        <div className="side">
          <img
            src="/static/images/spreadsheet.jpg"
            alt="spreadsheet"
            // width="50"
            style={{ borderRadius: "10px", height: "9vh", overflow: "hidden" }}
          />
        </div>
      </div>
    </div>
    <Button>GO</Button>
    <style jsx>{`
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
        flex-direction: row;
        width: 20vw;
      }
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
      .fileUpload {
        background: rgba(0, 62, 134, 0.2);
        border-radius: 20px;
        height: 25vh;
        width: 65vh;
        justify-content: center;
        align-items: center;
        display: flex;
        margin-top: 2vh;
      }
      .border {
        border: 1px dashed rgba(255, 255, 255, 0.51);
        height: 23vh;
        width: 63vh;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
    <style global jsx>{`
      body {
        background-color: #001c3d;
        margin: none;
        padding: none;
      }
    `}</style>
  </div>
);
