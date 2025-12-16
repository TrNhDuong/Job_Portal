// src/hooks/useJobs.js
import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

function buildQuery(filters) {
  const params = new URLSearchParams();

  const safe = { limit: 10, page: 1, ...(filters || {}) }; 

  Object.entries(safe).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    params.set(k, String(v));
  });

  return params.toString();
}

export default function useJobs(filters) {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => buildQuery(filters), [filters]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await client.get(`/api/post-job/filter?${queryString}`);

        const data = res?.data?.data;

        const list = Array.isArray(data) ? data : (data?.jobs || []);
        const tp = Array.isArray(data) ? 1 : (data?.totalPages || 1);
        const tt = Array.isArray(data) ? list.length : (data?.total || list.length);

        if (!mounted) return;

        setJobs(list);
        setTotalPages(tp);
        setTotal(tt);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || "Lỗi tải jobs");
        setJobs([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [queryString]);

  return { jobs, totalPages, total, loading, error };
}
