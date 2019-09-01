import { ReactChildren } from "react";
import SvgIcon from "./SvgIcon";
import Link from "next/link";

interface IHeader {
  homepage: boolean;
}

const Header = ({ homepage }: IHeader) => (
  <div className="header">
    <img
      src="/static/images/enigma_logo.png"
      alt="Enigma Logo"
      width="125"
      style={{ cursor: "pointer" }}
    />
    <Link href={homepage ? `/upload` : `/`} scroll={false}>
      <div style={{ width: "50px", height: "50px" }}>
        {homepage ? (
          <SvgIcon clickable={true} icon="add" />
        ) : (
          <SvgIcon clickable={true} icon="clear" />
        )}
      </div>
    </Link>

    <style jsx>{`
      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 90vw;
        margin-bottom: 1vh;
        margin-top: 1vh;
      }
    `}</style>
  </div>
);

export default Header;
