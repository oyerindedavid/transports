const API = process.env.REACT_APP_API_ADDRESS;

// 'http://localhost:5000'

async function getAllRequests() {
    try {
        const res = await fetch(`${API}/requests/`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

// Delete Request

async function deleteRequest(reqId, setRequests) {
    try {
        const res = await fetch(`${API}/requests`, {
            method: 'DELETE',
            body: JSON.stringify({ id: reqId }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        })

        if (res.ok) {
            setRequests((prev) => prev.filter(req => req._id !== reqId));
            return await res.json();
        } else {
            const error = await res.json();
            console.error("Failed to delete:", error.message);
        }

    } catch (err) {
        console.log(err);
    }
}

//Updated

async function getFormStatus() {
    try {
        const data = await fetch(`${API}/operator/formstatus/`);

        if (!data) {
            throw new Error('Failed to fetch form Status');
        }

        return data.json();

    } catch (err) {
        console.log(err);
    }
}

async function httpsetFormStatus(status) {
    try {
        const formStatus = await fetch(`${API}/operator/formstatus/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(status),
            credentials: 'include',
        })

        return formStatus.status;
    } catch (err) {
        return err;
    }
}


// Get all containers to store assigned operators across the application
async function getAllContainers() {
    try {
        const response = await fetch(`${API}/operator/assign`);
        if (!response) {
            throw new Error('Failed to fetch containers');
        }

        return response.json();
    } catch (err) {
        console.log("Error getting containers");
        console.log(err);
    }
}

// Login Operator
async function loginOperator(email) {
    try {
        const res = await fetch(`${API}/operator`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
            credentials: 'include',
        });

        if (!res) {
            return res.json();
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        return { error: "An error occurred while logging in" }; // Return an error object
    }
}


// Get all operators
async function getAllOperators() {
    try {
        const res = await fetch(`${API}/operator/`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

// Add Operators
async function addOperator(data) {
    try {
        const res = await fetch(`${API}/operator/add`, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
        })

        return res;
    } catch (err) {
        console.log(err);
        return [];
    }
}

// Assign operatorId to requests
async function assignOperator(data) {
    try {
        console.log(data.id);
        const res = await fetch(`${API}/operator/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ geolocation: data.geoLoc, operatorId: data.id }),
            credentials: 'include',
        });

        // console.log(res)
        return res
    } catch (err) {
        console.log(err);
        return [];
    }
};

// Modify request e.g request status.
async function updateRequest(request_id, status) {
    try {
        const res = await fetch(`${API}/operator/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request_id, status }),
            credentials: 'include',
        })
        if (res) {
            return res
        } else {
            console.log("Error updating status");
            res.status(404).json("Errors updating status!")
        }

    } catch (err) {
        console.log(err)
    }
}

async function modifyOperator(data) {
    console.log(data);
    const response = await fetch(`${API}/operator/modify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Parse and return the JSON response from the backend
    if (!response.ok) {
        throw new Error("Failed to update operator");
    }

    return response;
}

export {
    getAllRequests,
    deleteRequest,
    getAllContainers,
    loginOperator,
    getAllOperators,
    addOperator,
    modifyOperator,
    assignOperator,
    updateRequest,
    getFormStatus,
    httpsetFormStatus,
}