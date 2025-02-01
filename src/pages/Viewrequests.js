/* global google */
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../hooks/OperatorContext';
import List from '../components/admin/List';
import { FaRegAddressBook } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { getAllRequests, getFormStatus, httpsetFormStatus } from '../hooks/https';
import OperatorView from '../components/operator/OperatorView';

const API_KEY = process.env.REACT_APP_API_KEY;


function Viewrequests() {
  const [uniqueGeolocations, setUniqueGeolocations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [origin, setOrigin] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [addressAndDistance, setAddressAndDistance] = useState([]);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentLocation();
    getAllRequests()
      .then(allRequests => {
        setRequests(allRequests);
        const destinationAddresses = allRequests.map(req => req.address);
        setDestinations(destinationAddresses);

        getFormStatus()
          .then(res => {
            setShowForm(res[0].status)
          })
      })
      .catch(err => console.log(err));
  }, []);

  // Trigger distance calculation after destinations are set
  useEffect(() => {
    if (destinations.length > 0) {
      loadGoogleMapsScript();
    }
  }, [destinations, origin]);

  const loadGoogleMapsScript = () => {
    if (!document.getElementById('googleMapsScript')) {
      const script = document.createElement('script');
      script.id = 'googleMapsScript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = handleDistanceMatrix;
      document.body.appendChild(script);
    } else if (window.google) {
      handleDistanceMatrix();
    }
  };

  const handleDistanceMatrix = () => {
    if (!origin || origin.length === 0) {

      console.error('Origin is missing or invalid.');

      return; // Prevent the function from proceeding
    }

    if (!destinations || destinations.length === 0) {

      console.error('Destinations are missing or invalid.');
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
      origins: [origin],
      destinations: destinations,
      travelMode: 'DRIVING',
    }, (response, status) => {
      if (status === 'OK') {
        const distanceResults = response.rows[0].elements;
        const updatedData = requests.map((element, index) => ({
          ...element,
          distanceData: distanceResults[index],
        }));

        updatedData.sort((a, b) => a.distanceData.distance.value - b.distanceData.distance.value);
        setAddressAndDistance(updatedData);
      } else {
        console.error('Error fetching distance matrix:', status);
      }
    });
  };

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

  function getLocationInfo(latitude, longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=${API_KEY}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setOrigin(data.results[0].formatted_address);
      })
      .catch(err => console.log(err));
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
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  return (
    <>

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
        <span style={styleGetCurrentLocation()} onClick={getCurrentLocation}><b>Refresh</b></span>
        {/* Display request data */}
        {userInfo && addressAndDistance.length > 0 ? (
          userInfo.privilege === 'Admin' ? (
            uniqueGeolocations.map(geoLoc => {
              const filteredRequests = addressAndDistance.filter(req => req.geolocation === geoLoc);
              return filteredRequests.length > 0 ? <List key={geoLoc} geoLoc={geoLoc} data={filteredRequests} status={userInfo.privilege} /> : null;
            })
          ) : (
            <OperatorView />
          )
        ) : (
          <p className='text-center p-3 font-bold'>Sorry <br /> There are no requests yet</p>
        )}

        {userInfo?.privilege === 'Admin' && (
          <div>
            {/* <p> The Form is currently {}, click to </p> */}
            <button className='w-full mb-2' onClick={handleFormStatusToggle} style={{ backgroundColor: showForm ? 'yellow' : 'green' }}>
              {showForm ? 'Close Form' : 'Open Form'}
            </button>
          </div>
        )}
      </div>


    </>
  );
}

export default Viewrequests;