// src/hooks/useFeatured.js

import { useEffect, useState } from "react";

export default function useFeatured(fetcher, enabled = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!enabled) return;
      try {
        setLoading(true);
        const res = await fetcher();
        
        // *** SỬA LỖI Ở DÒNG DƯỚI ĐÂY ***
        // Thay "res.data" thành "res.data.data"
        if (mounted) setData(res.data.data || []); 

      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || "Fetch error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => (mounted = false);
  }, [enabled, fetcher]);

  return { data, loading, error };
}