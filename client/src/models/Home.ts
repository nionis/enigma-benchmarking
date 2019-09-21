import Router from 'next/router'
import { types, flow } from "mobx-state-tree"
import EnigmaTransaction from "./EnigmaTransaction"
import web3Store from "../stores/web3"
import enigmaStore from "../stores/enigma"
import { getDatasetsInfo, rawUint256ToStr } from "../utils"

const Model = types.model("Home", {
  datasets: types.map(types.string),
  selected: types.maybeNull(types.string),
  rate: types.maybeNull(types.string),
  getNamesTx: types.optional(EnigmaTransaction, {}),
  calcPercentileTx: types.optional(EnigmaTransaction, {}),
})
  .views(self => ({
    get ids() {
      return Array.from(self.datasets.keys());
    },
    get names() {
      return Array.from(self.datasets.values());
    },
    get canCalcPercentile() {
      return (
        self.selected &&
        self.rate &&
        self.rate.length > 0
      );
    }
  }))
  .actions(self => ({
    getNames: flow(function* () {
      let result;

      try {
        result = yield self.getNamesTx.run(enigmaStore.getEnigma(), {
          fn: "get_datasets_info()",
          args: "",
          userAddr: web3Store.account,
          contractAddr: enigmaStore.enigmaContractAddress
        })
      } catch (err) {
        return;
      }

      const { ids, names } = getDatasetsInfo(result.decryptedOutput);

      self.datasets.clear();

      ids.forEach((id, index) => {
        self.datasets.set(id, names[index]);
      })

      self.selected = ids[0];
    }),
    calcPercentile: flow(function* () {
      const { selected, rate } = self;

      let result;

      try {
        result = yield self.calcPercentileTx.run(enigmaStore.getEnigma(), {
          fn: "calc_percentile(uint256, uint256, uint256)",
          args: [
            [selected, "uint256"],
            [rate, "uint256"]
          ],
          userAddr: web3Store.account,
          contractAddr: enigmaStore.enigmaContractAddress
        })
      } catch (err) {
        return;
      }

      const percentile = rawUint256ToStr(result.decryptedOutput);

      yield Router.push({
        pathname: '/result', query: {
          name: self.datasets.get(selected),
          rate,
          percentile
        }
      })
    })
  }))

export default Model