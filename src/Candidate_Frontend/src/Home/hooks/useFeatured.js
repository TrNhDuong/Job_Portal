// src/Frontend/src/hooks/useFeatured.js
import { useEffect, useState } from "react";

function normalizeToArray(res) {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && Array.isArray(res.jobs)) return res.jobs;

  const payload = res?.data?.data;

  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && Array.isArray(payload.jobs)) return payload.jobs;

  return [];
}

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
        setError("");

        const res = await fetcher();
        const list = normalizeToArray(res);

        if (mounted) setData(list);
      } catch (e) {
        if (mounted) {
          setError(e?.response?.data?.message || e?.message || "Fetch error");
          setData([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [enabled, fetcher]);

  return { data, loading, error };
}
