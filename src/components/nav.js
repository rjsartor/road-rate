import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './login-form';
import RegistrationForm from './registration-form';
import About from './about.js';
import '../styles/nav.css';
import '../styles/modal.css';

export const Nav = () => {

    const [modalOpen, setModalOpen] = useState(false);

    // const onButtonClick = () => setModalOpen(true);
    const onClose = () => setModalOpen(false);
    // const loginRef = useRef(null);
    // const registerRef = useRef(null);

    // useEffect(() => clickButton(loginRef, registerRef))


    // const clickButton = (ref1, ref2) => {
    //     const statusChange = (e) => {
    //         if (!ref1.current.contains(e.target)){
    //             setModalOpen(modalOpen)
    //         }
    //         else if (!ref2.current.contains(e.target)){
    //             setModalOpen(modalOpen)
    //         }
    //     }
    //     document.addEventListener('click', statusChange)
    //     return function cleanup() {
    //         document.removeEventListener('click', statusChange)
    //     }
    // }

    const clickOutside = (ref, onClose) => {
        const statusChange = (e) => {
            if (!ref.current.contains(e.target)){
                setModalOpen(modalOpen)
                onClose();
            }
        }
        document.addEventListener('click', statusChange)
        return function cleanup() {
            document.removeEventListener('click', statusChange)
        }
    }

    const LoginModal = ({ title, onClose }) => {
      const modalRef = useRef(null);

      useEffect(() => clickOutside(modalRef, onClose))

        return (
            <div className="overlay">
              <div className="modal">
                <h2>{title}</h2>
                <div className="login-content" ref={modalRef}>
                <LoginForm />
                </div>
              </div>
            </div>
          );
      }       

    const RegisterModal = ({ title, onClose }) => {
        const modalRef = useRef(null);
  
        useEffect(() => clickOutside(modalRef, onClose))
  
        return (
            <div className="overlay">
              <div className="modal">
                <h2>{title}</h2>
                <div className="register-content" ref={modalRef}>
                <RegistrationForm />
                </div>
              </div>
            </div>
          );
    }       

  return(

  <div className="navbar">
    <ul className="nav-list">
        <div className='left-nav'>
            <li className="nav-item"> 
                <About />
            </li>
        </div>

        <div className='right-nav'>
                <li className="nav-item">
                    <button className="login-button" id="login-button" onClick={() => setModalOpen('login')}>Login</button>
                    {modalOpen && (
                        <LoginModal
                            show={modalOpen === 'login'}
                            toggleModal={setModalOpen}
                            title="Login"
                            onClose={onClose}
                        />
                    )}
                </li>

                <li className="nav-item">
                    <button className="registration-button" id="registration-button" onClick={() => setModalOpen('register')}>Register</button>
                    {modalOpen && (
                        <RegisterModal
                            show={modalOpen === 'register'}
                            toggleModal={setModalOpen}
                            title="Register"
                            onClose={onClose}
                        />
                    )}
                </li>
            </div>

            {/* <li className="nav-item">
                <Link to="/register" className="register-link">Register</Link>
            </li> */}
    </ul>
  </div>
  )
}

export default Nav;