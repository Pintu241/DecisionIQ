import React, { useState, useRef, useEffect } from 'react';
import { IconBrain, IconLoader2 } from '@tabler/icons-react';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ParticlesBackground } from '../ParticlesBackground';

export const ChatInterface = ({ isAuthenticated, onRequireAuth }) => {
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
      // Ensure API key is present
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error("Missing or invalid Gemini API Key in .env file.");
      }

      // Initialize Gemini API
      const ai = new GoogleGenAI({ apiKey: apiKey });

      let domainConstraint = "";
      if (selectedFilter !== "All") {
        domainConstraint = `CRITICAL RULE: The user has selected the "${selectedFilter}" category filter. If the user's query is NOT related to ${selectedFilter}, you MUST refuse to answer and return standard JSON stating that the query falls outside the selected domain filter. DO NOT answer questions outside the ${selectedFilter} category.`;
      }

      // Structured prompt to guarantee JSON shape
      const systemPrompt = `You are Decision IQ, an intelligent assistant. 
The user will ask you questions (like laptop comparisons, software comparisons, etc).
${domainConstraint}

If the user asks for a comparison or graphs, you MUST return your entire response as a valid JSON object matching this exact structure:
{
  "isChartResponse": true,
  "introText": "Brief introduction paragraph summarizing what you found.",
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "performanceData": [ { "name": "Item 1", "PerformanceMetric1": 90, "PerformanceMetric2": 80 } ],
  "priceData": [ { "name": "Item 1", "value": 1500 } ],
  "comparisonTable": {
    "headers": ["Feature", "Item 1", "Item 2"],
    "rows": [
      ["Processor", "Intel i7", "AMD Ryzen 7"],
      ["RAM", "16GB", "32GB"]
    ]
  },
  "prosCons": [
    { "name": "Item 1", "pros": ["Pro 1"], "cons": ["Con 1"] },
    { "name": "Item 2", "pros": ["Pro 1"], "cons": ["Con 1"] }
  ],
  "finalRecommendation": "Your final verdict paragraph explaining why you chose a specific option."
}
Make sure performance metrics apply to the question (e.g. CPU/GPU for laptops, Speed/Reliability for internet, etc).
If the user's question does NOT require charts (or if you are refusing due to the category filter), just return standard text but in JSON format:
{
  "isChartResponse": false,
  "introText": "Your full response here."
}
Return ONLY valid raw JSON, do not wrap it in markdown \`\`\`json block. Keep it strictly parseable.`;

      // Call Gemini API
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Query: " + userText }] }
        ]
      });

      const responseText = typeof response.text === 'function' ? response.text() : (response.text || '');
      const trimmedText = responseText.trim();
      let parsedData;

      try {
        // Handle cases where the model might still wrap it in markdown
        const cleanedText = trimmedText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Failed to parse JSON", responseText, e);
        parsedData = {
          isChartResponse: false,
          introText: "I'm having trouble formatting the data. Here is my raw response:\n\n" + responseText
        };
      }

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
      setMessages(prev => [...prev, {
        role: 'assistant',
        data: {
          isChartResponse: false,
          introText: "Error: " + (error.message || "Failed to reach the AI API. Make sure VITE_GEMINI_API_KEY is properly set in the .env file and restart the development server.")
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
                <p className="text-indigo-500 dark:text-indigo-400 font-medium animate-pulse">Decision IQ is thinking...</p>
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
      />
    </div>
  );
};
