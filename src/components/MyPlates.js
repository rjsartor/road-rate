import React, { useState, useEffect }  from 'react'; 
import {API_BASE_URL} from '../config';
import { useNavigate } from 'react-router-dom';
import PagesNav from './PagesNav';
import '../styles/plates/my-plates-list.css'

export const MyPlatesList = () => {
  const navigate = useNavigate();
  const [ plates, setPlates ] = useState([]);
  const [ redirect, setRedirect ] = useState(false);

  const fetchPlates = async () => {
    let url = `${API_BASE_URL}/plates/all/${localStorage.userId}`;
    const response = await fetch(url);
    const plates = await response.json();
    setPlates(plates)
    return plates
  }

  useEffect(() => {
    fetchPlates();
    setRedirect(false)
    localStorage.removeItem('responseSuccess')
    localStorage.removeItem('unclaimedPlate')
  }, []);

  let plate;
  const myPlateClick = (plate) => {
    localStorage.setItem('myPlate', plate.plateNumber)
    localStorage.setItem('myState', plate.plateState)
    localStorage.setItem('myPlateId', plate.id)
    localStorage.removeItem('success')
    setRedirect(true);
    return plate
  }
  
  let plateEndpoint = `/my-plates/id/${localStorage.myPlateId}`;

  if (redirect) {
    return navigate(plateEndpoint);
  }

  const noPlatesMessage = () => {
    if(localStorage.hasPlates === '' || !plates.length) {
      return (
        <p>No plates associated</p>
      )
    }
    return (
      <p>Total Plates Owned: {plates.length}</p>
    )
  }

   if (plates.length) {
    plate = plates.map((plate, index) => { 
      return (
        <li className='plate-list-item' key={index} tabIndex='0'>
          <button 
            className="my-plate-btn"
            onClick={ () => myPlateClick(plate) }
            >
            {plate.plateNumber} - {plate.plateState}
          </button>
        </li>
      )
    })
  };

  return (
    <main className="my-plates">  
      <PagesNav />
      <h2>My Plates</h2>
      {noPlatesMessage()}         
      <ul className='my-plates-list'>
        {plate}
      </ul>
    </main>
  );
};

export default MyPlatesList;