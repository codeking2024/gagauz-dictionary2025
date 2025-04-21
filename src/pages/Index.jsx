import React, { useState } from "react";
import logo from "../assets/logo.png";
import { ImKeyboard } from "react-icons/im";
import {
  russianLayout,
  gagauzLayout,
  englishLayout,
  specialChars,
} from "../constants/Index";
import Footer from "../components/Footer/Footer";

function Index() {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardLang, setKeyboardLang] = useState("russian");
  const [inputValue, setInputValue] = useState("");

  const toggleKeyboardLang = () => {
    setKeyboardLang((prev) =>
      prev === "russian" ? "gagauz" : prev === "gagauz" ? "english" : "russian"
    );
  };

  const layout =
    keyboardLang === "russian"
      ? russianLayout
      : keyboardLang === "gagauz"
      ? gagauzLayout
      : englishLayout;

  const KeyButton = ({ label }) => {
    const handleClick = () => {
      if (label === "Space") {
        setInputValue((prev) => prev + " ");
      } else {
        setInputValue((prev) => prev + label);
      }
    };

    return (
      <button
        onClick={handleClick}
        className="bg-[#1f1f1f] hover:bg-gray-700 text-white rounded px-3 py-1 min-w-[40px] text-xs"
      >
        {label}
      </button>
    );
  };

  return (
    <div className="home-container sm:h-screen overflow-hidden flex flex-col text-white">
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-6">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-20 mb-2" />

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-500 tracking-wider">
          SOZLÜK
        </h1>
        <p className="text-sm text-gray-300 italic -mt-1 mb-6">
          translator <span className="text-orange-400">beta</span>
        </p>

        {/* === Responsive Form === */}
        <div className="w-full max-w-[600px]">
          {/* Desktop (≥768px): horizontal layout */}
          <div className="hidden md:flex items-center space-x-2 mb-2">
            <select className="bg-[#2c2c2c] text-white px-3 py-2 text-sm rounded w-[180px]">
              <option>Russian → Gagauz</option>
              <option>Gagauz → Russian</option>
              <option>English → Gagauz</option>
              <option>Gagauz → English</option>
            </select>

            <input
              type="text"
              placeholder="Enter the text..."
              className="flex-grow bg-[#2c2c2c] text-white px-4 py-2 text-sm rounded"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm rounded font-medium">
              Translate
            </button>

            {/* Keyboard button icon */}
            <div className="flex justify-center mt-2 mb-3">
              <button
                className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                aria-label="Toggle virtual keyboard"
                onClick={() => setShowKeyboard(!showKeyboard)}
              >
                <ImKeyboard className="text-white text-xl opacity-70 hover:opacity-100 transition" />
              </button>
            </div>
          </div>

          {/* Mobile (<768px): vertical stacked layout */}
          <div className="flex flex-col gap-3 md:hidden mb-2">
            <select className="bg-[#2c2c2c] text-white px-4 py-2 text-sm rounded">
              <option>Russian → Gagauz</option>
            </select>

            <input
              type="text"
              placeholder="Enter the text..."
              className="bg-[#2c2c2c] text-white px-4 py-2 text-sm rounded"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm rounded font-medium cursor-pointer">
              Translate
            </button>
          </div>

          {/* Special Characters Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 justify-items-center">
            {specialChars.map((char) => (
              <button
                key={char}
                onClick={() => setInputValue((prev) => prev + char)}
                className="bg-[#1f1f1f] text-white w-10 h-10 text-sm rounded hover:bg-gray-700 flex items-center justify-center cursor-pointer"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Keyboard button icon */}
          <div className="flex md:hidden justify-center mt-2 mb-3">
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle virtual keyboard"
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              <ImKeyboard className="text-white text-xl opacity-70 hover:opacity-100 transition" />
            </button>
          </div>

          {/* Virtual Keyboard */}
          {showKeyboard && (
            <div className="animate-fadeIn mt-4 bg-[#2c2c2c] text-white p-4 rounded-lg shadow-lg w-full max-w-[640px] mx-auto text-sm space-y-3">
              {/* Header Row with Toggle */}
              <div className="flex justify-between text-xs text-gray-300 px-1">
                <button
                  onClick={toggleKeyboardLang}
                  className="bg-[#1f1f1f] hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                >
                  Change the language
                </button>

                <span>
                  Keyboard Language:{" "}
                  {keyboardLang === "russian"
                    ? "Russian"
                    : keyboardLang === "gagauz"
                    ? "Gagauzsky"
                    : "English"}
                </span>
              </div>

              {/* Keyboard Rows */}
              <div className="space-y-2 text-center">
                {layout.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex flex-wrap justify-center gap-1"
                  >
                    {row.map((key, i) => (
                      <KeyButton key={`${key}-${i}`} label={key} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Index;
