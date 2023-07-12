import { useCallback, useEffect, useState } from "react";
import { findOrCreateUser } from "../auth/Auth0Provider";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const useAuthTasks = () => {
    const { isAuthenticated, isLoading, user, getIdTokenClaims, logout, loginWithRedirect } = useAuth0();

    const [userInfo, setUserInfo] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();

  const getAccessToken = useCallback(async () => {
    try {
      const idTokenClaims = await getIdTokenClaims();
      const accessToken = idTokenClaims.__raw;
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      console.error('Failed to get access token:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const fetchUserInfo = useCallback(async () => {
    try {
        const _user = await findOrCreateUser({
          email: user.email,
          username: user.nickname,
          name: `${user?.given_name} ${user?.family_name}`,
        });

        if (setUserInfo) setUserInfo(_user);
        localStorage.setItem("user", JSON.stringify(_user));
        localStorage.setItem("userId", _user.id);
    } catch (error) {
      console.error('Failed to fetch user information:', error);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    logout();
  }

  useEffect(() => {
    if (isLoading || accessToken) return;

    // Call the function to get the access token
    getAccessToken();
    fetchUserInfo();
  }, [isLoading, isAuthenticated, accessToken, navigate, getAccessToken, fetchUserInfo]);

  return {
    isAuthenticated,
    isLoading,
    userInfo,
    user,
    accessToken,
    loginWithRedirect,
    handleLogout,
  }
}