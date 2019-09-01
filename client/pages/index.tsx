import Header from "../src/components/Header";
import TextInput from "../src/components/TextInput";
import Button from "../src/components/Button";
import Link from "next/link";

export default () => (
  <div className="container">
    <Header homepage={true} />

    <div className="body">
      <div className="title">
        Submit Your Quote
        {/* <p>
        Encrypted Secret Benchmarking using the{" "}
        <a href="https://enigma.co/">Enigma Protocol</a>
      </p> */}
      </div>
      <TextInput label="Select Task" />
      <TextInput label="Hourly Rate" />
      <TextInput label="Total Hours" />
    </div>
    <Link href={`/results`} scroll={false}>
      <Button>GO</Button>
    </Link>

    <style jsx>{`
      .body {
        height: 65vh;
        justify-content: flex-start;
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: 8vh;
      }
      a {
        color: #e72a9b;
        text-decoration: none;
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
    <style global jsx>{`
      body {
        background-color: #001c3d;
        margin: none;
        padding: none;
      }
    `}</style>
  </div>
);
