import React, { useState, useEffect }  from 'react'; 
import {API_BASE_URL} from '../config';
import Review from './Review';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';
import '../styles/public-plate.css';

export const PublicPlate = () => {
  const [plate, setPlate] = useState('');
  const [plateId, setPlateId] = useState('');
  const [ reviews, setReviews] = useState('');

  const fetchPlate = async () => {
    /* ==== extract plateId from url ==== */
    console.log('address: ',document.location.href);
    const address = document.location.href;
    const plateId = address.substring((address.indexOf('d')+ 2), address.length);
    setPlateId(plateId)
    console.log('plateId from addressbar: ',plateId)
    
    /* ==== fetch plate info using plateId ==== */
    let plateUrl = `${API_BASE_URL}/plates/${plateId}`;
    console.log(plateUrl)
    const res = await fetch(plateUrl);
    const plate  = await res.json();
    // console.log('plate: ',plate);
    setPlate(plate)

    /* ==== fetch reviews using plateId ==== */
    let reviewURL = `${API_BASE_URL}/reviews/plate/${plateId}`;
    // console.log('fetchReviews url: ', reviewURL)
    const response = await fetch(reviewURL);
    const reviews  = await response.json();
    setReviews(reviews)
    return reviews
  }

    useEffect(() => {
      fetchPlate()
    }, []);

  // console.log('plate data: ', plate)
  // console.log('reviews: ', reviews)

  let _plate = (
    <div className="spinner" style={{margin: '0 auto'}}>
      <Spinner name="line-spin-fade-loader" color="green"/>
    </div>
  )

    let rating;
    let review = (
      <div className="spinner" style={{margin: '0 auto'}}>
        <Spinner name="line-spin-fade-loader" color="green"/>
      </div>
    )

    let driverComment;

    if (reviews) {
      review = reviews.map((review, index) => { 
        if (review.isPositive === 'true') {
          rating = <MaterialIcon icon="thumb_up" />
        } else {
          rating = <MaterialIcon icon="thumb_down" />
        }

        if (review.comment) {
          driverComment = <p> Driver Response: {review.comment}</p>
        } 

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
                <p id="elapsed-time">{elapsedTime}</p>
              </article>
              
              <article className='review-rating'>
                <p className='rating'>{rating}</p>
              </article>
            </article>        
            <p className='message'>Review: {review.message}</p>
            <p>{driverComment}</p>
            <p id='review-date'>{dateString}</p>
          </li>
        )
      })
    };
  
    if(plate){
      let karmaStyling;
      if (plate.karma > 0) {
        karmaStyling = 'public-plate-wrapper-positive'
      } else if (plate.karma < 0) {
        karmaStyling = 'public-plate-wrapper-negative'

      }
      console.log('fetching plate: ', plate)
      _plate = (
        <div className={karmaStyling}>
          <h2 id={plateId}>{plate.plateNumber}</h2>
          <p>State: {plate.plateState}</p>
          <p>Karma: {plate.karma}</p>
        </div>
      )
    }

  return (
    /* FETCHING PUBLIC PLATES & REVIEWS 
    - An unregistered user can share this unique endpoint & render all plate info & its associated reviews
    - Ex: http://localhost:3000/plate/id/5c7082ce36aad20017f75ef8
    - Tested on Chrome, Firefox, & Safari
    - Doesn't rely on localStorage
    */
    <div className="plate">
      <Link to="/" className="plates-back-link">
        Go Back
      </Link>
     
      {_plate}
    
      <ul className='review-list'>
        {review}
      </ul>
    </div>

  );
};

export default PublicPlate;
