import {
	createPublicClient,
	createWalletClient,
	decodeFunctionData,
	defineChain,
	http,
	parseEventLogs,
	type Chain,
	type PrivateKeyAccount,
	type PublicClient,
	type Transport,
	type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { L2ToL2CrossDomainMessengerAbi } from "./abi/L2ToL2CrossDomainMessengerAbi";
import { CrossL2InboxAbi } from "./abi/CrossL2InboxAbi";
import { optimism } from "viem/chains";
import { PRIVATE_KEY, RPC_URLS } from "./config";

const crossL2InboxAddress =
	"0x4200000000000000000000000000000000000022" as const;
const l2ToL2CrossDomainMessengerAddress =
	"0x4200000000000000000000000000000000000023" as const;

type ChainConfig = {
	chainId: number;
	chain: Chain;
	publicClient: PublicClient<Transport, Chain>;
	walletClient: WalletClient<Transport, Chain, PrivateKeyAccount>;
};

const createChainConfigs = async () => {
	return await Promise.all(
		RPC_URLS.map(async (rpcUrl) => {
			const publicClient = createPublicClient({
				transport: http(rpcUrl),
			});
			const chainId = await publicClient.getChainId();
			const chain = defineChain({
				id: chainId,
				name: `CHAIN_${chainId}`,
				nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
				rpcUrls: {
					default: {
						http: [rpcUrl],
					},
				},
				formatters: optimism.formatters,
			});
			return {
				chainId: chainId,
				chain: chain,
				publicClient: createPublicClient({
					transport: http(rpcUrl),
					chain,
				}),
				walletClient: createWalletClient({
					transport: http(rpcUrl),
					account: privateKeyToAccount(PRIVATE_KEY),
					chain,
				}),
			};
		}),
	);
};

async function main() {
	const chainConfigs = await createChainConfigs();
	const chainConfigByChainId: Record<number, ChainConfig> = chainConfigs.reduce(
		(acc, chainConfig) => {
			acc[chainConfig.chainId] = chainConfig;
			return acc;
		},
		{},
	);

	chainConfigs.map(({ chainId, publicClient }) => {
		console.log("Setting up listeners for chain", chainId);

		publicClient.watchEvent({
			address: l2ToL2CrossDomainMessengerAddress,
			onLogs: async (logs) => {
				// 1. Relay SentMessage events
				// SentMessage logs don't have topics
				const sentMessageEventLogs = logs.filter((x) => x.topics.length === 0);
				await Promise.all(
					sentMessageEventLogs.map(async (log) => {
						console.log("Emitted: SentMessage", log.data);

						const { functionName, args } = decodeFunctionData({
							abi: L2ToL2CrossDomainMessengerAbi,
							data: log.data,
						});

						if (functionName !== "relayMessage") {
							throw Error("Unexpected SentMessage encoding");
						}

						const [destination, source, nonce, sender, target, message] = args;

						const {
							walletClient: destinationWalletClient,
							publicClient: destinationPublicClient,
						} = chainConfigByChainId[Number(destination)];

						const block = await publicClient.getBlock({
							blockHash: log.blockHash,
						});

						const identifier = {
							origin: log.address,
							blockNumber: block.number,
							logIndex: BigInt(log.logIndex),
							timestamp: block.timestamp,
							chainId: BigInt(chainId),
						};

						const hash = await destinationWalletClient.writeContract({
							abi: CrossL2InboxAbi,
							address: crossL2InboxAddress,
							functionName: "executeMessage",
							args: [identifier, l2ToL2CrossDomainMessengerAddress, log.data],
						});

						console.log(
							`Sent executing message with tx hash [${hash}] on chain ${Number(destination)} `,
						);
						const receipt =
							await destinationPublicClient.waitForTransactionReceipt({
								hash,
							});

						console.log(
							`Executed message with tx hash [${receipt.transactionHash}] on chain ${Number(destination)} block ${receipt.blockNumber}`,
						);
					}),
				);

				// 2. Log RelayedMessage and FailedRelayedMessage events
				const eventLogs = parseEventLogs({
					abi: L2ToL2CrossDomainMessengerAbi,
					logs,
				});

				eventLogs.map((eventLog) => {
					if (eventLog.eventName === "RelayedMessage") {
						console.log("Emitted: RelayedMessage", eventLog.args);
					} else if (eventLog.eventName === "FailedRelayedMessage") {
						console.log("Emitted: FailedRelayedMessage", eventLog.args);
					}
				});
			},
		});
	});
}

main();
