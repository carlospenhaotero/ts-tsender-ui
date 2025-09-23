"use client"

import Header from "@/components/Header"
import AirdropForm from "@/components/AirdropForm";
import { useAccount } from "wagmi";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div>
      {!isConnected ? (
        <div>
          Please connect a wallet...
        </div>
      ) : (
        <div>
          <HomeContent />
        </div>
      )}
    </div>
  );
}