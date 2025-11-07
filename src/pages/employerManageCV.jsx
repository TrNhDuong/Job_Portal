// EmployerManage.jsx
import React, { useState } from "react";
import EmployerManagePosts from "./EmployerManagePosts"; 
import EmployerManageCVs from "./employerManage";
import "./employerManage.css";

export default function EmployerManage({ collapsed }) {
  const [selectedPost, setSelectedPost] = useState(null);

  // Fake posts – you can replace with your real data source
  const posts = [
    { id: 1, title: "Software Engineer", position: "Software Engineer", location: "Quận 1", minSalary: 1000, maxSalary: 2000, currency: "USD", jobType: "Full-time" },
    { id: 2, title: "UI/UX Designer", position: "UI/UX Designer", location: "Thủ Đức", minSalary: 800, maxSalary: 1500, currency: "USD", jobType: "Full-time" },
    { id: 3, title: "Data Analyst", position: "Data Analyst", location: "Gò Vấp", minSalary: 600, maxSalary: 1200, currency: "USD", jobType: "Internship" },
  ];

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  // ✅ STEP 1: When NO job is selected → show “Select a posting”
  if (!selectedPost) {
    return (
      <EmployerManagePosts
        posts={posts}
        collapsed={collapsed}
        onEdit={() => {}}
        onDelete={() => {}}
        onSelect={handleSelectPost} // ✅ NEW
      />
    );
  }

  // ✅ STEP 2: When job selected → show CVs for that job
  return <EmployerManageCVs collapsed={collapsed} post={selectedPost} />;
}
