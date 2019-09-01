import Link from "next/link";
import Header from "./components/Header";
import TextInput from "./components/TextInput";
import SelectInput from "./components/SelectInput";
import Button from "./components/Button";

const Home = () => (
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
      <SelectInput label="Select Task" options={["option1", "option2"]} />
      <TextInput label="Hourly Rate" number={true} />
      <TextInput label="Total Hours" number={true} />
    </div>
    <Link href={`/result`} scroll={false}>
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
  </div>
);

export default Home;
