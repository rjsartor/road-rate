import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthTasks } from '../hooks/use-auth-tasks';
import icon from '../assets/thumbs-up.png';
import '../styles/navbars/dashboard-nav.css';

const PagesNav = () => {
  const navigate = useNavigate();
  const { handleLogout, loginWithRedirect } = useAuthTasks();
  const accessToken = localStorage.getItem('accessToken');

  // todo: routes consts
  const claimPlate = "/claim-plate";
  const myPlates = "/my-plates";
  const myReviews = "/my-reviews";

  const handleLogoClick = () => {
    navigate(accessToken ? '/dashboard' : '/');
  };

  return (
    <main className="pages-nav">
      <div className="logout-div">
        {accessToken ? (
          <button className="logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <button className="add-review" onClick={loginWithRedirect}>
            Login
          </button>
        )}
      </div>
      <section className="logo-wrapper">
        <ul className="header-logo">
          <li onClick={handleLogoClick} className="header">
            <h1>RoadRate</h1>
          </li>
          <li className="icon">
            <img src={icon} alt="RoadRate icon" className="icon" />
          </li>
        </ul>
      </section>
      <section className="header-middle-area">
        <nav className="main-nav" id="main-nav">
          {accessToken && (
            <ul className="main-sections">
              <li className="claim-plate">
                <Link to={claimPlate} className="claim-link">
                  <span>Claim Plate</span>
                </Link>
              </li>
              <li className="my-plates">
                <Link to={myPlates} className="my-plates-link">
                  <span>My Plates</span>
                </Link>
              </li>
              <li className="my-reviews">
                <Link to={myReviews} className="my-reviews-link">
                  <span>My Reviews</span>
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </section>
    </main>
  );
};

export default PagesNav;
