import React, { useState, useEffect } from 'react'
import { IoMdCall } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { updateRequest } from '../../hooks/https';
import { MdHotelClass } from "react-icons/md";

// This is the request dropdown
function Viewdetails({ request }) {
    const [status, setStatus] = useState(request.status);
    const [updated, setUpdated] = useState(false);
    // Pre-generated messages
    const messages = [
        {
            id: 0,
            msg: "I have arrived",
        }, {
            id: 1,
            msg: "I am running late",
        }, {
            id: 2,
            msg: "I am close to your location",
        }
    ];

    const getLocation = (address) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    }
    // Function to handle calling the user

    const updateStatus = (cStatus) => {
        // setRealtime(cStatus)
        setUpdated(true);
        const set = updateRequest(request._id, cStatus);
        if (!set) {
            alert("Unable to update request status");
        }
        setStatus(cStatus);
        setUpdated(false);
    }

    const createdAt = request.createdAt; // Assuming this is a valid ISO timestamp
    const date = new Date(createdAt);

    // Format date
    const formattedDate = (date.toLocaleString('default', { month: 'long' })).substring(0, 3) + " " + date.getDate();

    // Format time
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


    return (
        <div className='b-0 flex flex-col gap-2 bg-blue-20'>
            <div className='flex justify-between'>
                <h4 className=' text-sm'>
                    <p>Time:</p>

                    <div className=''>
                        <p>{formattedDate}, {formattedTime}</p>
                    </div>

                </h4>

                {/* Status */}
                <div className='text-sm flex'>
                    <p><MdHotelClass className='block' size={25} /></p> <p>{status} </p>
                    {/* Waiting to be picked */}
                    {/* picked */}
                </div>
            </div>

            <div className='flex justify-between'>

                {/* Pre-generated Text messages */}
                <div className="flex flex-col gap-3">
                    {messages.map((message) => (
                        <div key={message.id} className=''>
                            <button>
                                <a
                                    key={message.id}
                                    id='message'
                                    className="message-button p-1 bg-grey-500 mb-1 text-sm rounded-sm inline"
                                    href={`sms:${request.phone}?&body=${encodeURIComponent(`Hi, ${message.msg}`)}`}
                                >
                                    {message.msg}
                                </a>
                            </button>
                        </div>

                    ))}
                </div>

                {/* Call */}
                <div className='flex flex-col px-5'>
                    {/* Call feature comes here */}
                    <div className="call-feature">
                        <button>
                            <a href={`tel:${request.phone}`} className="call-button">
                                <IoMdCall size={27} />
                            </a>
                        </button>
                    </div>

                    {/* Map feature comes here */}
                    <div className="map-feature">
                        <button className="call-button" onClick={() => getLocation(request.address)}>
                            <FaMapMarkerAlt size={25} />
                        </button>
                    </div>

                </div>
            </div>

            {/* The logic to update request status realtime */}

            <div className='flex justify-between p-2'>

                <button className='bg-yellow-300 p-2 rounded-sm' onClick={() => updateStatus('Unavailable')}>
                    Unavailable
                </button>

                {status === 'Unavailable' || status === 'Dropped' || status === 'waiting' ? (
                    <button className='bg-green-300 p-2 rounded-sm' onClick={() => updateStatus('Picked')}>
                        Picked
                    </button>
                ) : (
                    <button className='bg-green-300 p-2 rounded-sm' onClick={() => updateStatus('Dropped')}>
                        Dropped
                    </button>
                )}
            </div>
        </div>
    )
}

export default Viewdetails
