import client from "./client";

// Lưu job
export const saveJob = (email, jobId) => {
  return client.patch(`/api/post-job/saveJob`, { email }, {
    params: { jobId },
  });
};

// Bỏ lưu job
export const removeSaveJob = (email, jobId) => {
  return client.patch("/api/post-job/removeSaveJob", { email }, {
    params: { jobId },
  });
};
