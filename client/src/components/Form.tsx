import { ReactChildren, Children } from "react";
import TextInput from "./TextInput";

interface IForm {
  labels: string[];
  children?: any;
}

const Form = ({ labels, children }: IForm) => (
  <div className="form">
    <div className="inputs">
      {labels.map(function returnInput(label) {
        return <TextInput label={label} key={label} />;
      })}
    </div>
    {children}

    <style jsx>{`
      .form {
        display: flex;
        height: 35vh;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }
    `}</style>
  </div>
);

export default Form;
