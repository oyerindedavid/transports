/* global google */
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../hooks/OperatorContext';
import List from '../components/admin/List';
import { FaRegAddressBook } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { getAllRequests, getFormStatus, httpsetFormStatus } from '../hooks/https';
import OperatorView from '../components/operator/OperatorView';
import Loader from '../components/Loader';

const API_KEY = process.env.REACT_APP_API_KEY;


function Viewrequests() {
  const [uniqueGeolocations, setUniqueGeolocations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [origin, setOrigin] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    getAllRequests()
      .then(allRequests => {
        setRequests(allRequests);
        const destinationAddresses = allRequests.map(req => req.address);
        setDestinations(destinationAddresses);

        console.log("API address: ", process.env.REACT_APP_API_ADDRESS)

        getFormStatus()
          .then(res => {
            setShowForm(res[0].status);
            setLoading(false);
          });
      })
      .catch(err => console.log(err));
  }, []);

  // Trigger distance calculation after destinations are set
  useEffect(() => {
    if (destinations.length > 0) {
      loadGoogleMapsScript();
    }
  }, [destinations, origin]);

  // Filter unique geolocations
  useEffect(() => {
    if (requests.length > 0) {
      const allGeos = requests.map(req => req.geolocation);
      const uniqueGeo = Array.from(new Set(allGeos)).filter(geo =>
        ['North', 'East', 'West', 'South'].includes(geo)
      );
      setUniqueGeolocations(uniqueGeo);
    }
  }, [requests]);

  function getLocationInfo(latitude, longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=${API_KEY}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setOrigin(data.results[0].formatted_address);
      })
      .catch(err => console.log(err));
  }

  const loadGoogleMapsScript = () => {
    if (!document.getElementById('googleMapsScript')) {
      const script = document.createElement('script');
      script.id = 'googleMapsScript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps API loaded");
        handleDistanceMatrix();
      }

      document.body.appendChild(script);
    } else if (window.google && window.google.maps) {
      console.log("Google Maps API already loaded");

      handleDistanceMatrix();
    }
  };


  const handleDistanceMatrix = () => {
    if (!window.google || !window.google.maps || !window.google.maps.DistanceMatrixService) {
      console.error("Google Maps API is not fully loaded yet.");
      return;
    }


    // Constructor error begins here 
    const service = new window.google.maps.DistanceMatrixService();

    if (!origin || origin.length === 0) {
      console.error('Origin is missing or invalid.');
      return; // Prevent the function from proceeding
    }

    if (!destinations || destinations.length === 0) {

      console.error('Destinations are missing or invalid.');
      return;
    }

    service.getDistanceMatrix({
      origins: [origin],
      destinations: destinations,
      travelMode: 'DRIVING',
    }, (response, status) => {
      console.log(response);
      if (status === 'OK') {

        const distanceResults = response.rows[0].elements;
        const updatedData = requests.map((element, index) => ({
          ...element,
          distanceData: distanceResults[index],
        }));

        console.log(updatedData);

        updatedData.sort((a, b) => a.distanceData.distance.value - b.distanceData.distance.value);

        setRequests(updatedData);
      } else {
        console.error('Error fetching distance matrix:', status);
      }
    });
  };

  const logoutUser = () => {
    setUserInfo(null);
    navigate('/operator');
  };

  const handleFormStatusToggle = () => {
    const newStatus = { status: !showForm };
    httpsetFormStatus(newStatus)
      .then(() => setShowForm(!showForm))
      .catch(err => console.log(err));
  };

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function styleGetCurrentLocation() {
    return { cursor: "pointer" };
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    getLocationInfo(crd.latitude, crd.longitude);
  }

  function errors(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
  }

  return (
    <>
      {loading ? <Loader /> :
        <div className='flex flex-col max-w-sm mx-auto py-4 my-3'>
          <div className='relative mb-9 flex'>
            <button className='absolute top-0 left-0 block' onClick={logoutUser}>
              <TbLogout2 size={30} color='red' />
            </button>
            {userInfo?.privilege === 'Admin' && (
              <button className='absolute top-0 right-0 block p-1 rounded-lg' onClick={() => navigate('/operator/modify/')}>
                <FaRegAddressBook size={30} />
              </button>
            )}
          </div>

          <span style={styleGetCurrentLocation()} className='rounded-sm text-center max-w-sm mx-auto my-2 bg-green-500' onClick={getCurrentLocation}><b>Refresh</b></span>
          {/* Display request data */}
          {userInfo && requests?.length > 0 ? (
            userInfo?.privilege === 'Admin' ? (
              uniqueGeolocations.map(geoLoc => {
                // NEXT...
                // Think of a logic to sum the number of members in a geolocation and display it real-time
                // List already has a "total" props, but the logic is not extablished yet
                // var sum = ;

                const filteredRequests = requests.filter(req => req.geolocation === geoLoc);
                return filteredRequests.length > 0 ? <List key={geoLoc} geoLoc={geoLoc} data={filteredRequests} status={userInfo.privilege} /> : null;
              })
            ) : (
              <OperatorView requests={requests} />
            )
          ) : (
            <p className='text-center p-5 bg-red-200 font-bold rounded-md'>Sorry <br /> There are no requests yet</p>
          )}

          {userInfo?.privilege === 'Admin' && (
            <div>
              {
                showForm ?
                  <div className='w-full my-2 text-center'>
                    <p>The Form is currently Open <br /> Click to Close</p>
                    <button onClick={handleFormStatusToggle} className='w-full rounded-md p-3 bg-red-500'>Close Form</button>
                  </div>
                  :
                  <div className='w-full my-2 text-center'>
                    <p>The Form is currently Closed <br /> Click to Open</p>
                    <button onClick={handleFormStatusToggle} className='w-full rounded-md p-3 bg-green-600'>Open Form</button>
                  </div>
              }
            </div>
          )}
        </div>}
    </>
  );
}

export default Viewrequests;