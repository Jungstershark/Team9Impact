'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import TextSearch from "@/app/components/TextSearch";
import InstrumentTable, { testData } from "@/app/market-analysis/components/InstrumentTable";
import { Button } from "@mui/material";
import { getAllInstruments, getFilteredInstruments } from "@/app/actions/analysis_execution";
import * as React from "react";
import FunctionButton from "@/app/components/FunctionButton";
import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from '@/app/utils/CookieHelper';

import {instrumentMapping} from "@/app/utils/instrumentMapping";

export const initialFilters = {
    "Instrument Group": "",
    "Instrument": "",
    "Department": "",
    "Risk Country": "",
    "Exchange": "",
    "Trade Currency": "",
    "Settlement Currency": ""
}

export default function Page(req: NextApiRequest, res: NextApiResponse) {
    const [filters, setFilters] = useState(initialFilters)

    const [instrumentDataList, setInstrumentDataList] = useState([])
    const [fullInstrumentDataList, setFullInstrumentDataList] = useState([])

    const [selectedInstrumentIdList, setSelectedInstrumentIdList] = useState([])

    const [token, setToken] = useState<string | null>(null);
    const [department, setDepartment] = useState<string | null>(null);

    useEffect(() => {
        
        // Retrieve the token and department from cookies
        const retrievedToken = getCookie('token');
        const retrievedDepartment = getCookie('department');

        // console.log('Token:', retrievedToken);
        // console.log('Department:', retrievedDepartment);

        if (retrievedDepartment != null) {
            const newFilters = {
                ...filters,
                ["Department"]: retrievedDepartment
            }
            setFilters(newFilters)
        }
        console.log(filters)
    }, []);

    const handleChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value
        }
        setFilters(newFilters)
        console.log(newFilters)
    }

    const handleInstrumentChange = (e) => {
        if (e.target.value in instrumentMapping) {
            const newFilters = {
                ...filters,
                "Instrument": instrumentMapping[e.target.value]
            }
            setFilters(newFilters)
        } else {
            handleChange(e)
        }
    }

    const handleCheckboxChange = (id) => {
        const newSelectedInstrumentIdList = selectedInstrumentIdList.includes(id) ?
            [...selectedInstrumentIdList].filter(selectedId => selectedId !== id) :
            [...selectedInstrumentIdList, id]

        const sortedInstrumentDataList = [...instrumentDataList]
            .sort((a, b) => newSelectedInstrumentIdList.includes(b["Id"]) - newSelectedInstrumentIdList.includes(a["Id"]))

        setSelectedInstrumentIdList(newSelectedInstrumentIdList)
        setInstrumentDataList(sortedInstrumentDataList)
    };

    const onSearchClick = async () => {
        try {
            const data = await getFilteredInstruments(filters); // Call the async function

            const rows: InstrumentData[] = data.data.map(item => {
                return (
                    {
                        "Id": item['instrumentId'],
                        "InstrumentGroup": item['instrumentGroup'],
                        "Instrument": item['instrument'],
                        "Department": item['department'],
                        "RiskCountry": item['riskCountry'],
                        "Exchange": item['exchange'],
                        "TradeCCY": item['tradeCCY'],
                        "SettlementCCY": item['settlementCCY'],
                    })
            })
                .sort((a, b) => selectedInstrumentIdList.includes(b["Id"]) - selectedInstrumentIdList.includes(a["Id"]));

            setInstrumentDataList(rows); // Update the state with the response data
            console.log(data.data) // Update the state with the response data
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const router = useRouter();
    const goToTradeExecution = () => {
        // console.log(`${selectedInstrumentIdList}`)
        // console.log(instrumentDataList)
        const numUniqueInstrumentGroup = new Set(fullInstrumentDataList
            .filter(instrumentData =>
                selectedInstrumentIdList.includes(instrumentData["Id"])
            )
            .map(instrumentData => instrumentData["InstrumentGroup"])).size
        // console.log(`filter ${fullInstrumentDataList
        //     .filter(instrumentData =>
        //         selectedInstrumentIdList.includes(instrumentData["Id"])
        //     )}`)
        // console.log(`numUniqueInstrumentGroup: ${numUniqueInstrumentGroup}`)

        if (numUniqueInstrumentGroup !== 1) {
            alert("Choose Instruments from only one Instrument Group")
        } else {
            router.push("/trade-execution/" + JSON.stringify(selectedInstrumentIdList))
        }
    }

    const goToApprovalForm = () => {
        router.push("/market-analysis/approval-form/" + JSON.stringify(filters))
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllInstruments(); // Call the async function

                const rows: InstrumentData[] = data.data.map(item => {
                    return (
                        {
                            "Id": item['instrumentId'],
                            "InstrumentGroup": item['instrumentGroup'],
                            "Instrument": item['instrument'],
                            "Department": item['department'],
                            "RiskCountry": item['riskCountry'],
                            "Exchange": item['exchange'],
                            "TradeCCY": item['tradeCCY'],
                            "SettlementCCY": item['settlementCCY'],
                        })
                })
                    .sort((a, b) => selectedInstrumentIdList.includes(b["Id"]) - selectedInstrumentIdList.includes(a["Id"]));

                setInstrumentDataList(rows); // Update the state with the response data
                setFullInstrumentDataList(rows)
                console.log(data.data) // Update the state with the response data
            } catch (error: any) {
                console.log(error.message);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col p-10 w-full min-h-full">
            <ul className="grid grid-cols-2 w-full h-min">
                {Object.entries(filters).map((filter, idx) => {
                    const label: string = filter[0]
                    const input: string = filter[1]

                    return (
                        <li key={idx}>
                            <TextSearch label={label} text={input} handleChange={(label === "Instrument") ? handleInstrumentChange : handleChange} />
                        </li>
                    )
                })}
            </ul>
            <Button onClick={onSearchClick}>
                Search
            </Button>
            <div style={{ height: 500, marginBottom: "20px" }} className="flex mt-10 h-80 border border-gray-300 rounded">
                <InstrumentTable
                    instrumentDataList={instrumentDataList}
                    selectedInstrumentIdList={selectedInstrumentIdList}
                    handleCheckboxChange={handleCheckboxChange}
                />
            </div>
            <div className="flex flex-row justify-between">
                <div className={"flex flex-row "}>
                    <button
                        className={`w-36 md:w-64 h-max text-center py-2 md:py-4 px-4 rounded rounded-xl shadow-[2px_5px_5px_1px_rgba(0,0,0,0.1)] bg-[#0e234e] text-white cursor-pointer mr-5`}
                        onClick={goToApprovalForm}>
                        Approval Form
                    </button>
                    <button
                        className={`w-36 md:w-64 h-max text-center py-2 md:py-4 px-4 rounded rounded-xl shadow-[2px_5px_5px_1px_rgba(0,0,0,0.1)] bg-[#0e234e] text-white cursor-pointer`}
                        onClick={() => {
                            setSelectedInstrumentIdList([])
                            alert("Multiple Instruments submitted for verification")
                        }}>
                        Verify Instruments
                    </button>
                </div>
                {selectedInstrumentIdList.length > 0
                    ? <button
                        className={`w-36 md:w-64 h-max text-center py-2 md:py-4 px-4 rounded rounded-xl shadow-[2px_5px_5px_1px_rgba(0,0,0,0.1)] bg-[#0e234e] text-white cursor-pointer`}
                        onClick={goToTradeExecution}>
                        Trade Execution
                    </button> :
                    <div
                        className={`w-36 md:w-64 h-max text-center py-2 md:py-4 px-4 rounded rounded-xl shadow-[2px_5px_5px_1px_rgba(0,0,0,0.1)] bg-[#0e234e] opacity-50 text-white`}>
                        Trade Execution
                    </div>
                }
            </div>
        </div>
    );
}