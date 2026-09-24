import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const [lampOn, setLampOn] = useState(true);
  const [isFlickering, setIsFlickering] = useState(false);
  
  const overlayRef = useRef(null);
  const beamRef = useRef(null);
  const officerTipRef = useRef(null);

  // Toggle Lampu + Flicker Effect
  const toggleLamp = () => {
    setIsFlickering(true);
    setTimeout(() => {
      setIsFlickering(false);
      setLampOn((prev) => !prev);
    }, 250);
  };

  // Keyboard Event "L"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "l") toggleLamp();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Spotlight & Mouse Movement Tracking (DIBALIKIN LAGI)
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMove = (e) => {
      if (e.touches) {
        mouseX = e.touches.clientX;
        mouseY = e.touches.clientY;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: true });

    let reqId;
    const renderLight = () => {
      // 1. Update Dark Overlay Radial Gradient
      if (overlayRef.current) {
        overlayRef.current.style.background = `radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, transparent 0%, rgba(3, 9, 20, 0.98) 100%)`;
      }

      // 2. Update Cahaya Senter (Nempel di ujung SVG Petugas)
      if (beamRef.current && officerTipRef.current) {
        const rect = officerTipRef.current.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        
        const dx = mouseX - startX;
        const dy = mouseY - startY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Dinamis ngikutin kursor
        beamRef.current.style.transform = `translate(${startX}px, ${startY}px) translateY(-50%) rotate(${angle}deg)`;
        beamRef.current.style.width = `${distance + 150}px`; 
      }
      
      reqId = requestAnimationFrame(renderLight);
    };
    reqId = requestAnimationFrame(renderLight);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden select-none transition-colors duration-700
        ${lampOn ? "bg-gradient-to-br from-[#062B4F] via-[#082D58] to-[#0B2340]" : "bg-[#030914] cursor-crosshair"}
        ${isFlickering ? "animate-flicker" : ""}
      `}
      onClick={toggleLamp}
    >
      {/* LAYER 0: Background Blobs & EFEK KABUT (FOG) */}
      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${lampOn ? 'opacity-100' : 'opacity-20'}`}>
        {/* Blobs Lama */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#4DA3FF]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-[#FFF8D6]/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* 🔥 NEW: Kabut Asap di Sudut Layar */}
        <div className="absolute -bottom-20 -left-20 w-[60vw] h-[40vh] bg-[#6CC7FF]/10 blur-[100px] animate-fog"></div>
        <div className="absolute -bottom-20 -right-20 w-[70vw] h-[50vh] bg-[#FFF8D6]/5 blur-[120px] animate-fog animation-delay-4000"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[40vh] bg-[#4DA3FF]/5 blur-[100px] animate-fog animation-delay-2000"></div>
      </div>

      {/* LAYER 1: SVG Petugas di Kiri Atas */}
      <div className="absolute top-[5%] md:top-[8%] left-[1%] md:left-[2%] w-[250px] md:w-[320px] pointer-events-none z-10 animate-breathe">
        <img src="/officer.svg" alt="Officer" className="w-full h-auto drop-shadow-2xl" />
        
        {/* Anchor point ujung senter (Tweak persenannya kalau kurang nempel) */}
        <div 
          ref={officerTipRef}
          className="absolute w-2 h-2"
          style={{ top: '41%', left: '45%' }} 
        ></div>
      </div>

      {/* LAYER 2: Cone Light Beam (Tracking Mouse) */}
      <div 
        ref={beamRef}
        className={`absolute top-0 left-0 pointer-events-none z-20 mix-blend-screen transition-opacity duration-500 origin-left ${lampOn ? 'opacity-60' : 'opacity-90'}`}
        style={{
          height: '280px',
          background: 'linear-gradient(90deg, rgba(255,248,214,0.85) 20%, rgba(255,248,214,0.1) 70%, transparent 100%)',
          clipPath: 'polygon(0 45%, 100% 0, 100% 100%, 0 55%)',
          willChange: 'transform, width'
        }}
      ></div>

      {/* LAYER 3: Konten Utama 404 */}
      <div className="relative z-30 flex flex-col items-center justify-center w-full h-full text-center pointer-events-none">
        <div className="animate-float drop-shadow-2xl mt-10">
          <h1 className="text-404 tracking-tight">404</h1>
        </div>

        <div className="mt-6 space-y-4 px-4 max-w-2xl text-[#FFF8D6] animate-float animation-delay-2000">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide drop-shadow-md">
            Hello?? Is somebody there?!?
          </h2>
          <p className="text-lg md:text-xl text-[#4DA3FF] leading-relaxed drop-shadow-sm">
            Halaman yang Anda cari mungkin sudah dipindahkan,<br className="hidden md:block"/>
            dihapus, atau memang tidak pernah ada.
          </p>
        </div>

        <div className="mt-12 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              navigate("/");
            }}
            className="group relative px-8 py-4 bg-[#4DA3FF] text-[#062B4F] font-bold text-lg rounded-full overflow-hidden shadow-[0_0_20px_rgba(77,163,255,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(77,163,255,0.7)] active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-[#FFF8D6] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Kembali ke Beranda
            </span>
          </button>
        </div>
        
        <p className="mt-8 text-sm text-[#4DA3FF]/70 pointer-events-auto">
          💡 Klik dimana saja atau tekan <kbd className="bg-[#4DA3FF]/20 px-2 py-1 rounded">L</kbd> untuk toggle lampu
        </p>
      </div>

      {/* LAYER 4: Dark Overlay Masking (Nyala Pas Lampu Mati) */}
      <div 
        ref={overlayRef}
        className={`absolute inset-0 pointer-events-none z-40 transition-opacity duration-700
          ${lampOn ? "opacity-0" : "opacity-100"}
        `}
        style={{ willChange: 'background' }}
      ></div>
    </div>
  );
};

export default NotFound;