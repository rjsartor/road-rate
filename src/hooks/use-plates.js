import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export const usePlates = (user) => {
    const [plates, setPlates] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchPlates = async () => {
          const res = await fetch(`${API_BASE_URL}/plates/all/${user.id}`)
          const plates = await res.json();

          if (plates) {
            setPlates(plates);
            localStorage.setItem('hasPlates', plates)   
          }
        }
    
        fetchPlates();
      }, [user]);


    return { plates };
}