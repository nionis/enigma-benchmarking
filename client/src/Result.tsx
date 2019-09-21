import Link from "next/link";
import Button from "./components/Button";
import { getNumberWithOrdinal } from "./utils";

interface IResultProps {
  name?: string;
  rate?: string;
  percentile?: string;
}

const Result = ({ name, rate, percentile }: IResultProps) => (
  <div className="container">
    <div className="body">
      <div className="title">Results</div>
      <div className="bar">
        <div className="percentile" />
      </div>
      <div className="title">
        Your quote is in the {getNumberWithOrdinal(Number(percentile))}{" "}
        percentile
      </div>

      <div className="quoteInfo">
        {" "}
        <div className="text">{name}</div>
        <div className="text">input: {rate}</div>
      </div>
    </div>
    <Link href={`/`} prefetch>
      <Button>Done</Button>
    </Link>
    <style jsx>{`
      .quoteInfo {
        margin-top: 4vh;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
      }
      .text {
        font-size: calc(12px + 0.5vw);
        margin-top: 2vh;
      }
      .bar {
        height: 5vh;
        width: 75.3vw;
        background: #003e86;
        justify-content: flex-start;
        align-items: center;
        display: flex;
        margin-top: 5vh;
        margin-bottom: 5vh;
      }

      .percentile {
        height: 8vh;
        width: 0.5vh;
        background: #e72a9b;
        margin-left: ${(Number(percentile) * 75) / 100}vw;
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
        display: flex;
        justify-content: center;
        align-items: center;
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
);

export default Result;
