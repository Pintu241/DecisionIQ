import React, { useState, useRef, useEffect } from 'react';
import { IconBrain, IconLoader2 } from '@tabler/icons-react';
import axios from '../../api/axios';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ParticlesBackground } from '../ParticlesBackground';

export const ChatInterface = ({ isAuthenticated, onRequireAuth, resumedHistoryItem, setResumedHistoryItem }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const scrollRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isLoading]);

  // Handle resumed history item
  useEffect(() => {
    if (resumedHistoryItem) {
      setMessages([
        { role: 'user', content: resumedHistoryItem.query },
        { role: 'assistant', data: resumedHistoryItem.response }
      ]);
      setSelectedFilter(resumedHistoryItem.category || 'All');

      // Clear the resume state in parent so it doesn't re-trigger on tab switch
      setResumedHistoryItem(null);
    }
  }, [resumedHistoryItem, setResumedHistoryItem]);

  const handleSend = async () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Add user message to history
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        prompt: userText,
        filter: selectedFilter
      });

      const parsedData = response.data;
      setMessages(prev => [...prev, { role: 'assistant', data: parsedData }]);

      // Save to History (Async)
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        axios.post('/api/history', {
          query: userText,
          response: parsedData,
          category: selectedFilter
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error("History Save Error", err));
      }

    } catch (error) {
      console.error("API Error", error);
      const rawError = (error && (error.message || error.toString())) || "Unknown error";
      const lowErr = rawError.toLowerCase();
      let userError = "Error: " + rawError;

      if (error.response?.status === 503 || lowErr.includes('service temporarily unavailable') || lowErr.includes('high demand') || lowErr.includes('unavailable')) {
        userError = "AI service is currently busy. Please wait a few seconds and try again.";
      } else if (lowErr.includes('quota') || lowErr.includes('quota exceeded') || lowErr.includes('daily limit') || lowErr.includes('rate limit')) {
        userError = "API quota reached or rate limit exceeded. Please wait a moment and try again, or check your Gemini usage quota.";
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        data: {
          isChartResponse: false,
          introText: userError
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: `Uploaded dataset: ${file.name}` }]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/upload/dataset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      const parsedData = response.data;
      setMessages(prev => [...prev, { role: 'assistant', data: parsedData }]);

      // Save to History (Backend handles the initial save if we want, but since ChatInterface usually saves...)
      // The upload endpoint already analyzed it, but let's log it in History too
      if (isAuthenticated) {
        axios.post('/api/history', {
          query: `Analyzed dataset: ${file.name}`,
          response: parsedData,
          category: selectedFilter
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error("History Save Error", err));
      }

    } catch (error) {
      console.error("Upload Error", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        data: {
          isChartResponse: false,
          introText: "Error analyzing dataset: " + (error.response?.data?.message || error.message || "Something went wrong.")
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative min-h-0 bg-transparent transition-colors">

      <ParticlesBackground />

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-48 scroll-smooth relative z-10 pointer-events-none" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6 pointer-events-auto">

          {/* AI Welcome Message (Fixed) */}
          <div className="flex gap-4 p-4 md:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 text-gray-800 border border-indigo-100/50 dark:border-indigo-500/20 transition-colors">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1">
              <IconBrain size={24} stroke={1.5} />
            </div>
            <div className="flex-1 pt-1.5">
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                Hello! I am <span className="font-semibold text-gray-900 dark:text-white">Decision IQ</span>, your intelligent assistant. I can help you analyze organizational data, automate workflows, and answer any questions you have. How can I assist you today?
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 px-3 py-1.5 rounded-full text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setInputMessage("Which laptop should I buy? Please show comparison in Bar and Pie charts")}>"Compare the best laptops"</span>
                <span className="text-xs bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 px-3 py-1.5 rounded-full text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setInputMessage("Compare top CRM softwares for a small business")}>"Compare top CRM softwares"</span>
                <span className="text-xs bg-indigo-600 border border-indigo-500 px-3 py-1.5 rounded-full text-white font-medium cursor-default shadow-sm">Dataset Analysis (Excel) Available ↓</span>
              </div>
            </div>
          </div>

          {/* Dynamic Message Map */}
          {messages.map((msg, index) => (
            <ChatMessage key={index} msg={msg} />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 p-4 md:p-6 bg-transparent text-gray-800 dark:text-gray-200">
              <div className="h-10 w-10 flex items-center justify-center flex-shrink-0 text-indigo-500 dark:text-indigo-400">
                <IconLoader2 size={24} stroke={2} className="animate-spin" />
              </div>
              <div className="flex-1 pt-2">
                <p className="text-indigo-500 dark:text-indigo-400 font-medium animate-pulse">Decision IQ is analyzing your data...</p>
              </div>
            </div>
          )}

          {/* End of Chat Spacer to prevent input occlusion */}
          <div className="h-40 md:h-48 w-full flex-shrink-0"></div>

        </div>
      </div>

      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        handleSend={handleSend}
        isAuthenticated={isAuthenticated}
        onRequireAuth={onRequireAuth}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};
