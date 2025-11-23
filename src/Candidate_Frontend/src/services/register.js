import client from "../api/client";

// Đăng ký người tìm việc
export async function registerCandidate({ email, password, name }) {
  const res = await client.post("/api/candidateRegister", { email, password, name });
  return res.data;
}

// Đăng ký nhà tuyển dụng
export async function registerEmployer({ email, password, company, address, phone }) {
  const res = await client.post("/api/employerRegister", { email, password, company, address, phone });
  return res.data;
}
