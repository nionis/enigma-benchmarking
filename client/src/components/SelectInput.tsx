interface ISelectInputProps {
  label: string;
  options: {
    ids: string[];
    values: string[];
  };
  selected?: string;
  onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput = ({
  label,
  options,
  selected,
  onSelect
}: ISelectInputProps) => (
  <div className="textInput">
    <div className="label">{label}</div>
    <select
      className="select"
      name="options"
      value={selected ? selected : ""}
      onChange={onSelect}
    >
      {options.ids.length === 0 ? (
        <option value="" disabled>
          No tasks found
        </option>
      ) : null}
      {options.ids.map((id, index) => (
        <option className="option" value={id} key={id}>
          {options.values[index]}
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
        margin-top: 3vh;
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
