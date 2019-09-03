import Web3 from "web3"
import { types, flow } from "mobx-state-tree"
import { FileWithPath } from "file-selector";
import { csvToJson } from "csvtojson-converter"
import EnigmaTransaction from "./EnigmaTransaction"
import web3Store from "../stores/web3"
import enigmaStore from "../stores/enigma"

enum AcceptedFormatsEnum {
  json = "json",
  csv = "csv"
}

const AcceptedFormatsList = Object.keys(AcceptedFormatsEnum) as (keyof typeof AcceptedFormatsEnum)[]

let fileContents: {
  ids: number,
  total_hours: number,
  rates: number,
}[] | null = null;

const storeAsJSON = (file: FileWithPath, ext: keyof typeof AcceptedFormatsEnum): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = () => {
      try {
        if (ext === "csv") {
          fileContents = csvToJson(reader.result, ",");
        } else {
          fileContents = JSON.parse(reader.result as string);
        }

        resolve(true);
      } catch (err) {
        console.error(err);
        resolve(false);
      }
    }

    reader.onerror = () => {
      resolve(false);
    }
  })
}

const Model = types.model("Upload", {
  input_status: types.optional(types.enumeration(["ACCEPTED", "REJECTED", "PENDING"]), "PENDING"),
  reader_status: types.optional(types.enumeration(["ACCEPTED", "REJECTED", "PENDING"]), "PENDING"),
  name: "",
  fileExtension: types.maybeNull(types.enumeration(AcceptedFormatsList)),
  transaction: types.optional(EnigmaTransaction, {}),
})
  .views(self => ({
    get canUpload() {
      return self.name && self.name.length > 0 && self.input_status === "ACCEPTED" && self.reader_status === "ACCEPTED";
    }
  }))
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    setFile: flow(function* (file: FileWithPath) {
      self.input_status = "PENDING";
      self.reader_status = "PENDING";

      const ext: any = file.path.substr(file.path.lastIndexOf('\\') + 1).split('.')[1];

      // is input ok
      if (!AcceptedFormatsList.includes(ext)) {
        self.input_status = "REJECTED";
        return;
      }
      self.input_status = "ACCEPTED";

      // store file
      if (!(yield storeAsJSON(file, ext))) {
        self.reader_status = "REJECTED"
        return;
      }

      // validate file
      const okLength = fileContents.length <= 1000;
      const okValues = fileContents.every(o => (
        o.ids &&
        !isNaN(Number(o.ids)) &&
        o.total_hours &&
        !isNaN(Number(o.total_hours)) &&
        o.rates &&
        !isNaN(Number(o.rates))
      ));
      if (!okLength || !okValues) {
        self.reader_status = "REJECTED";
        return;
      }

      self.reader_status = "ACCEPTED";

      if (self.name === "") {
        self.name = file.name;
      }
    }),
    upload: flow(function* () {
      if (!self.canUpload) return;

      const {
        ids,
        total_hours,
        rates
      } = fileContents.reduce((result, item) => {
        result.ids.push(item.ids)
        result.total_hours.push(item.total_hours)
        result.rates.push(item.rates)

        return result;
      }, {
          ids: [],
          total_hours: [],
          rates: [],
        })

      try {
        yield self.transaction.run(enigmaStore.getEnigma(), {
          fn: "add_dataset(bytes32, uint256[], uint256[], uint256[])",
          args: [
            [Web3.utils.stringToHex(self.name), "bytes32"],
            [ids, "uint256[]"],
            [total_hours, "uint256[]"],
            [rates, "uint256[]"]
          ],
          userAddr: web3Store.account,
          contractAddr: enigmaStore.enigmaContractAddress
        })
      } catch (err) {
        return;
      }
    })
  }))

export { AcceptedFormatsList }
export default Model