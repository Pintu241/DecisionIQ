import React, { useState, useEffect } from "react";
import {
  IconSend,
  IconMicrophone,
  IconPaperclip,
  IconLoader2,
  IconPlayerRecordFilled,
} from "@tabler/icons-react";

export const ChatInput = ({
  inputMessage,
  setInputMessage,
  isLoading,
  handleSend,
  isAuthenticated,
  onRequireAuth,
  selectedFilter,
  setSelectedFilter,
  onFileUpload,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    // Check for browser support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US";

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Append or set the transcript
        setInputMessage((prev) =>
          prev ? `${prev} ${transcript}` : transcript,
        );
      };

      recog.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [setInputMessage]);

  const toggleListen = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Speech Recognition.");
      }
    }
  };

  // Add filter state
  const filters = [
    "All",
    "Electronics",
    "Travel",
    "Software",
    "Finance",
    "Healthcare",
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent pt-32 pb-6 px-4 md:px-8 z-20 pointer-events-none transition-colors">
      <div className="max-w-4xl mx-auto relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.08)] dark:shadow-none rounded-2xl pl-2 pr-2 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-400 transition-all pointer-events-auto">

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx, .xls"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload(file);
            e.target.value = null; // Reset for same file selection
          }}
        />

        {/* Domain Filter Dropdown */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 border-none outline-none text-xs text-gray-600 dark:text-gray-300 appearance-none py-2 pl-3 pr-8 rounded-xl font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mr-2 hidden sm:block disabled:opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.7rem top 50%",
            backgroundSize: "0.65rem auto",
          }}
          disabled={isLoading}
        >
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => {
            if (!isAuthenticated) {
              onRequireAuth();
              return;
            }
            setInputMessage(e.target.value);
          }}
          onClick={() => {
            if (!isAuthenticated) {
              onRequireAuth();
            }
          }}
          placeholder={
            isAuthenticated
              ? "Ask Decision IQ anything..."
              : "Sign in to ask a question..."
          }
          className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-gray-700 dark:text-gray-100 placeholder-gray-400 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleSend();
            }
          }}
          disabled={isLoading}
        />
        <button
          onClick={() => {
            if (!isAuthenticated) return onRequireAuth();
            fileInputRef.current?.click();
          }}
          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mr-1 rounded-full"
          title="Attach Excel dataset"
        >
          <IconPaperclip size={20} stroke={1.5} />
        </button>
        <button
          onClick={toggleListen}
          className={`p-2 transition-colors mr-1 rounded-full ${isListening ? "bg-red-50 dark:bg-red-900/30 text-red-500 animate-pulse" : "text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
          title={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? (
            <IconPlayerRecordFilled size={20} />
          ) : (
            <IconMicrophone size={20} stroke={1.5} />
          )}
        </button>
        <button
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${inputMessage.trim().length > 0 && !isLoading ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"}`}
          onClick={handleSend}
          disabled={isLoading || inputMessage.trim().length === 0}
        >
          {isLoading ? (
            <IconLoader2 size={18} stroke={2} className="animate-spin" />
          ) : (
            <IconSend size={18} stroke={2} />
          )}
        </button>
      </div>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3 md:mt-4 pointer-events-auto pb-2">
        Decision IQ can make mistakes. Consider verifying important
        organizational information.
      </p>
    </div>
  );
};
