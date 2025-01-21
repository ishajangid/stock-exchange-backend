"use client"

import { PrimaryButton, SuccessButton } from "./Button"
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const router = useRouter()
    const route = usePathname()

    return (
        <div className="flex h-14 w-full flex-col justify-center pl-[21px] pr-4 border-b border-slate-800">
            <div className="flex flex-row justify-between">
                <div className="flex items-center flex-row">
                    <div className="ml-[20px] mr-[20px] flex flex-row items-center justify-center cursor-pointer" onClick={() => router.push('/')}>
                        <div className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 flex flex-row items-center justify-center gap-2 bg-transparent h-10 text-xl p-0 text-baseTextMedEmphasis">
                            <img src="./icon.png" alt="" className="w-7" />
                            Backpack
                        </div>
                    </div>
                    <div className={`ml-[20px] mr-[20px] flex flex-row items-center justify-center cursor-pointer ${route.startsWith('/markets') || route === '/' ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/markets')}>
                        <div className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent h-8 text-sm p-0 text-baseTextMedEmphasis">Markets</div>
                    </div>
                    <div className={`ml-[20px] mr-[20px] flex flex-row items-center justify-center cursor-pointer ${route.startsWith('/trade') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/trade/TATA_INR')}>
                        <div className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent h-8 text-sm p-0 text-baseTextHighEmphasis">Trade</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="p-2 mr-2">
                        <SuccessButton>Deposit</SuccessButton>
                        <PrimaryButton>Withdraw</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}