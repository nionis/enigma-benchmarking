import { unprotect } from "mobx-state-tree";
import { observer } from "mobx-react";
import TextInput from "./components/TextInput";
import SelectInput from "./components/SelectInput";
import Button from "./components/Button";
import HomeModel from "./models/Home";
import enigmaStore from "./stores/enigma";

const homeStore = HomeModel.create();
unprotect(homeStore);

const Home = observer(() => (
  <div className="container">
    <div className="body">
      <div className="title">Submit Your Quote</div>
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
        label="Rate"
        type="number"
        value={homeStore.rate || ""}
        onChange={e => (homeStore.rate = e.target.value)}
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
        height: 45vh;
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
