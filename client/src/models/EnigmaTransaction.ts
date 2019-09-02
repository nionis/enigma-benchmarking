import { types, flow } from "mobx-state-tree";
import { utils, eeConstants } from 'enigma-js/node'
import { sleep } from "../utils"

interface ITransactionArgs {
  fn: string,
  args: any,
  userAddr: string,
  contractAddr: string
}

const EnigmaTransaction = types.model("EnigmaTransaction", {
  status: types.optional(types.enumeration(["EMPTY", "PENDING", "SUCCESS", "FAILURE"]), "EMPTY")
}).actions(self => ({
  run: flow(function* (enigma: any, { fn, args, userAddr, contractAddr }: ITransactionArgs) {
    self.status = "PENDING";

    let task = yield new Promise((resolve, reject) => {
      enigma.computeTask(fn, args, 10000000, utils.toGrains(1), userAddr, contractAddr)
        .on(eeConstants.SEND_TASK_INPUT_RESULT, result => resolve(result))
        .on(eeConstants.ERROR, error => reject(error));
    }).catch(err => {
      console.error(err)
      self.status = "FAILURE";
    })

    while (task.ethStatus !== 2) {
      if (task.ethStatus === 3 || task.ethStatus === 4) {
        console.log("failed")
        self.status = "FAILURE"
      }

      yield sleep(1000);
      task = yield enigma.getTaskRecordStatus(task);
    }
    self.status = "SUCCESS";

    const result = yield new Promise((resolve, reject) => {
      enigma.getTaskResult(task)
        .on(eeConstants.GET_TASK_RESULT_RESULT, (result) => resolve(result))
        .on(eeConstants.ERROR, (error) => reject(error));
    }).catch(err => {
      console.error(err)
      self.status = "FAILURE";
    })

    return enigma.decryptTaskResult(result);
  })
}));

export default EnigmaTransaction