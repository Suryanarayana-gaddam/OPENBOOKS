import { useEffect, useState } from 'react';

const useFetchNumber = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access-token");
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Fetch failed for ${url}`);
                }

                const count = await response.text(); // Assuming the response is a plain number
                const parsedCount = JSON.parse(count); // Parse the count to an integer
                //console.log("parsedCount :",parsedCount,parsedCount.count)
                setData(parsedCount);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchNumber;
