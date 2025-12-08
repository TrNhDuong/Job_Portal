import React from "react";
import "../styles/PointDisplay.css";
import { HiOutlineCreditCard } from "react-icons/hi";

const PointDisplay = ({ points }) => {

  return (
    <div className="point-display-container">
      {/* Background Decoration */}
      <div className="tech-bg-decoration"></div>

      <div className="point-circle">
        <div className="point-content">
            <div className="point-icon-wrapper">
                <HiOutlineCreditCard />
            </div>
            
            <span className="label-points">Số dư khả dụng</span>
            
            <h1 className="point-number">
                {points ? points.toLocaleString() : 0}
            </h1>

            <span className="currency-unit">ĐIỂM</span>
        </div>
      </div>
    </div>
  );
};

export default PointDisplay;