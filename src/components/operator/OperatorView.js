import React, { useEffect, useState, useContext } from 'react';
import { getAllContainers, getAllRequests } from '../../hooks/https';
import Requests from './Requests';

function OperatorView() {
    // const userInfoContext = useContext(UserContext);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [requests, setRequests] = useState([]);
    const [exactContainer, setExactContainer] = useState(null); // Initialize as null

    // Get the container content on intitial render
    useEffect(() => {
        getAllContainers()
            .then(data => {
                if (data && data.length > 0) {

                    // Find the container that matches the user ID
                    const foundContainer = data.filter(c => {
                        return String(c.operator._id).trim() === String(userInfo._id).trim();
                    });

                    // If container is found
                    if (foundContainer) {
                        console.log("Found container for user:", foundContainer);
                        setExactContainer(foundContainer);
                    } else {
                        console.log("No container found for this user.");
                    }

                } else {
                    console.log("Container data is empty or invalid.");
                }
            })
            .catch(err => {
                console.log("Error fetching containers:", err);
            });

        // Get all requests
        getAllRequests().then(data => {
            setRequests(data)
        }).catch(err => {
            console.log(err)
        });

    }, []);

    useEffect(() => {

    }, [userInfo, exactContainer]);

    return (
        <div className='flex flex-col max-w-sm mx-auto py-1 my-1'>
            <div className='text-center'>

                {userInfo && exactContainer ? (
                    <>
                        <p>Welcome {userInfo.fullName}</p>
                        <br />
                    </>
                ) : (
                    <p>welcome</p>
                )}


                <p>Find your requests here:</p> <br />

                <div>
                    {exactContainer && exactContainer.length > 0 ?
                        exactContainer.map(rou => (
                            <p key={rou._id}>{rou.geolocation}</p>
                        )) : ""
                    }
                </div>
            </div>



            {userInfo && exactContainer && exactContainer.length > 0 ? (

                <div className='flex'>
                    <div className=''>
                        {exactContainer.map(container => {
                            const filteredRequests = requests.filter(ind => ind.geolocation === container.geolocation);
                            console.log(filteredRequests);

                            if (filteredRequests.length > 0) {
                                return filteredRequests.map(ind =>
                                    <Requests key={ind._id} data={ind} />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </div>
            ) : (
                <p>Sorry, You have not been assigned Yet.</p>
            )}
        </div>

    );
}

export default OperatorView;
