import React from "react";

interface LanguageLogoProps {
  languageId: string;
  size?: number;
  className?: string;
}

export function LanguageLogo({
  languageId,
  size = 20,
  className = "",
}: LanguageLogoProps) {
  const normId = (languageId || "").toLowerCase();

  switch (normId) {
    case "python":
    case "py":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M63.07 14c-26.68 0-25.1 11.57-25.1 11.57l.03 11.99h25.5v3.6H29.17S14 39.46 14 66.38c0 26.93 13.23 25.96 13.23 25.96h7.9v-11.08s-.42-13.22 13.01-13.22h25.32v-3.8h-25.5s-12.8.56-12.8-12.27c0-12.82 11.2-12.27 11.2-12.27h34.62s11.58.4 11.58-11.33c0-11.73-8.8-14.37-24.49-14.37zm-13.78 7.37a3.84 3.84 0 1 1 0 7.68 3.84 3.84 0 0 1 0-7.68z"
            fill="#387EB8"
          />
          <path
            d="M64.93 114c26.68 0 25.1-11.57 25.1-11.57l-.03-11.99h-25.5v-3.6h34.33S114 88.54 114 61.62c0-26.93-13.23-25.96-13.23-25.96h-7.9v11.08s.42 13.22-13.01 13.22H54.54v3.8h25.5s12.8-.56 12.8 12.27c0 12.82-11.2 12.27-11.2 12.27H47.02s-11.58-.4-11.58 11.33c0 11.73 8.8 14.37 24.49 14.37zm13.78-7.37a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68z"
            fill="#FFE052"
          />
        </svg>
      );

    case "javascript":
    case "js":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="128" height="128" rx="16" fill="#F7DF1E" />
          <path
            d="M34 100.2c4.4 2.6 9.8 4.2 15.6 4.2 11.4 0 18.6-5.8 18.6-17.4V36h-15.8v50.4c0 4.6-2.6 6.8-6.6 6.8-3.6 0-7.2-1.6-9.6-3.4L34 100.2zm48.8-1.4c6.2 3.6 13.8 5.6 21.6 5.6 14.4 0 23.6-7.2 23.6-19.4 0-11.4-8-16.6-18.4-21.2-7.2-3.2-10.8-5.6-10.8-9.8 0-3.6 3-6.4 8.2-6.4 4.8 0 9.2 1.6 12.8 3.8l5.2-11.8c-4.8-2.6-11.4-4.2-18-4.2-13.8 0-23.2 7.6-23.2 19 0 10.8 7.4 16.4 17.6 20.8 7.4 3.4 11.6 6 11.6 10.6 0 4.2-3.8 7-9.4 7-6.2 0-11.8-2.4-16.2-5.4l-4.6 11.4z"
            fill="#000000"
          />
        </svg>
      );

    case "typescript":
    case "ts":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="128" height="128" rx="16" fill="#3178C6" />
          <path
            d="M20 40h42v12h-14v56H34V52H20V40zm53.4 49.6c4.6 2.8 10.4 4.4 16.2 4.4 10.8 0 17.4-5.4 17.4-14.6 0-8.6-6-12.4-13.8-15.8-5.4-2.4-8.2-4.2-8.2-7.4 0-2.8 2.2-4.8 6.2-4.8 3.6 0 7 1.2 9.6 2.8l4-9c-3.6-2-8.6-3.2-13.6-3.2-10.4 0-17.4 5.8-17.4 14.4 0 8.2 5.6 12.4 13.2 15.6 5.6 2.6 8.8 4.6 8.8 8 0 3.2-2.8 5.4-7.2 5.4-4.6 0-9-1.8-12.2-4.2l-3 9.4z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "html":
    case "css":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M19 14l9 100 36 10 36-10 9-100H19z" fill="#E44D26" />
          <path d="M64 23v91.2l27.8-7.7 7.2-83.5H64z" fill="#F16529" />
          <path
            d="M64 45.4h19.8l-1.4 15.6H64V45.4zm0 29.8h10.4l-.7 8.2-9.7 2.6v14.4l19.5-5.4 2.8-31.2.3-3.6H64v15zm-28-29.8h28v14.8H49.8l1.3 15h12.9v14.8H50.8l-1.4-15.2-.2-2.6-.2-2.2-.7-8.2-1.3-16.6H36v.2zm13.7 41.2l2 22.8 12.3 3.4v-14.4l-6.8-1.8-.7-8.2h-6.8-.2z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "cpp":
    case "c++":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M64 8l50 28.87v57.74L64 123.48 14 94.61V36.87L64 8z"
            fill="#00599C"
          />
          <path
            d="M64 16l43 24.83v49.66L64 115.32 21 90.49V40.83L64 16z"
            fill="#004482"
          />
          <path
            d="M61 79.4c-4.4 4.8-10.4 7.6-17.6 7.6-12.8 0-21.8-9.2-21.8-23s9-23 21.8-23c7.2 0 13.2 2.8 17.6 7.6l-6.8 6.4c-2.8-3.2-6.4-4.8-10.8-4.8-7.2 0-12.2 5.4-12.2 13.8s5 13.8 12.2 13.8c4.4 0 8-1.6 10.8-4.8l6.8 6.4zM75 58h5v-9h6v9h5v6h-5v9h-6v-9h-5v-6zm22 0h5v-9h6v9h5v6h-5v9h-6v-9h-5v-6z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "c":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M64 8l50 28.87v57.74L64 123.48 14 94.61V36.87L64 8z"
            fill="#659AD2"
          />
          <path
            d="M64 17l42.2 24.37v48.74L64 114.48 21.8 90.11V41.37L64 17z"
            fill="#03599C"
          />
          <path
            d="M78 84.4c-4.8 5-11.6 8-19.4 8-14.6 0-25-10.4-25-26.4s10.4-26.4 25-26.4c7.8 0 14.6 3 19.4 8l-7.6 8.2c-3.2-3.4-7.2-5.4-11.8-5.4-8.8 0-14.8 6.6-14.8 15.6s6 15.6 14.8 15.6c4.6 0 8.6-2 11.8-5.4l7.6 8.4z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "java":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M52.8 16c-3.8 10.6-1.4 18.2 4.2 23.4-6.4-1.8-11.4-6.6-12.8-13.6-1.2-5.8.4-11.2 8.6-9.8z"
            fill="#E76F00"
          />
          <path
            d="M66.4 11c-4.6 12.8.2 22.8 7 28.8-7.8-2.6-13.8-8.6-15.6-17.2-1.4-6.8.6-13.6 8.6-11.6z"
            fill="#E76F00"
          />
          <path
            d="M33 54c-.2 1.4 4.2 2.8 9.6 3.2 7.6.6 18 .4 29.8-.8 11.8-1.2 19.4-2.8 19.4-2.8s4 2.2-3.8 4c-9.6 2.2-24.8 2.4-36.2 1.2-8.2-.8-14.4-2.8-13.6-4.6.4-1 2.2-1.4 4.8-.2z"
            fill="#5382A1"
          />
          <path
            d="M31 66c-.2 1.4 4.2 2.8 9.6 3.2 7.6.6 18 .4 29.8-.8 11.8-1.2 19.4-2.8 19.4-2.8s4 2.2-3.8 4c-9.6 2.2-24.8 2.4-36.2 1.2-8.2-.8-14.4-2.8-13.6-4.6.4-1 2.2-1.4 4.8-.2z"
            fill="#5382A1"
          />
          <path
            d="M26 84c-.4 2.4 6.8 4.6 15.6 5.4 12.4 1 29.6.6 48.8-1.4 8.6-1 12.2-3 12.2-3s-3.6 2.4-11.4 3.8c-18.4 3.2-46.6 3-57.8.2-11.6-3-9.8-6.4-7.4-5z"
            fill="#5382A1"
          />
          <path
            d="M87.2 64.6c7.4-8 18.2-7 21.6 1.8 3.8 9.8-3.4 17.6-19.4 18.2v-6.2c9.4-.6 13.8-5 11.6-10.4-2-5-9.6-4.8-13.8 1.4v-4.8z"
            fill="#E76F00"
          />
          <path
            d="M35 102c18 4.4 50 4.4 68-1.4 4.6-1.4 6.2-3 6.2-3s-2.6 2.2-8.8 3.8c-20 5.2-54 5.2-72-.4-5.2-1.6-7-3.4-7-3.4s4 2.8 13.6 4.4z"
            fill="#E76F00"
          />
          <path
            d="M25 114c24 3.8 62 3.8 86-1 6.8-1.4 9-3 9-3s-3.8 2.2-12 3.8c-26 5-68 5-90-.8-6.6-1.8-8-3.6-8-3.6s5.8 3 15 4.6z"
            fill="#5382A1"
          />
        </svg>
      );

    case "rust":
    case "rs":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M124 57.4l-7.6-3.8 2.6-8.2-8.4-1.4.6-8.6-8.6.6-1.4-8.4-8.2 2.6-3.8-7.6-7.6 3.8-5.8-6.2-6.4 5.6-7.8-3.6-4.6 7.2-8.6-.8-2.6 8.2-8.4 2-1 8.4-7.8 4 1 8.6-6.6 5.4 3 8-5 6.8 5 6.8-3 8 6.6 5.4-1 8.6 7.8 4 1 8.4 8.4 2 2.6 8.2 8.6-.8 4.6 7.2 7.8-3.6 6.4 5.6 5.8-6.2 7.6 3.8 3.8-7.6 8.2 2.6 1.4-8.4 8.6.6-.6-8.6 8.4-1.4-2.6-8.2 7.6-3.8v-7.2l-7.6-3.8 7.6-3.8v-7.2zM64 104C41.9 104 24 86.1 24 64s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"
            fill="#DEA584"
          />
          <circle cx="64" cy="64" r="34" fill="#000000" />
          <path
            d="M48 44h18.2c8.8 0 14.8 5 14.8 12.8 0 5.4-3.2 9.8-8.2 11.6l9.6 17.6h-9.8L63.8 69h-7.6v17H48V44zm8.2 17.2h9.6c4.2 0 7.2-2.2 7.2-5.8 0-3.8-3-5.8-7.2-5.8h-9.6v11.6z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "sql":
    case "sqlite":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="128" height="128" rx="16" fill="#003B57" />
          {/* Database Cylinder Stack with Feather Motif */}
          <ellipse cx="64" cy="34" rx="38" ry="14" fill="#00BCF2" />
          <path
            d="M26 34v24c0 7.7 17 14 38 14s38-6.3 38-14V34"
            stroke="#00BCF2"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M26 58v24c0 7.7 17 14 38 14s38-6.3 38-14V58"
            stroke="#00BCF2"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M26 82v24c0 7.7 17 14 38 14s38-6.3 38-14V82"
            stroke="#00BCF2"
            strokeWidth="6"
            fill="none"
          />
          <text
            x="64"
            y="94"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="26"
            fontWeight="900"
            fontFamily="monospace"
          >
            SQL
          </text>
        </svg>
      );

    case "dart":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M22 22l45 45-21 21-24-24V22z" fill="#01579B" />
          <path d="M67 67l39-39H64L46 46l21 21z" fill="#29B6F6" />
          <path d="M22 64l24 24 21-21-21-21-24 18z" fill="#0175C2" />
          <path d="M67 67l21 21 18-18L67 31v36z" fill="#0288D1" />
          <path d="M46 88l18 18 42-42-18-18-42 42z" fill="#00B4AB" />
        </svg>
      );

    case "php":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <ellipse cx="64" cy="64" rx="58" ry="34" fill="#777BB4" />
          <ellipse cx="64" cy="64" rx="54" ry="30" fill="#8892BF" />
          <text
            x="64"
            y="74"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="bold"
            fontFamily="sans-serif"
            fontStyle="italic"
          >
            php
          </text>
        </svg>
      );

    case "swift":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="128" height="128" rx="24" fill="#F05138" />
          <path
            d="M99.6 86.8c-1.4 1.2-11.4 7.6-22.8 7.6-18.4 0-33.8-12-39.6-28.6 6.8 6.4 15.6 10.6 25.4 11.6 1.2.2-4.2-4.8-8.4-9.6-10-11-13.8-23.4-13.8-23.4s4 4 11.6 7.4c10.8 5 18 4.4 21.8 3.6-1.8-1.2-5.4-3.8-9.4-7.4-7.8-6.8-14.8-17-14.8-17s14.8 11.4 28.2 16.2c16 5.8 28.6 3.6 28.6 3.6s-6.6 4-15 7.6c-9.8 4.2-17.6 9.4-17.6 9.4s11.8-1.4 21.6 2.6c11.2 4.4 16.6 12 16.6 12s-4.6-.4-12.4.6c2.8 3.2 5.8 8.8 2 12.8z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "kotlin":
    case "kt":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="ktGrad" x1="128" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C711E1" />
              <stop offset="50%" stopColor="#7F52FF" />
              <stop offset="100%" stopColor="#00AFFF" />
            </linearGradient>
          </defs>
          <rect width="128" height="128" rx="16" fill="#0B0B0D" />
          <path d="M116 116H12V12h104L64 64l52 52z" fill="url(#ktGrad)" />
          <path d="M12 116l52-52L12 12v104z" fill="#00AFFF" opacity="0.35" />
        </svg>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className={`rounded-full bg-[#FF7900] flex items-center justify-center text-[9px] font-black text-black ${className}`}
        >
          {normId.slice(0, 2).toUpperCase()}
        </div>
      );
  }
}
