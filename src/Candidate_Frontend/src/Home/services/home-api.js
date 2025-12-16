import axios from "axios";
import client from "../../api/client";

export const fetchFeaturedJobs = () => client.get("/api/post-job/filter");
export const fetchFeaturedBrands = () => client.get("/api/employer/feature");

export const fetchJobs = (filters) => {
  const params = new URLSearchParams(filters);
  return client.get(`/api/post-job/filter?${params.toString()}`);
};