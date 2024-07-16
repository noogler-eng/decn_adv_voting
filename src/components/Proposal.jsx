import { VoteType, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Proposal({proposal}){

    const [vote, setVote] = useState({
        for: 0,
        against: 0,
        abstain: 0
    });

    const [hasVoted, setHasVoted] = useState(true);
    const address = useAddress();

    const {contract: vote_contract, isLoading: isVoteLoading} = useContract('0x97371dbB4494f711097Cde9753700e6031142d94');

    const checkHasVoted = async()=>{
        const voted = await vote_contract.hasVoted(proposal.proposalId, address);
        setHasVoted(voted);
        const votes = await vote_contract.getProposalVotes(proposal.proposalId);

        setVote({
            against: ethers.utils.formatEther(votes[0].count),
            for: ethers.utils.formatEther(votes[1].count),
            abstain: ethers.utils.formatEther(votes[2].count)
        })
    }

    useEffect(()=>{
        checkHasVoted();
    }, [isVoteLoading])

    const voteFor = async()=>{
        castVote(VoteType.For);
    }
    
    const voteAgainst = async()=>{
        castVote(VoteType.Against);

    }
    
    const voteAbstain = async()=>{
        castVote(VoteType.Abstain);
    }

    const castVote = async(voteType)=>{
        await vote_contract.vote(proposal.proposalId, voteType);
        window.location.reload();
    }

    function getDate(hexValue){
        const timeInSeconds=parseInt(hexValue,16)
        const timeInMiliseconds=timeInSeconds*1000
        let currentTime=new Date(timeInMiliseconds);
        currentTime.setFullYear(new Date().getFullYear());
        currentTime = currentTime.toLocaleDateString();
        return currentTime;

    }

    return <div className="flex flex-col border-2 p-4 rounded-lg w-full">
        <div className="flex gap-2"><div>proposal-id:</div> {proposal.proposalId.toString()}</div>
        <div className="flex gap-2"><div>proposal-proposer:</div>{proposal.proposer}</div>
        <div className="flex gap-2"><div>proposal-desc:</div>{proposal.description}</div>
        <div className="flex justify-between my-1">
            <div className="border p-2 text-sm rounded-lg flex gap-2"><div>start:</div>{proposal.startBlock._hex}</div>
            <div className="border p-2 text-sm rounded-lg flex gap-2"><div>end:</div>{proposal.endBlock._hex}</div>
        </div>
        <div className="flex justify-between my-1">
            <div className="border p-2 text-sm rounded-lg flex gap-2"><div>start:</div>{getDate(proposal.startBlock._hex)}</div>
            <div className="border p-2 text-sm rounded-lg flex gap-2"><div>end:</div>{getDate(proposal.endBlock._hex)}</div>
        </div>
        <div className="flex justify-between">
            <button disabled={hasVoted} onClick={voteFor} className="border p-2 text-sm rounded-lg flex gap-2">for power({Number(vote.for)})</button>
            <button disabled={hasVoted} onClick={voteAgainst} className="border p-2 text-sm rounded-lg flex gap-2">against power({Number(vote.against)})</button>
            <button disabled={hasVoted} onClick={voteAbstain} className="border p-2 text-sm rounded-lg flex gap-2">abstain power({Number(vote.abstain)})</button>
        </div>
    </div>
}