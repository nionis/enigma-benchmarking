import Web3 from "web3";
import { types, flow } from "mobx-state-tree";
import { FileWithPath } from "file-selector";
import { csvToJson } from "csvtojson-converter";
import EnigmaTransaction from "./EnigmaTransaction";
import web3Store from "../stores/web3";
import enigmaStore from "../stores/enigma";

enum AcceptedFormatsEnum {
  json = "json",
  csv = "csv"
}

const AcceptedFormatsList = Object.keys(
  AcceptedFormatsEnum
) as (keyof typeof AcceptedFormatsEnum)[];

let fileContents:
  | {
      ids: number;
      rates: number;
    }[]
  | null = null;

const storeAsJSON = (
  file: FileWithPath,
  ext: keyof typeof AcceptedFormatsEnum
): Promise<boolean> => {
  return new Promise(resolve => {
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
    };

    reader.onerror = () => {
      resolve(false);
    };
  });
};

const Model = types
  .model("Upload", {
    input_status: types.optional(
      types.enumeration(["ACCEPTED", "REJECTED", "PENDING"]),
      "PENDING"
    ),
    reader_status: types.optional(
      types.enumeration(["ACCEPTED", "REJECTED", "PENDING"]),
      "PENDING"
    ),
    errorMsg: "",
    name: "",
    fileExtension: types.maybeNull(types.enumeration(AcceptedFormatsList)),
    transaction: types.optional(EnigmaTransaction, {})
  })
  .views(self => ({
    get canUpload() {
      return (
        self.name &&
        self.name.length > 0 &&
        self.input_status === "ACCEPTED" &&
        self.reader_status === "ACCEPTED"
      );
    },
    get fileSuccess() {
      return (
        self.input_status === "ACCEPTED" || self.reader_status === "ACCEPTED"
      );
    },
    get failure() {
      return (
        self.input_status === "REJECTED" ||
        self.reader_status === "REJECTED" ||
        self.transaction.status === "FAILURE"
      );
    }
  }))
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    dropRejected() {
      self.input_status = "REJECTED";
    },
    setFile: flow(function*(file: FileWithPath) {
      try {
        self.input_status = "PENDING";
        self.reader_status = "PENDING";
        self.errorMsg = "";

        const ext: any = file.path
          .substr(file.path.lastIndexOf("\\") + 1)
          .split(".")[1];

        // is input ok
        if (!AcceptedFormatsList.includes(ext)) {
          self.input_status = "REJECTED";
          return;
        }
        self.input_status = "ACCEPTED";

        // store file
        if (!(yield storeAsJSON(file, ext))) {
          self.reader_status = "REJECTED";
          return;
        }

        // validate file
        const okLength = fileContents.length <= 1000;
        if (!okLength) {
          self.reader_status = "REJECTED";
          self.errorMsg = "dataset length is too large";
          return;
        }

        const valuesAreNumbers = fileContents.every(o => {
          return (
            o.ids && !isNaN(Number(o.ids)) && o.rates && !isNaN(Number(o.rates))
          );
        });
        if (!valuesAreNumbers) {
          self.reader_status = "REJECTED";
          self.errorMsg = "not all ids / rates are numbers";
          return;
        }

        const valuesAreRounded = fileContents.every(o => {
          return Number.isInteger(o.rates);
        });
        if (!valuesAreRounded) {
          self.reader_status = "REJECTED";
          self.errorMsg = "not all rates are rounded values";
          return;
        }

        self.reader_status = "ACCEPTED";

        if (self.name === "") {
          self.name = file.name;
        }
      } catch (err) {
        console.error(err);
        self.reader_status = "REJECTED";
      }
    }),
    upload: flow(function*() {
      if (!self.canUpload) return;

      const { ids, rates } = fileContents.reduce(
        (result, item) => {
          result.ids.push(item.ids);
          result.rates.push(item.rates);

          return result;
        },
        {
          ids: [],
          rates: []
        }
      );

      try {
        yield self.transaction.run(enigmaStore.getEnigma(), {
          fn: "add_dataset(string, uint256[], uint256[])",
          args: [
            [self.name, "string"],
            [ids, "uint256[]"],
            [rates, "uint256[]"]
          ],
          userAddr: web3Store.account,
          contractAddr: enigmaStore.enigmaContractAddress
        });
      } catch (err) {
        console.error(err);
        return;
      }
    })
  }));

export { AcceptedFormatsList };
export default Model;
