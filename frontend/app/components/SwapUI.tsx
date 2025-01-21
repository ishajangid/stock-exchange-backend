import { useState } from "react";

export const SwapUI = ({ market }: { market: string }) => {
    const [activeTab, setActiveTab] = useState<boolean>(true);
    const [type, setType] = useState<boolean>(true);
    const [amount, setAmount] = useState<number>(0);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row h-[60px]">
                <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
                <SellBUtton activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex flex-col gap-1">
                <div className="px-3">
                    <div className="flex flex-row flex-0 gap-5 undefined">
                        <LimitButton type={type} setType={setType} />
                        <MarketButton type={type} setType={setType} />
                    </div>
                </div>
                <div className="flex flex-col px-3 gap-3">
                    <div className="flex flex-col flex-1 gap-3 text-baseTextHighEmphasis">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between flex-row">
                                <p className="text-xs font-normal text-gray-400">Available Balance</p>
                                <p className="font-medium text-xs text-baseTextHighEmphasis">36.94 USDC</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-normal text-gray-400">Price</p>
                            <div className="flex flex-col relative">
                                <input step="0.01" placeholder="0" className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-[var(--background)] pr-12 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0" type="type" />
                                <div className="flex flex-row absolute right-1 top-1 p-2">
                                    <div className="relative">
                                        <img src="/usdc.webp" className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-normal text-gray-400">Quantity</p>
                        <div className="flex flex-col relative">
                            <input step="0.01" placeholder="0" className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-[var(--background)] pr-12 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0" type="text" />
                            <div className="flex flex-row absolute right-1 top-1 p-2">
                                <div className="relative">
                                    <img src="/sol.webp" className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end flex-row">
                            <p className="font-medium pr-2 text-xs text-baseTextMedEmphasis">≈ 0.00 USDC</p>
                        </div>
                        <div className="flex justify-center flex-row mt-2 gap-3">
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                25%
                            </div>
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                50%
                            </div>
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                75%
                            </div>
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                Max
                            </div>
                        </div>
                    </div>
                    <button type="button" className="font-semibold  focus:ring-blue-200 focus:none focus:outline-none text-center h-12 rounded-xl text-base px-4 py-2 my-4 bg-greenPrimaryButtonBackground text-greenPrimaryButtonText active:scale-98" data-rac="">Buy</button>
                    <div className="flex justify-between flex-row mt-1">
                        <div className="flex flex-row gap-2">
                            <div className="flex items-center">
                                <input className="form-checkbox rounded border border-solid border-baseBorderMed bg-base-950 font-light text-transparent shadow-none shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed cursor-pointer h-5 w-5" id="postOnly" type="checkbox" data-rac="" />
                                <label className="ml-2 text-xs">Post Only</label>
                            </div>
                            <div className="flex items-center">
                                <input className="form-checkbox rounded border border-solid border-baseBorderMed bg-base-950 font-light text-transparent shadow-none shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed cursor-pointer h-5 w-5" id="ioc" type="checkbox" data-rac="" />
                                <label className="ml-2 text-xs">IOC</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BuyButton({ activeTab, setActiveTab }: { activeTab: boolean, setActiveTab: any }) {
    return <div className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 ${activeTab ? 'border-b-greenBorder bg-greenBackgroundTransparent' : 'border-b-slate-700 hover:border-b-white'}`} onClick={() => setActiveTab(true)}>
        <p className="text-center text-sm font-semibold leading-[60px] text-green-500">Buy</p>
    </div>
}

function SellBUtton({ activeTab, setActiveTab }: { activeTab: boolean, setActiveTab: any }) {
    return <div className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 ${!activeTab ? 'border-b-redBorder bg-redBackgroundTransparent' : 'border-b-slate-700 hover:border-b-white'}`} onClick={() => setActiveTab(false)}>
        <p className="text-center text-sm font-semibold leading-[60px] text-red-500">Sell</p>
    </div>
}

function LimitButton({ type, setType }: { type: boolean, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType(true)}>
        <div className={`text-sm font-medium py-1 border-b-2 ${type ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-gray-400 hover:border-baseTextHighEmphasis hover:text-white"}`}>Limit</div>
    </div>
}

function MarketButton({ type, setType }: { type: boolean, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType(false)}>
        <div className={`text-sm font-medium py-1 border-b-2 ${!type ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-gray-400 hover:border-baseTextHighEmphasis hover:text-white"}`}>Market</div>
    </div>
}