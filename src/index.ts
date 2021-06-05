import { ActionInterface, ReadOutboxInterface, StateInterface } from "./faces";
import { Invoke } from "./modules/invoke";
// import { ReadOutbox } from "./modules/readOutbox";
import { Transfer } from "./modules/transfer";

declare const ContractAssert: any;
declare const SmartWeave: any;

export async function handle(state: StateInterface, action: ActionInterface) {
  switch (action.input.function) {
    case "transfer":
      return { state: Transfer(state, action) };

    // FCP Functions
    case "readOutbox":
      // return { state: ReadOutbox(state, action) };
      let newState = state;
      const invocations = newState.invocations;

      const input: ReadOutboxInterface = action.input;
      const contract = input.contract;
      ContractAssert(contract, "Caller did not supply a contract.");

      const foreignState: StateInterface =
        await SmartWeave.contracts.readContractState(input.contract);
      ContractAssert(
        foreignState.foreignCalls,
        "Contract does not support foreign calls."
      );

      const unhandledCalls = foreignState.foreignCalls.filter(
        (entry) =>
          entry.contract === SmartWeave.contract.id &&
          !invocations.includes(entry.txID)
      );

      for (const call of unhandledCalls) {
        const res = await handle(newState, {
          caller: contract,
          input: call.input,
        });

        newState = res.state;
        invocations.push(call.txID);
      }

      return { state: { ...newState, invocations } };

    case "invoke":
      return { state: Invoke(state, action) };
  }
}
