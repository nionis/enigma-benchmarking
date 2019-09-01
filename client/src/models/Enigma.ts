import { types, flow } from "mobx-state-tree";
import web3Store from "../stores/web3"
import { isSSR } from "../utils";

const Model = types
  .model("Enigma", {
    isInstalled: types.maybeNull(types.boolean)
  })
  .actions(self => {
    let enigma: any | undefined;

    return {
      _getEnigma() {
        return enigma;
      },
      getEnigma() {
        if (!enigma) {
          throw Error("enigma not initialized");
        }

        return enigma;
      },
      setEnigma(_enigma: any) {
        enigma = _enigma;
      }
    };
  })
  .actions(self => ({
    init: flow(function* () {
      if (isSSR) return;
      if (!web3Store.isLoggedIn) return;

      const [
        Enigma,
        EnigmaContract,
        EnigmaTokenContract
      ] = yield Promise.all([
        import("enigma-js").then(d => d.Enigma),
        import('../../../build/enigma_contracts/EnigmaSimulation.json').then(d => d.default),
        import('../../../build/enigma_contracts/EnigmaToken.json').then(d => d.default),
      ]);

      const enigma = new Enigma(
        web3Store.getWeb3(),
        EnigmaContract.networks[web3Store.networkId].address,
        EnigmaTokenContract.networks[web3Store.networkId].address,
        'http://localhost:3346',
        {
          gas: 4712388,
          gasPrice: 100000000000,
          from: web3Store.account,
        },
      );

      enigma.admin();

      self.setEnigma(enigma);
      self.isInstalled = true;
    })
  }))

export default Model;