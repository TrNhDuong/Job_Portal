import React, { useMemo } from "react";
import "../styles/PointDisplay.css";

const PointDisplay = ({ points }) => {
  
  const membershipInfo = useMemo(() => {
    if (points >= 5000) return { title: "Đối tác Kim Cương 💎", className: "badge-diamond" };
    if (points >= 2000) return { title: "Đối tác Vàng 🥇", className: "badge-gold" };
    if (points >= 500) return { title: "Hội viên Tiềm năng 🥈", className: "badge-silver" };
    return { title: "Hội viên Mới 🌱", className: "badge-starter" };
  }, [points]);

  return (
    <div className="point-display-container">
      {/* Background Decoration */}
      <div className="tech-bg-decoration"></div>

      <div className="point-circle">
        <div className="point-content">
            <div className="icon-plus">+</div>
            <h1 className="point-number">{points}</h1>
            <span className="label-points">điểm</span>
            
            {/* Badge hiển thị cấp bậc */}
            <div className={`membership-badge ${membershipInfo.className}`}>
                {membershipInfo.title}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PointDisplay;