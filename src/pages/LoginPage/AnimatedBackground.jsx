import React from "react";

const AnimationBackground = ({ bgImage }) => {
  return (
    <>
      <style>{`
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes cardRise { to { opacity: 1; transform: translateY(0); } }
        @keyframes sideReveal { to { opacity: 1; transform: translateX(0); } }
        @keyframes backgroundDrift { from { transform: scale(1.04) translate3d(-5px,-3px,0); } to { transform: scale(1.08) translate3d(12px,5px,0); } }
        @keyframes orbFloat { to { transform: translate3d(-25px,22px,0) scale(1.05); } }
        @keyframes pulse { 70% { box-shadow: 0 0 0 9px rgba(87,231,167,0); } 100% { box-shadow: 0 0 0 0 rgba(87,231,167,0); } }
        @keyframes progressGrow { from { width: 0; } to { width: 87%; } }
        @keyframes particleMove { 
          0% { opacity: 0; transform: translateY(20px); } 
          15% { opacity: 1; } 
          85% { opacity: 0.5; } 
          100% { opacity: 0; transform: translateY(-130px) translateX(35px); } 
        }

        /* Class helper biar animasi pasti jalan di Tailwind JIT */
        .anim-bg-drift { animation: backgroundDrift 22s ease-in-out infinite alternate; }
        .anim-orb { animation: orbFloat 14s ease-in-out infinite alternate; }
        .anim-orb-rev { animation: orbFloat 14s ease-in-out infinite alternate-reverse; }
        
        .particle-dot {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(199,236,255,0.8);
          box-shadow: 0 0 12px rgba(66,165,245,0.9);
          animation-name: particleMove;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0;
        }
      `}</style>

      <div
        className="absolute inset-[-24px] z-[1] bg-cover bg-center bg-no-repeat scale-[1.04] anim-bg-drift"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      ></div>

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `
            linear-gradient(105deg, rgba(4,18,52,.89) 0%, rgba(10,42,102,.82) 42%, rgba(21,101,192,.53) 71%, rgba(4,22,58,.73) 100%),
            radial-gradient(circle at 77% 22%, rgba(66,165,245,.48), transparent 31%),
            radial-gradient(circle at 32% 91%, rgba(0,216,255,.19), transparent 28%)
          `,
        }}
        aria-hidden="true"
      >
        <div className="absolute w-[440px] h-[440px] right-[-170px] top-[-210px] rounded-full blur-[2px] opacity-65 border-2 border-[#69c7ff75] shadow-[0_0_90px_rgba(66,165,245,0.23),inset_0_0_70px_rgba(66,165,245,0.11)] anim-orb"></div>
        <div className="absolute w-[350px] h-[350px] left-[42%] bottom-[-260px] rounded-full blur-[2px] opacity-65 border-[25px] border-[#42a5f51f] anim-orb-rev"></div>
      </div>

      <div
        className="absolute inset-0 z-[3] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="particle-dot"
          style={{
            left: "9%",
            top: "85%",
            animationDuration: "13s",
            animationDelay: "-2s",
          }}
        ></span>
        <span
          className="particle-dot"
          style={{
            left: "26%",
            top: "68%",
            animationDuration: "17s",
            animationDelay: "-8s",
          }}
        ></span>
        <span
          className="particle-dot"
          style={{
            left: "46%",
            top: "91%",
            animationDuration: "15s",
            animationDelay: "-4s",
          }}
        ></span>
        <span
          className="particle-dot"
          style={{
            left: "67%",
            top: "66%",
            animationDuration: "19s",
            animationDelay: "-11s",
          }}
        ></span>
        <span
          className="particle-dot"
          style={{
            left: "82%",
            top: "83%",
            animationDuration: "14s",
            animationDelay: "-5s",
          }}
        ></span>
        <span
          className="particle-dot"
          style={{
            left: "93%",
            top: "52%",
            animationDuration: "20s",
            animationDelay: "-13s",
          }}
        ></span>
      </div>
    </>
  );
};

export default AnimationBackground;
