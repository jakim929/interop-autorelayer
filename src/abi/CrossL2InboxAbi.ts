export const CrossL2InboxAbi = [
  {
    type: 'function',
    name: 'blockNumber',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'chainId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'executeMessage',
    inputs: [
      {
        name: '_id',
        type: 'tuple',
        internalType: 'struct ICrossL2Inbox.Identifier',
        components: [
          { name: 'origin', type: 'address', internalType: 'address' },
          { name: 'blockNumber', type: 'uint256', internalType: 'uint256' },
          { name: 'logIndex', type: 'uint256', internalType: 'uint256' },
          { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
          { name: 'chainId', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: '_target', type: 'address', internalType: 'address' },
      { name: '_message', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'logIndex',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'origin',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'validateMessage',
    inputs: [
      {
        name: '_id',
        type: 'tuple',
        internalType: 'struct ICrossL2Inbox.Identifier',
        components: [
          { name: 'origin', type: 'address', internalType: 'address' },
          { name: 'blockNumber', type: 'uint256', internalType: 'uint256' },
          { name: 'logIndex', type: 'uint256', internalType: 'uint256' },
          { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
          { name: 'chainId', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: '_msgHash', type: 'bytes32', internalType: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ExecutingMessage',
    inputs: [
      {
        name: 'msgHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'id',
        type: 'tuple',
        indexed: false,
        internalType: 'struct ICrossL2Inbox.Identifier',
        components: [
          { name: 'origin', type: 'address', internalType: 'address' },
          { name: 'blockNumber', type: 'uint256', internalType: 'uint256' },
          { name: 'logIndex', type: 'uint256', internalType: 'uint256' },
          { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
          { name: 'chainId', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'InvalidChainId', inputs: [] },
  { type: 'error', name: 'InvalidTimestamp', inputs: [] },
  { type: 'error', name: 'NotEntered', inputs: [] },
  { type: 'error', name: 'ReentrantCall', inputs: [] },
  { type: 'error', name: 'TargetCallFailed', inputs: [] },
] as const
