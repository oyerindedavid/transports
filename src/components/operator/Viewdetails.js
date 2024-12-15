import React, { useState, useEffect } from 'react'
import { IoMdCall } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { updateRequest } from '../../hooks/https';

// This is the request dropdown
function Viewdetails({ request }) {
    const [status, setStatus] = useState(request.status);

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
        const set = updateRequest(request._id, cStatus);
        if (!set) {
            alert("Unable to update request status");
        }
        setStatus(cStatus);
    }

    return (
        <div className='b-0 flex flex-col gap-2 bg-blue-20'>
            <div className='flex justify-between'>
                <h4>
                    Time:
                </h4>

                {/* Status */}
                <h5 className='mx-2'>
                    <p>Status: </p> {request.status}
                    {/* Waiting to be picked */}
                    {/* picked */}
                </h5>
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
                                    href={`sms:${request.phone}?&body=${encodeURIComponent(`Hi, ${message}`)}`}
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

                <button className='bg-yellow-300 p-2 rounded-sm' onClick={() => updateStatus('unavailable')}>
                    Unavailable
                </button>

                {status === 'unavailable' || status === 'dropped' || status === 'waiting' ? (
                    <button className='bg-green-300 p-2 rounded-sm' onClick={() => updateStatus('picked')}>
                        Picked
                    </button>
                ) : (
                    <button className='bg-green-300 p-2 rounded-sm' onClick={() => updateStatus('dropped')}>
                        Dropped
                    </button>
                )}
            </div>
        </div>
    )
}

export default Viewdetails
