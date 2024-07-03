import { useContext } from "react";
import { AuthContext } from "../src/context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useCart = () => {
    const user = useContext(AuthContext);
    const token = localStorage.getItem("access-token");
    const userEmail = user?.user?.email || user?.email ;
    const { refetch, data: cart = [] } = useQuery({
        
        queryKey: ['carts', userEmail],
        queryFn: async () => {
            try {
                const response = await fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
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
                return responseData.cart; 
            } catch (error) {
                console.error("Error fetching user data:", error);
                return []; 
            }
        },
        enabled: !user,   
    });

    return [cart, refetch];
};

export default useCart;
