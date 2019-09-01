import Web3 from "../models/Web3";
import { setIntervalAsync } from "../utils"

const web3 = Web3.create();

web3.sync();
setIntervalAsync(() => web3.sync(), 1e3)

export default web3;
