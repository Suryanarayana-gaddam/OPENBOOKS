import { useContext } from "react";
import { AuthContext } from "../src/context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
    const {user,settingActiveUser} = useContext(AuthContext);
    const token = localStorage.getItem("access-token");
    const userEmail = user?.email || user?.user?.email ;
    const fetchUserData = async () => {
        try {
            const response = await fetch(`https://book-store-api-theta.vercel.app/userByEmail/${userEmail}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            
            const responseData = await response.json();
            settingActiveUser(responseData);
            return responseData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return {};
        }
    };

    const { refetch, data: userData = {} } = useQuery({
        queryKey: ['userData', userEmail],
        queryFn: fetchUserData,
        enabled: !!user,
    });
    return [userData, refetch];
};

export default useUser;

