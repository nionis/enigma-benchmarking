import { ReactChildren } from "react";

interface ISelectInput {
  label: string;
  options: string[];
}

const SelectInput = ({ label, options }: ISelectInput) => (
  <div className="textInput">
    <div className="label">{label}</div>
    <select className="select" name="options">
      {options.map(option => (
        <option className="option" value={option} key={option}>
          {option}
        </option>
      ))}
    </select>

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
      .select {
        height: 4vh;
        width: 40vh;
        border-radius: 12px;
        border: 1px solid #000000;
        cursor: pointer;
      }
    `}</style>
  </div>
);

export default SelectInput;
