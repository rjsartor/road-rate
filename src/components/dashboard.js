import React, { useState } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import PagesNav from './PagesNav';
import { useAuthTasks } from '../hooks/use-auth-tasks';
import { usePlates } from '../hooks/use-plates';
import '../styles/pages/dashboard.css';


export const Dashboard = () => {
const [submitReview, setSubmitReview ] = useState(false);

const { isLoading, userInfo } = useAuthTasks();
const { plates } = usePlates(userInfo);

  if (isLoading) return <p>Authenticating...</p>

  return (
    <main className="dashboard">
      <PagesNav />
      <section className="dashboard-greeting">
        <p className="greeting-text">hey there, {userInfo?.username}</p>
      </section>
      <button 
          className="add-review"
          onClick={ e => {
              e.preventDefault(); 
              setSubmitReview(!submitReview); 
            }
          }>
          <span className="new-review">New Review</span>
      </button>
      {submitReview && <ReviewForm plates={plates} />}
      <ReviewList /> 
    </main> 
  )
}

export default Dashboard;
