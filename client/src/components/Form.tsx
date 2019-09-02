import TextInput from "./TextInput";

interface IFormProps {
  children?: any;
  labels: string[];
}

const Form = ({ children, labels }: IFormProps) => (
  <div className="form">
    <div className="inputs">
      {labels.map((label) => {
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
