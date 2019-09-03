import { types, flow } from "mobx-state-tree";
import web3Store from "../stores/web3";
import { isSSR } from "../utils";

const Model = types
  .model("Enigma", {
    isInstalled: types.maybeNull(types.boolean),
    enigmaAddress: types.maybeNull(types.string),
    enigmaTokenAddress: types.maybeNull(types.string),
    enigmaContractAddress: types.maybeNull(types.string)
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
    init: flow(function*() {
      if (isSSR) return;
      if (!web3Store.isLoggedIn) return;

      const [Enigma, EnigmaContract, EnigmaTokenContract] = yield Promise.all([
        import("enigma-js").then(d => d.Enigma),
        import("../../../build/enigma_contracts/EnigmaSimulation.json").then(
          d => d.default
        ),
        import("../../../build/enigma_contracts/EnigmaToken.json").then(
          d => d.default
        )
      ]);

      self.enigmaAddress = EnigmaContract.networks[web3Store.networkId].address;
      self.enigmaTokenAddress =
        EnigmaTokenContract.networks[web3Store.networkId].address;
      // FIXME: where can I get this from other than text/benchmarking.txt
      self.enigmaContractAddress =
        "0x3f130d8f687e147e47d26cb0aee43528511ede5d923da8bf0daedd72586f6540";

      const enigma = new Enigma(
        web3Store.getWeb3(),
        EnigmaContract.networks[web3Store.networkId].address,
        EnigmaTokenContract.networks[web3Store.networkId].address,
        // FIXME: dynamic url
        "http://192.168.184.210:3346",
        {
          gas: 4712388,
          gasPrice: 100000000000,
          from: web3Store.account
        }
      );

      enigma.admin();

      self.setEnigma(enigma);
      self.isInstalled = true;
      console.log("Enigma Initialized");
    })
  }));

export default Model;
