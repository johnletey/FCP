import { ActionInterface, InvokeInterface, StateInterface } from "../faces";

declare const ContractAssert: any;
declare const SmartWeave: any;

export const Invoke = (state: StateInterface, action: ActionInterface) => {
  const foreignCalls = state.foreignCalls;
  // const caller = action.caller;

  const input: InvokeInterface = action.input;
  const contract = input.contract;
  const invocation = input.invocation;

  ContractAssert(contract, "Caller did not supply a contract.");
  ContractAssert(invocation, "Caller did not supply an invocation.");

  foreignCalls.push({
    txID: SmartWeave.transaction.id,
    contract,
    input: invocation,
  });

  return { ...state, foreignCalls };
};
