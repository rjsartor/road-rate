import React, { useState, useEffect }  from 'react'; 
import {API_BASE_URL} from '../config';
import MaterialIcon from 'material-icons-react';
import PagesNav from './PagesNav';
import '../styles/reviews/my-reviews.css';

export const MyReviews = () => {
  const [ reviews, setReviews] = useState([]);
  const [ searchInput, setSearchInput ] = useState("");

  const fetchReviews = async () => {
    let url = `${API_BASE_URL}/reviews/${localStorage.userId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.authToken}`,
      }
    });
    const reviews  = await response.json();
    setReviews(reviews)
    return reviews
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  let rating;
  let review;
  let ownerComment;
  let filteredReviews;

  if (reviews.length) {
    filteredReviews = reviews.filter(review => review.plateNumber.includes(searchInput.toUpperCase()));
    review = filteredReviews.map((review, index) => { 
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
    
    if (review.isPositive === 'true') {
      rating = <MaterialIcon icon="thumb_up" />
    } else {
      rating = <MaterialIcon icon="thumb_down" />
    }

    if (review.ownerResponse) {
      ownerComment = 
      <article className="owner-comment">
        <p>Driver Response: {review.ownerResponse}</p>
      </article>    
    } 

      return (
        <li className='review-item' key={index} id={review._id} tabIndex='0'>
        <article className='review-header'>
          <article className='review-title'>
            {/* <img className='isClaimed-icon' src='https://cdn4.iconfinder.com/data/icons/flatastic-11-1/256/user-green-512.png' alt='green user icon'></img> */}
            <p className='plate-name'>{review.plateNumber} {review.plateState}</p>       
            <p className="elapsed-time">{elapsedTime}</p>
          </article>
          
          <article className='review-rating'>
            <p className='rating'>{rating}</p>
          </article>
        </article>        
        <p className='message'>{review.message}</p>
        {ownerComment}
        <p className='review-date'>{dateString}</p>
      </li>
      )
    })
  }

  return (
    <section className="my-reviews">
      <PagesNav />
      <article className='my-reviews-content'>
          <h2>My Reviews</h2>
        <article className="search-section">
          <fieldset id="review-search">
            <legend>Search By License Plate</legend>
            <form 
              id="search-form"
              className="search-form"
            >
              <article className="input-wrapper">
                <label 
                  htmlFor="search"
                  className="search-label"
                  aria-label="search-form"
                >
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  type="search"
                  id="search"
                  name="search"
                  className="search-input"
                  placeholder="2073WE..."
                />
                </label>
              </article>
            </form>
          </fieldset>
        </article>
        <ul className='review-list'>
          {review}
        </ul>
      </article>
    </section>

  );
};

export default MyReviews;
