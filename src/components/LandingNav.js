import React from 'react';
import '../styles/navbars/landing-nav.css';
import '../styles/modal.css';
import { useAuth0 } from "@auth0/auth0-react";

export const LandingNav = () => {

    // const [modalOpen, setModalOpen] = useState(false);
    // const onClose = () => setModalOpen(false);

    // const clickOutside = (ref, onClose) => {
    //     const statusChange = (e) => {
    //         if (!ref.current.contains(e.target)){
    //             setModalOpen(modalOpen)
    //             onClose();
    //         }
    //     }
    //     document.addEventListener('click', statusChange)
    //     return function cleanup() {
    //         document.removeEventListener('click', statusChange)
    //     }
    // }

    // const LoginModal = ({ title, onClose }) => {
    //   const modalRef = useRef(null);

    //   useEffect(() => clickOutside(modalRef, onClose))

    //     return (
    //         <div className="overlay">
    //           <div className="modal">
    //             <h2>{title}</h2>
    //             <div className="login-content" ref={modalRef}>
    //             <LoginForm />
    //             </div>
    //           </div>
    //         </div>
    //       );
    //   }     
      
    const { loginWithRedirect } = useAuth0();

  return(
    <div className="navbar">
        <ul className="nav-list">
            <li className="nav-item">
                {/* <Link to="/register" className="register-link">Register</Link> */}
            </li>
            <li className="nav-item">
                <button className="add-review" onClick={() => loginWithRedirect()}>Login</button>
            </li>
        </ul>
    </div>
  )
}

export default LandingNav;