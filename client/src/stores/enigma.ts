import { reaction } from "mobx"
import Enigma from "../models/Enigma";
import web3Store from "./web3"

const enigma = Enigma.create()

reaction(() => web3Store.account, () => {
  enigma.init().catch(console.error)
})

export default enigma;
