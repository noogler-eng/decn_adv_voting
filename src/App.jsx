import {
  ConnectWallet,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { useDisconnect } from "@thirdweb-dev/react";
import Proposal from "./components/Proposal";

export default function App() {
  const address = useAddress();
  const disconnect = useDisconnect();

  const [proposal, setProposal] = useState([]);
  const [proposalDescription, setProposalDescription] = useState("");

  const { contract: token_contract, isLoading: isTokenLoading } = useContract(
    "0x82885548D286e8E4E3Ae347982EA21289F442F8b"
  );
  const { contract: vote_contract, isLoading: isVoteLoading } = useContract(
    "0x97371dbB4494f711097Cde9753700e6031142d94"
  );

  const tokenBalance = useTokenBalance(token_contract, address);

  const getProposals = async () => {
    if (!address || isTokenLoading || isVoteLoading) return;

    const data = await vote_contract.getAll();
    setProposal(data);
  };

  const createProposal = async () => {
    if (proposalDescription == "") return;
    await vote_contract.propose(proposalDescription);
    window.location.reload();
  };

  const checkDelegate = async () => {
    if (!address || isTokenLoading || isVoteLoading) return;

    const delegate = await token_contract.getDelegation();
    if (delegate != address) {
      await token_contract.delegateTo(address);
      window.location.reload();
    }
  };

  useEffect(() => {
    getProposals();
  }, [address, isTokenLoading, isVoteLoading]);

  useEffect(() => {
    checkDelegate();
  }, [isTokenLoading]);

  if (!address) {
    return (
      <div className="flex w-full flex-col gap-24 items-center">
        <div className="flex justify-between items-center p-4 shadow-lg shadow-indigo-500/50 w-full">
          <h1 className="font-extrabold text-3xl">Community Voting...</h1>
          <ConnectWallet className="" />
        </div>
        <div className="flex flex-col w-1/2 gap-2">
          <h3 className="text-2xl">
            Voting on the blockchain leverages the decentralized, secure, and
            transparent nature of blockchain technology to improve traditional
            voting systems. <br />
            <span className="text-2xl text-gray-400">
              Here are the key features:
            </span>
          </h3>
          <div className="flex text-xl">
            <div className="underline decoration-pink-500 decoration-4">
              Security
            </div>
            : Blockchain uses cryptographic techniques to secure data, making it
            extremely difficult to alter votes or conduct fraud.
          </div>
          <div className="flex text-xl">
            <div className="underline decoration-indigo-500 decoration-4">
              Transparency
            </div>
            : Every vote is recorded on a public ledger, providing transparency
            and making it easier to audit results.
          </div>
          <div className="flex text-xl">
            <div className="underline decoration-sky-500 decoration-4">
              Decentralization
            </div>
            : No single entity controls the voting process, reducing the risk of
            manipulation.
          </div>
          <div className="flex text-xl">
            <div className="underline decoration-indigo-500 decoration-4">
              Anonymity
            </div>
            : Voter identities are protected through cryptographic techniques,
            ensuring privacy.
          </div>
          <div className="flex text-xl">
            <div className="underline decoration-pink-500 decoration-4">
              Immutability
            </div>
            : Once recorded, votes cannot be changed or deleted, ensuring the
            integrity of the election results.
          </div>
        </div>

        <div>
          <div className="text-2xl text-gray-400 underline">
            connect wallet from above button
          </div>
        </div>
      </div>
    );
  }

  const proposalsArray = proposal?.map((p, index) => {
    return (
      <div key={index}>
        <Proposal proposal={p} />
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center gap-24 w-full mb-12">
      <div className="flex w-full justify-between items-center p-4 shadow-lg shadow-indigo-500/50 w-full">
        <h1 className="font-extrabold text-3xl items-center">
          Community Voting...
        </h1>
        <div className="flex gap-4">
          <div className="flex text-sm border-2 rounded-lg p-2 gap-2">
            <div className="">
              {address.slice(0, 4) + "...." + address.slice(-4)}
            </div>
            {tokenBalance.data && (
              <div>
                {Number(tokenBalance.data.displayValue)}{" "}
                <span>{tokenBalance.data.symbol}</span>
              </div>
            )}
          </div>
          <button
            className="text-sm p-2 border-2 rounded-lg"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <h1 className="mb-8 text-3xl font-extrabold">Create Proposal</h1>

        <div className="flex flex-col mb-8 items-center gap-2">
          <textarea
            type="text"
            onChange={(e) => {
              setProposalDescription(e.target.value);
            }}
            value={proposalDescription}
            placeholder="description"
            className="w-full outline-none border-2 p-4 rounded-lg"
            cols={80}
          />
          <button
            onClick={createProposal}
            className="border-2 text-sm rounded-lg w-1/4 p-2"
          >
            create proposal
          </button>
        </div>

        <h1 className="mb-8 text-3xl font-extrabold">Proposals</h1>
        <div className="flex flex-col gap-2">{proposalsArray}</div>
      </div>
    </div>
  );
}
