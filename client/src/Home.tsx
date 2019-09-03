import { unprotect } from "mobx-state-tree";
import { observer } from "mobx-react";
import MetaMask from "./components/MetaMask";
import TextInput from "./components/TextInput";
import SelectInput from "./components/SelectInput";
import Button from "./components/Button";
import HomeModel from "./models/Home";
import enigmaStore from "./stores/enigma";

const homeStore = HomeModel.create();
unprotect(homeStore);

const Home = observer(() => (
  <div className="container">
    <MetaMask />

    <div className="body">
      <div className="title">
        Submit Your Quote
        {/* <p>
        Encrypted Secret Benchmarking using the{" "}
        <a href="https://enigma.co/">Enigma Protocol</a>
      </p> */}
      </div>
      <Button
        onClick={homeStore.getNames}
        disabled={!enigmaStore.isInstalled}
        loading={homeStore.getNamesTx.status === "PENDING"}
        undertext={
          homeStore.getNamesTx.status === "FAILURE"
            ? "Something went bad, please retry"
            : ""
        }
        style={{ width: "10vw", marginTop: "2vh" }}
      >
        Fetch Tasks
      </Button>
      <SelectInput
        label="Select Task"
        options={{
          ids: homeStore.ids,
          values: homeStore.names
        }}
        selected={homeStore.selected}
        onSelect={e => (homeStore.selected = e.target.value)}
      />

      <TextInput
        label="Hourly Rate"
        type="number"
        value={homeStore.hourlyRate}
        onChange={e => (homeStore.hourlyRate = e.target.value)}
      />
      <TextInput
        label="Total Hours"
        type="number"
        value={homeStore.totalHours}
        onChange={e => (homeStore.totalHours = e.target.value)}
      />
    </div>
    <Button
      disabled={!homeStore.canCalcPercentile || !enigmaStore.isInstalled}
      onClick={homeStore.calcPercentile}
      loading={homeStore.calcPercentileTx.status === "PENDING"}
      undertext={
        homeStore.calcPercentileTx.status === "FAILURE"
          ? "Something went bad, please retry"
          : ""
      }
    >
      GO
    </Button>

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
));

export default Home;
