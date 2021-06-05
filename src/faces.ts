export interface StateInterface {
  name: string;
  ticker: string;
  balances: { [address: string]: number };

  // FCP
  invocations: string[];
  foreignCalls: { txID: string; contract: string; input: any }[];
}

export interface ActionInterface {
  input: any;
  caller: string;
}

// Module Faces

export interface InvokeInterface {
  function: "invoke";
  contract: string;
  invocation: any;
}

export interface ReadOutboxInterface {
  function: "readOutbox";
  contract: string;
}

export interface TransferInterface {
  function: "transfer";
  target: string;
  qty: number;
}
