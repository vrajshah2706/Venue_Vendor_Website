import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

export const useVendorInsights = (range: string) => {
    const { currentUser } = useAppContext();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    `http://localhost:3001/vendors/${currentUser.id}/insights`,
                    { params: { range } }
                );

                setData(res.data);
            } catch (err) {
                setError("Failed to load insights");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, range]);

    return { data, loading, error };
};