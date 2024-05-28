// import { useContext } from "react"
// import { AuthContext } from "../src/context/AuthProvider"
// import { useQuery } from "@tanstack/react-query";

// const useCart = () => {
//     const user = useContext(AuthContext);
//     const token = localStorage.getItem("access-token")

//     const {refetch,data:cart = []} = useQuery({
//         queryKey: ['carts', user?.user?.email],
//         queryFn: async () => {
//           const response = await (fetch(`http://localhost:5000/userByEmail/${user?.user?.email}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json", // Set content type header explicitly
//               authorization : `${token}`
//             },
//           })
//             .then(res => {
//               if (!res.ok) {
//                 return res.json().then(error => {
//                   console.error("Error fetching user data:", error);
//                   // Handle the error (e.g., display a message to the user)
//                 });
//               }
//               return res.cart.json(); // Parse valid JSON response
//             }))
//           return response.json()
//         },
//     })
//     return [cart,refetch]
// }

// export default useCart


import { useContext } from "react";
import { AuthContext } from "../src/context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useCart = () => {
    const user = useContext(AuthContext);
    const token = localStorage.getItem("access-token");
    
    const { refetch, data: cart = [] } = useQuery({
        
        queryKey: ['carts', user?.user?.email],
        queryFn: async () => {
            try {
                const response = await fetch(`http://localhost:5000/userByEmail/${user?.user?.email}`, {
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
                return responseData.cart; // Assuming the cart data is in a 'cart' property
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle the error (e.g., display a message to the user)
                return []; // Return an empty array or handle the error state appropriately
            }
        },
    });

    return [cart, refetch];
};

export default useCart;
