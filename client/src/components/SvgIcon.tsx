import { Add, Clear, Done } from "@material-ui/icons"

interface ISvg {
  clickable: boolean;
  icon: string;
  onClick?: any;
}

const style = {
  fill: "white",
  width: "5.5vh",
  height: "5.5vh"
};

const clickableStyle = {
  ...style,
  cursor: "pointer"
};

function getIcon(clickable: boolean, icon: string) {
  if (icon === "add") {
    return <Add style={clickable ? clickableStyle : style} />;
  }
  if (icon === "clear") {
    return <Clear style={clickable ? clickableStyle : style} />;
  }
  if (icon === "done") {
    return <Done style={clickable ? clickableStyle : style} />;
  }
}

const SvgIcon = ({ clickable, icon, onClick }: ISvg) => (
  <div>
    {getIcon(clickable, icon)}
    <style jsx>{``}</style>
  </div>
);

export default SvgIcon;
