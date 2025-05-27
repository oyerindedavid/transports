import React, { useState, useEffect, useRef } from 'react';
import { getFormStatus } from '../hooks/https';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
const logo = process.env.MY_PUBLIC_URL + '/ppplogo.jpg';
const API_KEY = process.env.REACT_APP_API_KEY;
const REACT_APP_API_ADDRESS = process.env.REACT_APP_API_ADDRESS;

// This is the user form to register requests.
function UserRequestPage() {
    const navigate = useNavigate()
    const inputref = useRef(null)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
        libraries: ["places"],
        region: "ca"
    })

    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(true);
    const [formStatus, setFormStatus] = useState(null);
    const [formData, setFormData] = useState({
        service: '',
        fullName: '',
        phone: '',
        numOfPersons: '',
        address: '',
        geolocation: '',
        feedback: '',
        status: 'waiting',
    });



    useEffect(() => {
        // Get form status
        getFormStatus()
            .then((res) => {
                setFormStatus(res[0].status)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    const { service, fullName, phone, numOfPersons, address, geolocation, feedback } = formData;

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // If validation passes, you can submit the form (e.g., send to an API)
        // API endpoint to send data to
        console.log("API address: ", process.env.REACT_APP_API_ADDRESS) 
        const apiEndpoint = `${REACT_APP_API_ADDRESS}/requests/`;

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send formData as a JSON object
            });

            const data = await response.json();

            if (data.ok) {
                // Handle success (e.g., show success message)
                console.log(data);
                console.log('Form submitted successfully:', data);
                setShowForm(!showForm);
            } else {
                // Handle error (e.g., show error message)
                console.error('Error submitting form:', data);
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error sending form data:', error);
        }
    };

    function handleOnPlacesChange() {
        const address = inputref.current.getPlaces()
        setFormData((prev) => ({
            ...prev,
            address: address[0].formatted_address
        }))
        console.log("address", address)
    }

    function styleGetCurrentLocation() {
        return {
            cursor: "pointer"
        }
    }

    function getCurrentLocation() {
        console.log("Get location")
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    console.log(result);
                    if (result.state === "granted") {
                        //If granted then you can directly call your function here
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "prompt") {
                        //If prompt then the user will be asked to give permission
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        //If denied then you have to show instructions to enable location
                    }
                });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function getLocationInfo(latitude, longitude) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=${API_KEY}`
        fetch(url)
            .then(response => response.json())
            .then((data) => {
                setFormData((prev) => ({
                    ...prev,
                    address: data.results[0].formatted_address
                }))

            })
            .catch((err) => console.log(err))
    }

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function success(pos) {
        var crd = pos.coords;
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        getLocationInfo(crd.latitude, crd.longitude);
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    return (
        <div>
            {!isLoading ? (
                <>
                    {formStatus === true ?
                        (<div className='max-w-sm mx-auto py-4'>

                            {showForm ?
                                (<div id='user' className='px-3'>
                                    <div className='text-center py-5'>
                                        <h1 className='my-2 font-bold'>
                                            Peculiar People's Parish (PPP) Transportation Request
                                        </h1>
                                        <p className='text-200'>
                                            Good day. For planning purposes, It is very important that you send in your request no later than 5pm the Saturday before.
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form className="" onSubmit={onSubmit}>
                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900">
                                                What Service would you like to attend?
                                            </label>
                                            <select
                                                name="service"
                                                id="service"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5"
                                                value={service}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select service</option>
                                                <option value="first-service">First Service</option>
                                                <option value="second-service">Second Service</option>
                                            </select>
                                        </div>

                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900">
                                                Full name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                id="fullName"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5"
                                                value={fullName}
                                                onChange={onChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
                                                Contact - Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5"
                                                value={phone}
                                                onChange={onChange}
                                                required
                                                placeholder='+1'
                                            />
                                        </div>

                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="numOfPersons" className="block mb-2 text-sm font-medium text-gray-900">
                                                Number of Persons
                                            </label>
                                            <input
                                                type="number"
                                                name="numOfPersons"
                                                id="numOfPersons"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5"
                                                value={numOfPersons}
                                                onChange={onChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="address" className="flex justify-between align-middle mb-2 text-sm font-medium text-gray-900">
                                                <span className='inline-block'> Enter Address </span> <span className='inline-block mx-6 p-2 bg-blue-500 text-white rounded-lg' onClick={() => getCurrentLocation()} style={styleGetCurrentLocation()}>Use current location</span>
                                            </label>
                                            {isLoaded &&
                                                <StandaloneSearchBox
                                                    onLoad={(ref) => inputref.current = ref}
                                                    onPlacesChanged={handleOnPlacesChange}
                                                >
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        placeholder='Enter address'
                                                        id="address"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        value={address}
                                                        onChange={onChange}
                                                        required
                                                    />
                                                </StandaloneSearchBox>
                                            }

                                        </div>

                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="geolocation" className="block mb-2 text-sm font-medium text-gray-900">
                                                Where is your location? E.G North?
                                            </label>
                                            <select
                                                name="geolocation"
                                                id="geolocation"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={geolocation}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select geolocation</option>
                                                <option value="North">North</option>
                                                <option value="East">East</option>
                                                <option value="West">West</option>
                                                <option value="South">South</option>
                                            </select>
                                        </div>



                                        <div className="mb-5 max-w-sm">
                                            <label htmlFor="feedback" className="block mb-2 text-sm font-medium text-gray-900">
                                                Comment:
                                            </label>
                                            <input
                                                type="text"
                                                name="feedback"
                                                id="feedback"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={feedback}
                                                onChange={onChange}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>) :
                                (<div id='user' className='p-3 flex flex-col gap-2 text-center m-auto'>
                                    <div>
                                        <img src={logo} alt='RccgPPP Logo' />
                                    </div>

                                    <p>
                                        Your information has been recorded, <br />
                                        You will be contacted soon. <br />
                                        Thank you
                                    </p>

                                    <div>
                                        <br />
                                        <p>
                                            Do you want to request another Ride?
                                        </p>
                                        <br />

                                        <button onClick={() => navigate('/requests')}
                                            className="text-white bg-blue-500 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                                        >
                                            Request Ride
                                        </button>
                                    </div>

                                </div>)}

                        </div>)

                        : (<div id='welcome' className='bg-red-300 mb-5 py-6 max-w-lg font-400 text-center font-bold'>
                            <div>
                                <h1>Sorry..</h1>
                            </div>

                            <p>
                                The form is Closed <br />
                                Kindly Contact Admin to register.
                            </p>

                        </div>)
                    }


                </>
            ) : <Loader />}
        </div>

    );
}

export default UserRequestPage;