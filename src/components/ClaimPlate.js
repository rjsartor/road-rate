import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import PagesNav from './PagesNav';
import '../styles/plates/claim-plate.css';

export const ClaimPlate = () => {
  const [ plateNumber, setPlateNumber ] = useState('');
  const [ plateState, setPlateState ] = useState('');
  const [ successMessage, setSuccessMessage ] = useState('');
  const [ plates, setPlates ] = useState('before search');

  /* ========= SEARCH LICENSE PLATE TO CLAIM ========== */
  const handleSearchPlate = (e) => {
    e?.preventDefault(); 

    return fetch(`${API_BASE_URL}/plates/?state=${plateState}&search=${plateNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.authToken}`
      }
    })
    .then(res => {
      return res.json();
      })
    .then(data => {
      setPlates(data[0])
      return data
    })
    .catch(err => {
      setPlates('');
      if(err === 'TypeError: Failed to fetch'){
        return Promise.reject(err)
      }
      console.error(err)
      });
  };

 /* ========= POST A NEW PLATE ========== */
  const handlePlateRegister = (e) => {
    e?.preventDefault(); 
    const userId = localStorage.userId;

    localStorage.setItem('myPlate', plateNumber.toUpperCase())
    localStorage.setItem('myState', plateState)
    
    return fetch(`${API_BASE_URL}/plates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.authToken}`
      },
      body: JSON.stringify({
        plateNumber: plateNumber.toUpperCase(),
        plateState,
        userId,
        isOwned: true,
      })
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      setSuccessMessage(`Congrats! Your plate ${localStorage.myPlate} - ${localStorage.myState} was registered.`)
      return data
    })
    .catch(err => {
      if (err) {
        // alert("We're sorry. Something went wrong.")
        console.log(err);
      }
    });
  }

  /* ========= UPDATE AN EXISTING PLATE ========== */
  // PUT to link an existing plate to the current user
  const handleClaimClick = (e) => {
    e?.preventDefault(); 
    const userId = localStorage.userId;

    localStorage.setItem('myPlate', plateNumber)
    localStorage.setItem('myState', plateState)

    return fetch(`${API_BASE_URL}/plates/${localStorage.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.authToken}`
      },
      body: JSON.stringify({
        userId,
        plateNumber: plateNumber.toUpperCase(),
        plateState
      })
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      setSuccessMessage(`Congrats! Your plate ${localStorage.myPlate} - ${localStorage.myState} was registered.`)
      return data
    })
    .catch(err => {
      // alert("We're sorry. Something went wrong.")
      console.error(err);
    });
  }

  /* ========= DYNAMIC SEARCH RESULT TABLE ========== */
  let plateTable;
  if (plates && plates !== 'before search' && !plates.isOwned ) {
  plateTable = (
    <table>
      <tbody>
      <tr>
        <th><span className="mobile-hide">License</span> Plate</th>
        <th>State</th>
        <th>Add<span className="mobile-hide"> to Your Account</span></th>
        <th>Register <span className="mobile-hide">Your Plate</span></th>
        </tr>
        <tr>
          <td>{plates.plateNumber}</td>
          <td>{plates.plateState}</td>
          <td>
            <button 
              className='add-to-user-button' 
              onClick={(e) => {handleClaimClick(e)}}
              disabled={successMessage}
            >
              Claim
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    )
  } else if (plateNumber === '') {
    plateTable = (
      <table>
        <tbody>
          <tr>
            <th><span className="mobile-hide">License</span> Plate</th>
            <th>State</th>
            <th>Register <span className="mobile-hide">Your Plate</span></th>
          </tr>
        </tbody>
    </table>
    )
  } else if (plates === [] || plates === undefined) {
    // if the plateNumber is not in DB, then allow user to create a new plate & register it as theirs
    plateTable = (
      <table>
        <tbody>
        <tr>
        <th><span className="mobile-hide">License</span> Plate</th>
        <th>State</th>
        <th>Register <span className="mobile-hide">Your Plate</span></th>
        </tr>
        <tr>
          <td>{plateNumber}</td>
          <td>{plateState}</td>
          {/* need to get reviews.length of all of the reviews that have ever mentioned this license plate */}
          <td>
          <button 
            className='register-plate' 
            onClick={(e) => handlePlateRegister(e)}
            disabled={successMessage}
          >
            Register Plate
          </button>
          </td>
        </tr>
        </tbody>
      </table>
    )
  } else if (plates.isOwned) {
    plateTable = (
    <section className="plateTable">
      <table>
        <tbody>
          <tr>
            <th><span className="mobile-hide">License</span> Plate</th>
            <th>State</th>
            <th>Add<span className="mobile-hide"> to Your Account</span></th>
            <th>Register <span className="mobile-hide">Your Plate</span></th>
        </tr>
          <tr>
            <td>{plates.plateNumber}</td>
            <td>{plates.plateState}</td>
            <td>
              ALREADY CLAIMED
            </td>
          </tr>
        </tbody>
      </table>
        <p>
          Need to <strong>Unlink</strong> your plate? Go to:
        </p>
        <Link to="/my-plates">
          <span className="my-plates-link">My Plates</span>
        </Link>
      </section>
    )
  } else {
    plateTable = (<p>Submit a search</p>)
  }

  /* ========= RENDER CLAIM PLATE PAGE ========== */
  return (
    <main className="claim-plate">
      <PagesNav />   
      <h2>Claim A Plate</h2>
      <section className="claim-plate-search">
        <form 
            id="claim-search-form"
            onSubmit={handleSearchPlate}
          >
          <fieldset id="claim-plate-search">
            <legend>Search a Valid Plate by State</legend>     
            <article className="claim-plate-search-inputs">          
              <label 
                htmlFor="claim-search"
                className="claim-search-label"
                aria-label="claim-search-form">
              </label>
              <input
                value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value.toUpperCase())}
                  type="search"
                  id="claim-search"
                  name="claim-search"
                  className="claim-search-input"
                  placeholder="Search Plate Numbers"
                  pattern="^[a-zA-Z0-9]{1,8}$" 
                  title="Plate number should be between 1 to 8 characters without special characters."
                  aria-label="plate-number"
              />
              <label 
                className='plate-state-label' 
                htmlFor='plate-state'
              >
              </label>
              <select 
                className='browser-default'
                name='plate-state' 
                value={plateState} 
                onChange={(e) => setPlateState(e.target.value)}
                aria-label='plate-state'
              >
                <option value=''>State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>              
            </article>
            <button
              className="search-btn" 
              aria-label="search-btn"
              onClick={() => {setSuccessMessage('')}}
              disabled={!plateNumber || !plateState}
            >
              Search
            </button>      
          </fieldset>
        </form>
      </section>
      <section className="plate-table">
        {plateTable}
      </section>
      <p>{successMessage}</p>
    </main> 
  )
}

export default ClaimPlate;

