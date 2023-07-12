
import React, { useState, useEffect }  from 'react'; 
import {API_BASE_URL} from '../config';
import MaterialIcon from 'material-icons-react'; 
import OwnerResponseForm from './owner-response-form';
import PagesNav from './PagesNav';
import '../styles/plates/single-plate.css';

export const MyPlate = () => {
  const [ reviews, setReviews] = useState("");
  const [ plate, setPlate ] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [ submitResponse, setSubmitResponse] = useState('');
  const [ unclaimMessage, setUnclaimMessage ] = useState('');
  const [ unclaimWarning, setUnclaimWarning ] = useState('');

  const fetchReviewsByPlateId = async () => {
    let url = `${API_BASE_URL}/reviews/my-plates/${localStorage.myPlateId}`;
    const response = await fetch(url);
    const reviews  = await response.json();
    setReviews(reviews)
    return reviews
  }

  const fetchKarma = async () => {
    let url = `${API_BASE_URL}/plates/${localStorage.myState}/${localStorage.myPlate}`;
    const response = await fetch(url);
    const [ plate ]  = await response.json();
    setPlate(plate)
    return plate
  }
 
  useEffect(() => {
    fetchReviewsByPlateId()
    fetchKarma();
  }, []);

   /* ========= UPDATE AN EXISTING PLATE ========== */
  // PUT call linking an existing plate to the current user
  const unClaimPlateClick = e => {
    e.preventDefault(e);
    const userId = localStorage.userId;
 
    localStorage.setItem('unclaimedPlate', localStorage.myPlate)

    return fetch(`${API_BASE_URL}/plates/unclaim/${localStorage.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.authToken}`
      },
      body: JSON.stringify({
        userId,
        plateNumber: localStorage.myPlate,
        plateState: localStorage.myState
      })
    })
    .then(res => {
      localStorage.setItem('success', 'unclaimed')
      setUnclaimMessage(`You successfully unclaimed this plate.`)
      return res.json();
    })
    .catch(err => {
      // alert("We're sorry. Something went wrong.")
      console.log(err);
    });
  }

  let rating;
  let review;
 
  if (reviews) {
    review = reviews.map((review, index) => { 
      let ownerComment;
      if (review.isPositive === 'true') {
        rating = <MaterialIcon icon="thumb_up" />
      } else {
        rating = <MaterialIcon icon="thumb_down" />
      }
 
      let responseButton;

      if (review.ownerResponse) {
        ownerComment = <p>Your Response: {review.ownerResponse}</p>
      } else {
        responseButton = <button id="owner-response-btn" onClick={() => {
          localStorage.setItem('submitResponse', review._id);
          setSubmitResponse(review._id)
        }       
      }>Leave a response</button>
      }

      let responseForm;
      if (localStorage.submitResponse === review._id) {
        responseForm = <OwnerResponseForm reviewId={review._id} fetchReviews={fetchReviewsByPlateId()}/>
        responseButton = <button id="owner-response-btn" onClick={() => {
          localStorage.removeItem('submitResponse')
          setSubmitResponse('')}
        }>Cancel</button>
      } 
     
      // =========Time Stuff===========
      const thisDate = new Date();
        
      const date = new Date(review.createdAt)
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      const day = date.getDate();
      let minutes = date.getMinutes();
      let hour = date.getHours();

      //add 0 for times less than 10
      if (minutes < 10) {
        minutes = '0' + minutes
      }

      let hourTime;
      hour > 12 ? hourTime = `${hour - 12}:${minutes} PM ` : hourTime = `${hour}:${minutes} AM `
      
      //convert month number to month word
      switch (month) {
        case '1':
          month = 'Jan'
          break;
        case '2':
          month = 'Feb'
          break;
        case '3':
          month = 'Mar'
          break;
        case '4':
          month = 'Apr'
          break;
        case '5':
          month = 'May'
          break;
        case '6':
          month = 'Jun'
          break;
        case '7':
          month = 'Jul'
          break;
        case '8':
          month = 'Aug'
          break;
        case '9':
          month = 'Sep'
          break;
        case '10':
          month = 'Oct'
          break;
        case '11':
          month = 'Nov'
          break;
        case '12':
          month = 'Dec'
          break;
        default:
          month = null
        }
      
      let yearTime = ` - ${day} ${month} ${year}`
      const dateString = hourTime + yearTime;

      const timePassed = thisDate - date;

      let elapsedTime;
      const convert = (ms) => {
        let d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;

        if (d < 1 && h < 1) {
          elapsedTime = `${m}m ago`
        } else if (d < 1 && h < 2) {
          elapsedTime = `${h}hr ago`
        } else if (d < 1 && h > 2) {
          elapsedTime = `${h}hrs ago`
          //this will need to be updated for short months
        } else if (d === 1) {
          elapsedTime = `${d} day ago`
        } else if (d > 1 && d < 31) {
          elapsedTime = `${d} days ago`
        } else if (d > 31 && d < 62) {
          elapsedTime = `1 month ago`
        }
      };

      if (timePassed) {
        convert(timePassed)
      }
     
      return (
        <li className='review-item' key={index} id={review._id} tabIndex='0'>
          <article className='review-header'>
            <article className='review-title'>
              {/* <img className='isClaimed-icon' src='https://cdn4.iconfinder.com/data/icons/flatastic-11-1/256/user-green-512.png' alt='green user icon'></img> */}
              <p className='plate-name'>{review.plateNumber}</p>       
              <p className="elapsed-time">{elapsedTime}</p>
            </article>
            
            <article className='review-rating'>
              <p className='rating'>{rating}</p>
            </article>
          </article>        
          <p className='message'>{review.message}</p>
          <article className="owner-comment">
              {ownerComment}
            </article>
          {responseButton}
          {responseForm}
          <p className='review-date'>{dateString}</p>
        </li>
      )
    })
  };

  let karmaStyling;
  if (plate.karma > 0) {
    karmaStyling = 'public-plate-wrapper-positive'
  } else if (plate.karma < 0) {
    karmaStyling = 'public-plate-wrapper-negative'
  } else {
    karmaStyling = 'public-plate-wrapper-neutral'
  }

  let unClaimButton = (<button id="unregister-plate-btn" onClick={() => setUnclaimWarning(!unclaimWarning)}>Unclaim this plate</button>)
  let confirmButton;
  let areYouSureMessage;
  let noButton;

  if (unclaimWarning) {
    confirmButton = (
      <button
        className='confirm-buttons'
        id="unclaim-plate-btn-confirm"
        onClick={e => unClaimPlateClick(e)}
        disabled={localStorage.success === 'unclaimed'}
      >Yes</button>)
    noButton = (
      <button
        className='confirm-buttons'
        id="unclaim-plate-btn-no"
        onClick={() => setUnclaimWarning(!unclaimWarning)}
      >
        No
      </button>
    )
    areYouSureMessage = <p>Are you sure?</p>
  }

  if (unclaimMessage) {
    confirmButton = '';
    noButton = '';
    unClaimButton = '';
    areYouSureMessage = '';
  }
  return (
    <main className="plate-div"> 
      <PagesNav />
      {/* ===== PLATE DETAILS ===== */} 
        <section className={karmaStyling}>
          <article className='plate-content'>
            <article className="plate-title">
              <h2 id={plate.plateId}>{plate.plateNumber}</h2>     
            </article>

            <article className="plate-info">
              <p>State: {plate.plateState}</p>
              <p>Karma: {plate.karma}</p>       
            </article>
          </article>
        </section>
      {/* ===== PLATE REVIEW LIST ===== */} 
      <ul className='review-list'>
        {review}
      </ul> 
      {/* ===== UNCLAIM A PLATE ===== */} 
      <section className="unclaim-div">
        {unClaimButton}
        <article className="unclaim-options">
          {areYouSureMessage}
          <article className="buttons-div">
            {confirmButton} 
            {noButton}                   
          </article>
          {unclaimMessage ? (<p>{unclaimMessage}</p>) : (<p></p>)}        
        </article>
      </section>
    </main>
  );
};

export default MyPlate;