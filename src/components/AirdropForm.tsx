"use client"

import {InputForm} from "@/components/ui/InputField";
import { use, useState, useMemo, useEffect} from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId , useConfig, useAccount , useWriteContract} from "wagmi";
import {readContract, waitForTransactionReceipt} from "@wagmi/core"
import { calculateTotal } from "@/utils/index";

type LoadingStage = "idle" | "approving" | "airdropping";

export default function AirdropForm() {

    // ── State UI
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const [stage, setStage] = useState<LoadingStage>("idle");

    const [tokenName, setTokenName] = useState<string>("");
    const [tokenSymbol, setTokenSymbol] = useState<string>("");
    const [tokenDecimals, setTokenDecimals] = useState<number>(18);

    // ── Persistencia en localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem("tokenAddress");
        const savedRecipients = localStorage.getItem("recipients");
        const savedAmounts = localStorage.getItem("amounts");

        if (savedToken) setTokenAddress(savedToken);
        if (savedRecipients) setRecipients(savedRecipients);
        if (savedAmounts) setAmounts(savedAmounts);
    }, []);

    
    useEffect(() => {
        localStorage.setItem("tokenAddress", tokenAddress);
    }, [tokenAddress]);

    useEffect(() => {
        localStorage.setItem("recipients", recipients);
    }, [recipients]);

    useEffect(() => {
        localStorage.setItem("amounts", amounts);
    }, [amounts])

    // ── Web3 hooks
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const { address, isConnected } = useAccount();
    const {data: hash, isPending, writeContractAsync } = useWriteContract()
    
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);

    async function handleSubmit() {
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)

        if(approvedAmount < total) {
            
            setStage("approving");

            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)]
            })
            const approvalReceipt = await waitForTransactionReceipt(config,{
                hash: approvalHash
            })
            console.log("Approval confirmed", approvalReceipt)

            setStage("airdropping");
            
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress  as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ]
            })

        }else{
            setStage("airdropping")
            
            await writeContractAsync({

                abi: tsenderAbi,
                address: tSenderAddress  as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ]
            })
        }

        setStage("idle");
        
    }

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found, please use a supported chain")
            return 0
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
            })
        return response as number

    }

    return (
        <div>
            <InputForm
                label="Token Address"
                placeholder="0x..."
                value={tokenAddress}
                type="text"
                onChange={(e) => setTokenAddress(e.target.value)}
            />

            <InputForm
                label="Recipients"
                placeholder="0x..."
                value={recipients}
                type="text"
                onChange={(e) => setRecipients(e.target.value)}
                large = {true}
            />

            <InputForm
                label="Amounts"
                placeholder="0,100,200,..."
                value={amounts}
                type="text"
                onChange={(e) => setAmounts(e.target.value)}
                large = {true}
            />
            
            <button
            onClick={handleSubmit}
            disabled={stage !== "idle"}
            className="
                px-6 py-3
                bg-blue-600 hover:bg-blue-700
                text-white font-semibold
                rounded-lg
                shadow-sm
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
            "
            >
            {stage === "approving" && (
                <>
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-70"></span>
                Approving...
                </>
            )}
            {stage === "airdropping" && (
                <>
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-70"></span>
                Airdropping...
                </>
            )}
            {stage === "idle" && "Send Token"}
            </button>


        </div>
    )
}