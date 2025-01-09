/*Documentation

Logic of thus feature
- Populate operators array a list of all the operators registered on this network, on initial render
- Get the container list from DB, and populate the container
- Inside "exactoperator"; Save the exact operator that was assigned for a route
 when there is a change of assignment, repeat the same task of setting the exact operator
- On assigning operator, update the container
*/

import React, { useEffect, useState } from 'react';
import Requests from '../operator/Requests';
import { getAllOperators, getAllContainers, assignOperator } from '../../hooks/https';

function List({ geoLoc, data, status, total }) {
    const [operators, setOperators] = useState([]);
    const [exactOperator, setExactOperator] = useState(null);
    const [container, setContainer] = useState([]);
    const [selectedOperatorId, setSelectedOperatorId] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // For toggling dropdown visibility

    // Fetch operators and containers
    useEffect(() => {
        const fetchOperatorsAndContainers = async () => {
            try {
                const operatorsData = await getAllOperators();
                setOperators(operatorsData || []);

                const containersData = await getAllContainers();
                setContainer(containersData);

                const matchedContainer = containersData.find(
                    (item) => item.geolocation === geoLoc
                );
                if (matchedContainer && matchedContainer.operator) {
                    setExactOperator(matchedContainer.operator);
                } else {
                    setExactOperator(null); // No operator assigned
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchOperatorsAndContainers();
    }, [geoLoc]);

    const onAssignClick = async () => {
        if (!selectedOperatorId) {
            alert("Assign opertor first");
            return;
        }

        try {
            const response = await assignOperator({ geoLoc, id: selectedOperatorId });
            const updatedContainer = await response.json();

            setContainer((prevContainers) => {
                const updatedContainers = prevContainers.filter(
                    (item) => item._id !== updatedContainer._id
                );
                return [...updatedContainers, updatedContainer];
            });

            const selectedOperator = operators.find(
                (operator) => operator._id === selectedOperatorId
            );
            if (selectedOperator) {
                setExactOperator(selectedOperator);
                setIsDropdownVisible(false)
            } else {
                console.error('Operator with matching ID not found');
            }
        } catch (error) {
            console.error('Error assigning operator:', error);
        }

        setIsDropdownVisible(false); // Hide dropdown after successful assignment
    };

    return (
        <div className="max-w-sm p-1 rounded-lg flex flex-col align-between border border-gray-200 mb-5">
            <div className="flex justify-between py-2">
                <div>
                    {exactOperator && exactOperator.fullName ? (
                        <div>
                            {geoLoc}: <p>{exactOperator.fullName}</p>
                        </div>
                    ) : (
                        <div>
                            {geoLoc}: <p>No operator assigned</p>
                        </div>
                    )}
                </div>

                {/* Assign Button */}
                {status === 'Admin' && (
                    <div>
                        {!isDropdownVisible && (
                            <button
                                onClick={() => setIsDropdownVisible(true)}
                                className="p-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                            >
                                Assign
                            </button>
                        )}

                        {/* Dropdown and Submit Button */}
                        {isDropdownVisible && (
                            <div className="mt-2">
                                <select
                                    onChange={(e) => setSelectedOperatorId(e.target.value)}
                                    name={geoLoc}
                                    id={geoLoc}
                                    className="block p-2 bg-white border border-gray-200 rounded-lg shadow"
                                >
                                    <option value="">Select an Operator</option>
                                    {operators.map((operator) => (
                                        <option key={operator._id} value={operator._id}>
                                            {operator.fullName}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={onAssignClick}
                                    className="mt-2 p-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                {data ? (
                    data.map((ind) => <Requests key={ind._id} data={ind} />)
                ) : (
                    'You are not connected to the Database.'
                )}
            </div>
        </div>
    );
}

export default List;