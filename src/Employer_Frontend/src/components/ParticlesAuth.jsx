import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesAuth = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false }, // Chỉ hiện trong khung chứa nó
        background: {
          color: { value: "transparent" }, // Nền trong suốt (để hiện nền gradient CSS bên dưới)
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Hiệu ứng hút chuột
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 200,
              line_linked: { opacity: 0.5 },
            },
          },
        },
        particles: {
          color: { value: "#ffffff" }, // Màu hạt
          opacity: { value: 0.6 },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.4, // Độ mờ dây nối
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 1.5, // Tốc độ bay
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 60, // Số lượng hạt
          },
          // opacity: { value: 0.3 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1, // Nằm trên nền màu, dưới chữ
      }}
    />
  );
};

export default ParticlesAuth;