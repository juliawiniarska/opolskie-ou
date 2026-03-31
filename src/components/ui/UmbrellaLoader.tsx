import { motion } from "framer-motion";

export const UmbrellaLoader = () => {
  const color = "#2D7A5F";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 flex items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        {/* Czysty wektor bez poświaty i cieni */}
        <svg
          width="112"
          height="112"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* STATYCZNA TARCZA HERBU */}
          <path
            d="M12 22.5C16.5 21 20 16.5 20 11V5.5L12 2L4 5.5V11C4 16.5 7.5 21 12 22.5Z"
            fill={color}
          />

          {/* ANIMOWANA LINIA PARASOLKI - Cieńsza (0.8) i lekko zwolniona (2.2s) */}
          <motion.path
            d="M12 6.5V8 M7 13A5 5 0 0 1 17 13Q15.75 11.5 14.5 13Q13.25 11.5 12 13Q10.75 11.5 9.5 13Q8.25 11.5 7 13Z M12 13V17.5A1.5 1.5 0 0 1 9 17.5V16.5"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: 2.2, // Minimalnie wolniej
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              },
              opacity: { duration: 0.2 },
            }}
          />

          {/* WYPEŁNIENIE PARASOLKI - Dopasowane do nowego, dłuższego czasu */}
          <motion.path
            d="M7 13A5 5 0 0 1 17 13Q15.75 11.5 14.5 13Q13.25 11.5 12 13Q10.75 11.5 9.5 13Q8.25 11.5 7 13Z"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 0, 0] }}
            transition={{
              duration: 4.4, // Podwójny czas rysowania (2 x 2.2s)
              ease: "easeInOut",
              repeat: Infinity,
              times: [0, 0.4, 0.5, 0.6, 1],
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
};