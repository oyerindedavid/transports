import React, { useState, useRef } from 'react';
import Viewdetails from './Viewdetails';
import { GrGroup } from "react-icons/gr";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";

// This component carries both request and the drop-down.
export default function Requests({ data }) {
    const [show, setShow] = useState(false); // Initial state
    const detailsRef = useRef(null); // Reference to the details div

    const toggle = () => {
        setShow((prev) => !prev); // Toggle the state
    };

    return (

        <div className='flex flex-col border border-black-200 mb-1 pb-2 rounded-lg'>
            <div className='' onClick={toggle}>

                <div className='flex flex-col gap-3'>
                    <div className='flex justify-between'>
                        <div>
                            {data.fullName}
                        </div>

                        <div className=''>
                            <GrGroup size={27} className="inline" />   {data.numOfPersons}
                        </div>
                    </div>

                    <div className='flex justify-between text-xs max-w-sm'>
                        <div className=''>
                            {data.address}
                        </div>
                        <div>
                            <GiPathDistance size={20} className="inline" /> {data.distanceData.distance.text}
                            <br />
                            <MdOutlineAccessTimeFilled size={20} className="inline" /> {data.distanceData.duration.text}
                        </div>
                    </div>

                </div>


            </div>

            <span
                ref={detailsRef}
                style={{
                    maxHeight: show ? `${detailsRef.current.scrollHeight}px` : '0px', // Dynamically set the height
                    transition: 'max-height 0.5s ease', // Smooth transition
                    overflow: 'hidden', // Prevent overflow
                }}
                className="bg-gray-100 mt-2" // Add some background to make the details visible
            >

                <Viewdetails request={data} />
            </span>
        </div>
    );
}