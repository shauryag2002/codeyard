"use client";
import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation';
import { SideBarAtom } from './state/atoms/atom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Select from 'react-select'
import countryList from 'react-select-country-list'
interface SideBarProps {
    setPeople: React.Dispatch<React.SetStateAction<never[]>>;
    peoples: Person[];
}

interface Person {
    name: string;
    resume: string;
    id: string;
    bio: string;
    username: string;
}
interface FilterItemsProps {
    location?: string;
    gender: string;
    YOE?: number;
    age?: number;
}
const SideBar = ({ setPeople }: SideBarProps) => {
    const { data: session } = useSession();
    const [open, setOpen] = useRecoilState<boolean>(SideBarAtom);
    const [filterItems, setFilterItems] = React.useState<FilterItemsProps>({
        gender: "male"
    })
    const options = useMemo(() => countryList().getData(), [])
    const handleSubmit = async () => {
        if (Object.keys(filterItems).length === 0) {
            return;
        }
        const filteredPeople = await axios.put('/api/yard', { ...filterItems, id: session?.user.id })
        setPeople(filteredPeople.data)
        setOpen(false)
    }
    if (open) {
        return <>
            <div className=" Sidebar w-full h-full bg-transparent bg-opacity-50 backdrop-blur-md fixed z-[1000]">


                <div className="sidebar pt-4    bg-[#6495ed] h-full w-[300px] z-20 relative top-0 left-0 ">
                    <div className="absolute top-[0.2rem] right-4 scale-[0.7]   bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded text-white" onClick={() => {
                        setOpen(false)
                    }}>X</div>
                    <span className="bg-[#EA1A58] p-3 ml-4 text-white rounded-tl-[25%] rounded-tr-[25%] pb-4">
                        Filter
                    </span>
                    <div className='flex flex-col py-1 overflow-auto bg-[#EA1A58]' >
                        <div className="Location">
                            <span className="text-white font-bold ml-4">Location</span>
                            <Select className="p-2 mx-4 my-2 rounded w-[-webkit-fill-available]"
                                isSearchable={true}
                                options={options}
                                onChange={
                                    (e) => {
                                        setFilterItems({ ...filterItems, location: e?.value ?? "" })
                                    }
                                } />
                        </div>
                        <div className="gender">
                            <span className="text-white font-bold ml-4">Gender</span>
                            <select className="p-2 mx-4 my-2 rounded w-[-webkit-fill-available]" onChange={
                                (e) => {
                                    setFilterItems({ ...filterItems, gender: e.target.value })
                                }
                            }>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className="Experience">
                            <span className="text-white font-bold ml-4">Year of Experience</span>
                            <input type="number" className="p-2 mx-4 my-2 rounded w-[-webkit-fill-available]" onChange={
                                (e) => {
                                    setFilterItems({ ...filterItems, YOE: Number(e.target.value) })
                                }

                            } />
                        </div>
                        <div className="Age">
                            <span className="text-white font-bold ml-4">Age</span>
                            <input type="number" className="p-2 mx-4 my-2 rounded w-[-webkit-fill-available]" onChange={
                                (e) => {
                                    setFilterItems({ ...filterItems, age: Number(e.target.value) })
                                }
                            } />
                        </div>
                        <span className='text-center bg-red-200 text-slate m-4 ' onClick={handleSubmit}>
                            Apply
                        </span>

                    </div >

                </div>
            </div >
        </>
    }
    return null
}

export default SideBar