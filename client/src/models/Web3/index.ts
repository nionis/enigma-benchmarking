/*
  A store to initialize web3 and keep track of wallet data.
*/
import Web3 from "web3";
import { types, flow } from "mobx-state-tree";
import getWeb3 from "./getWeb3";
import getContract from "./getContract";
import { isSSR } from "../../utils";

const Model = types
  .model("Web3", {
    isDenied: types.maybeNull(types.boolean),
    isInstalled: types.maybeNull(types.boolean),
    account: types.maybeNull(types.string),
    networkId: types.maybeNull(types.number)
  })
  .views(self => ({
    get isLoggedIn() {
      return self.account !== null;
    },
    get network() {
      if (self.networkId === 1) {
        return "mainnet";
      } else if (self.networkId === 2) {
        return "morden";
      } else if (self.networkId === 3) {
        return "ropsten";
      } else if (self.networkId === 4) {
        return "rinkeby";
      } else if (self.networkId === 5) {
        return "goerli";
      } else if (self.networkId === 42) {
        return "kovan";
      } else if (self.networkId === 1337) {
        return "geth private";
      }

      return "unknown network";
    }
  }))
  .actions(self => {
    let web3: Web3 | undefined;

    return {
      _getWeb3() {
        return web3;
      },
      getWeb3() {
        if (!web3) {
          throw Error("web3 not initialized");
        }

        return web3;
      },
      setWeb3(_web3: Web3) {
        web3 = _web3;
      }
    };
  })
  .actions(self => ({
    sync: flow(function*() {
      if (isSSR) {
        return;
      }
      if (self.isDenied) {
        return;
      }

      // not found, check window
      if (!self._getWeb3()) {
        const _web3 = yield getWeb3().catch(console.error);

        if (_web3) {
          self.setWeb3(_web3);
          self.isDenied = false;
        } else {
          self.isDenied = true;
        }
      }

      const web3 = self._getWeb3();

      // not found
      if (typeof web3 === "undefined") {
        self.isInstalled = false;
        return;
      }
      if (!self.isInstalled) {
        console.log("Web3 Initialized");
      }

      self.isInstalled = true;
      self.setWeb3(web3);

      const accounts = (yield web3.eth.getAccounts()) || [];
      const networkId = yield web3.eth.net.getId();

      self.account = accounts[0] || null;
      self.networkId = networkId;
    }),

    getContract(name: Parameters<typeof getContract>["1"], address?: string) {
      const web3 = self.getWeb3();

      return getContract(web3, name, {
        networkId: self.networkId,
        address
      });
    }
  }));

export default Model;
