import Link from "next/link";
import SvgIcon from "./SvgIcon";
import { isSSR } from "../utils"

interface IHeaderProps {
  path?: string;
}

const Header = ({ path }: IHeaderProps) => {
  const pathIsHomepage = path === "/";
  const atHomepage = pathIsHomepage || (!isSSR && window.location.pathname === "/");

  return (
    <div className="header">
      <Link href={`/`} prefetch>
        <img
          src="/static/images/enigma_logo.png"
          alt="Enigma Logo"
          width="125"
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link href={atHomepage ? `/upload` : `/`} prefetch>
        <div style={{ width: "50px", height: "50px" }}>
          {atHomepage ? (
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
  )
}

export default Header;
