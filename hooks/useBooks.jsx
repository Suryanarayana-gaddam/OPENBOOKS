import { useQuery } from "@tanstack/react-query";

const useBooks = () => {
    const token = localStorage.getItem("access-token");
    
    const { refetch, data: allBooks = [] ,error} = useQuery({
        queryKey: "books",
        queryFn: async () => {
            try {
                const response = await fetch("https://book-store-api-theta.vercel.app/all-books", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cart data");
                }

                return await response.json();
            } catch (error) {
                console.error("Error fetching user data:", error);
                return []; 
            }
        },
    });

    return [allBooks, refetch,error];
};

export default useBooks
