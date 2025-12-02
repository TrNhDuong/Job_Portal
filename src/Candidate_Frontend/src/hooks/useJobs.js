// src/hooks/useJobs.js
import { useEffect, useState } from "react";
import { fetchJobs } from "../Home/services/home-api";

export default function useJobs(filters) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Thêm state cho phân trang (từ Backend)
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        setLoading(true);
        // Gọi API với filters
      	const res = await fetchJobs(filters); // Sửa: gọi fetchJobs
      	if (mounted) {
          // Lấy 'data' và 'totalPages' từ API
          setJobs(res.data.data || []); // (data nằm trong res.data.data)
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (e) {
      	if (mounted) setError(e?.response?.data?.message || "Lỗi tải Job");
      } finally {
        if (mounted) setLoading(false);
      }
  	}
    
  	run();
  	return () => (mounted = false);
    // Chạy lại mỗi khi 'filters' thay đổi
  }, [JSON.stringify(filters)]); // Dùng JSON.stringify để so sánh object

  return { jobs, loading, error, totalPages };
}