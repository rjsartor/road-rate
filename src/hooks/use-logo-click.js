import { useNavigate } from "react-router-dom";

export const useLogoClick = (accessToken) => {
    const navigate = useNavigate();
    return navigate(accessToken ? '/dashboard' : '/');
}