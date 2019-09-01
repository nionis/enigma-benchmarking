import { ReactChildren } from "react";

interface ITextInput {
  label: string;
}

const TextInput = ({ label }: ITextInput) => (
  <div className="textInput">
    <div className="label">{label}</div>
    <input className="text" name="address" type="text" />

    <style jsx>{`
      .textInput {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .label {
        margin-top: 5vh;
        margin-bottom: 2vh;
        width: 25vh;
        justify-content: center;
        display: flex;
        font-size: calc(12px + 0.6vw);
      }
      .text {
        height: 4vh;
        width: 40vh;
        border-radius: 12px;
        border: 1px solid #000000;
      }
    `}</style>
  </div>
);

export default TextInput;
