import { useContext } from "react";
import { AuthContext } from "../src/context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useCart = () => {
    const user = useContext(AuthContext);
    const token = localStorage.getItem("access-token");

    const { refetch, data: userData = { } } = useQuery({
        
        queryKey: ['userData', user?.user?.email],
        queryFn: async () => {
            try {
                const response = await fetch(`https://book-store-api-theta.vercel.app/userByEmail/${user?.user?.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cart data");
                }

                const responseData = await response.json();
                console.log("response: ",responseData.username,"resdata: ",responseData)
                return responseData; 
            } catch (error) {
                console.error("Error fetching user data:", error);
                return { }; 
            }
        },
        enabled: !user,   

    });

    return [userData, refetch];
};

export default useCart;
