import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { ImKeyboard } from "react-icons/im";
import { FaPlayCircle } from "react-icons/fa";
import {
  russianLayout,
  gagauzLayout,
  englishLayout,
  specialChars,
  WCASE_LIST,
  WTYPE_LIST,
} from "../constants/Index";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer/Footer";
import {
  translateRussianToGagauz,
  getHistoryByLink,
  addSuggestionText,
} from "../api/Index";
import SuggestModal from "./../components/Modal/SuggestModal";
import copy from "copy-to-clipboard";
import {
  handleErrorToastNotifications,
  handleSuccessToastNotifications,
} from "../utils/toastUtils";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

function LinkResolver() {
  const { code } = useParams();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardLang, setKeyboardLang] = useState("russian");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [curWord, setCurWord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [translationDirection, setTranslationDirection] = useState(
    "Русский → Гагаузский"
  );

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

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      let response;
      switch (translationDirection) {
        case "Русский → Гагаузский":
          response = await translateRussianToGagauz(inputValue);
          break;
        // Extend with other API calls as needed
        default:
          console.error("Invalid translation direction");
      }
      console.log(response);
      if (response) {
        setCurWord(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavedTranslate = async (text, direction) => {
    const translationMap = {
      "Русский → Гагаузский": translateRussianToGagauz,
      // Add more direction mappings here as needed
    };

    const translateFn = translationMap[direction];

    if (!translateFn) {
      console.error(`Unsupported translation direction: ${direction}`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await translateFn(text);
      if (response) {
        setCurWord(response);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!suggestionText.trim()) {
      handleErrorToastNotifications("Введите перевод");
      return;
    }

    try {
      const response = await addSuggestionText({
        key: API_KEY,
        source: curWord.original,
        suggest_translation: suggestionText,
      });

      if (response?.success) {
        handleSuccessToastNotifications("Успешно отправлено");
      } else {
        handleErrorToastNotifications("подача не удалась");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        handleErrorToastNotifications(err?.response?.data?.message);
      }
    } finally {
      setShowModal(false);
      setSuggestionText("");
    }
  };

  useEffect(() => {
    const fetchTranslationByCode = async () => {
      try {
        setIsLoading(true);
        const { text, direction } = await getHistoryByLink(code);

        const directionMap = {
          ru: "Русский → Гагаузский",
          ga: "Гагаузский → Русский",
          en: "English → Gagauz",
          "ga-en": "Gagauz → English",
        };

        const mappedDirection =
          directionMap[direction] || "Русский → Гагаузский";

        setInputValue(text);
        setTranslationDirection(mappedDirection);

        await handleSavedTranslate(text, mappedDirection);
      } catch (err) {
        console.warn("Link not found or expired:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchTranslationByCode();
    }
  }, [code]);

  return (
    <div className="home-container h-screen flex flex-col text-white">
      <SuggestModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          handleSubmitSuggestion();
        }}
        value={suggestionText}
        setValue={setSuggestionText}
      />
      <div className="flex-grow flex flex-col items-center overflow-y-auto px-4 py-6">
        {/* Logo and Title */}
        <img src={logo} alt="Logo" className="w-20 mb-2" />
        <h1 className="text-3xl md:text-4xl font-bold text-orange-500 tracking-wider">
          SOZLÜK
        </h1>
        <p className="text-sm text-gray-300 italic -mt-1 mb-6">
          translator <span className="text-orange-400">beta</span>
        </p>

        {/* Input and Translate Form */}
        <div className="w-full max-w-[600px] space-y-4">
          <div className="hidden md:flex items-center space-x-2">
            <select
              className="bg-[#2c2c2c] text-white px-3 py-2 text-sm rounded w-[190px]"
              value={translationDirection}
              onChange={(e) => setTranslationDirection(e.target.value)}
            >
              <option>Русский → Гагаузский</option>
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
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm rounded font-medium"
              onClick={handleTranslate}
            >
              Translate
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="Toggle virtual keyboard"
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              <ImKeyboard className="text-white text-xl opacity-70 hover:opacity-100" />
            </button>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            <select
              className="bg-[#2c2c2c] text-white px-4 py-2 text-sm rounded"
              value={translationDirection}
              onChange={(e) => setTranslationDirection(e.target.value)}
            >
              <option>Русский → Гагаузский</option>
              <option>Gagauz → Russian</option>
              <option>English → Gagauz</option>
              <option>Gagauz → English</option>
            </select>
            <input
              type="text"
              placeholder="Enter the text..."
              className="bg-[#2c2c2c] text-white px-4 py-2 text-sm rounded"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm rounded font-medium"
                onClick={handleTranslate}
              >
                Translate
              </button>
              <button
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Toggle virtual keyboard"
                onClick={() => setShowKeyboard(!showKeyboard)}
              >
                <ImKeyboard className="text-white text-xl opacity-70 hover:opacity-100" />
              </button>
            </div>
          </div>

          {/* Special Characters */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 justify-items-center">
            {specialChars.map((char) => (
              <button
                key={char}
                onClick={() => setInputValue((prev) => prev + char)}
                className="bg-[#1f1f1f] text-white w-10 h-10 text-sm rounded hover:bg-gray-700 flex items-center justify-center"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Virtual Keyboard */}
          {showKeyboard && (
            <div className="animate-fadeIn bg-[#2c2c2c] p-4 rounded-lg shadow-lg w-full text-sm space-y-3">
              <div className="flex justify-between text-xs text-gray-300 px-1">
                <button
                  onClick={toggleKeyboardLang}
                  className="bg-[#1f1f1f] hover:bg-gray-700 text-white text-xs px-3 py-1 rounded"
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
          <AnimatePresence>
            {/* Translation Result */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 py-6 animate-fadeIn">
                <span className="text-white font-bold text-lg drop-shadow-md">
                  Переводим
                </span>
                <div className="h-6 w-6 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
              </div>
            )}

            {!isLoading &&
              curWord &&
              curWord.results &&
              curWord.results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#1f1f1f] text-white p-4 rounded-lg shadow-md border border-orange-500 space-y-2"
                >
                  <div>
                    <h2 className="text-xl font-bold text-orange-400">
                      {curWord.original}
                    </h2>
                    <p className="text-sm text-orange-300">
                      Направление перевода:{" "}
                      {translationDirection.replace("→", "->")}
                    </p>
                  </div>
                  {curWord &&
                    curWord.results.length > 0 &&
                    curWord.results.map((item, idx) => (
                      <div
                        className="bg-[#2c2c2c] p-3 rounded-md space-y-2 shadow-sm"
                        key={idx}
                      >
                        <div
                          className="text-lg flex items-center gap-2"
                          key={idx}
                        >
                          <span className="font-semibold">
                            {item.translation}
                          </span>
                          <button className="text-blue-400 cursor-pointer">
                            <FaPlayCircle className="text-base" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-400">
                          [{item.pronunciation}]
                        </div>
                        <div className="flex gap-2">
                          <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {WCASE_LIST[item.wcase + 1]}
                          </span>
                          <span className="inline-block bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {WTYPE_LIST[item.plural]}
                          </span>
                        </div>

                        <hr className="border-orange-400 my-3" />
                        {item.synonyms?.length > 0 ? (
                          <p className="text-sm text-gray-400">
                            Синонимы:{" "}
                            <span className="text-white">
                              {item.synonyms.join(", ")}
                            </span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400">
                            Синонимы: <span className="text-white"></span>
                          </p>
                        )}
                        <hr className="border-orange-400 my-3" />
                        {item.info && (
                          <div className="italic text-sm text-orange-200">
                            {item.info}
                          </div>
                        )}
                      </div>
                    ))}

                  <div className="w-full flex flex-wrap justify-center sm:justify-between items-center gap-2 py-4 mt-4">
                    <p className="text-sm text-gray-400">
                      Ссылка на перевод:{" "}
                      <a
                        href={`${API_URL}/?link=${curWord?.code}`}
                        className="text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${API_URL}/?link=${curWord?.code}`}
                      </a>
                    </p>
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-sm px-3 py-1 rounded cursor-pointer"
                      onClick={() => {
                        const link = `${API_URL}/link/${curWord?.code}`;
                        const success = copy(link);
                        if (success) {
                          handleSuccessToastNotifications(
                            "Link copied to clipboard"
                          );
                        } else {
                          handleErrorToastNotifications("Failed to copy link.");
                        }
                      }}
                    >
                      Копировать ссылку
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-sm px-3 py-1 rounded cursor-pointer"
                      onClick={() => setShowModal(true)}
                    >
                      Предложить перевод
                    </button>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LinkResolver;
