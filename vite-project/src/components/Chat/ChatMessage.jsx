import React from 'react';
import { IconUser, IconBrain, IconSparkles } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

const getBarChartKeys = (data) => {
  if (!data || data.length === 0) return [];
  return Object.keys(data[0]).filter(k => k !== 'name');
};

export const ChatMessage = ({ msg }) => {
  if (msg.role === 'user') {
    return (
      <div className="flex gap-4 p-4 md:p-6 flex-row-reverse">
        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-700 dark:text-indigo-400">
          <IconUser size={20} stroke={1.5} />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 md:p-5 text-gray-800 dark:text-gray-100 max-w-[85%] border border-transparent dark:border-gray-700 transition-colors">
          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  const aiData = msg.data;
  return (
    <div className="flex gap-4 p-4 md:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 text-gray-800 border border-indigo-100/50 dark:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1">
        <IconBrain size={24} stroke={1.5} />
      </div>
      <div className="flex-1 pt-1.5 space-y-6">
        <p className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {aiData.introText}
        </p>

        {/* Chart Container based on dynamic flag */}
        {aiData.isChartResponse && aiData.performanceData && aiData.priceData && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
            
            {/* Dynamic Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-80 transition-colors">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 text-center">Score Comparison</h3>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aiData.performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8ca3af' }} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', background: '#374151', color: '#fff'}} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#8ca3af' }} />
                    {getBarChartKeys(aiData.performanceData).map((metricKey, idx) => (
                      <Bar key={metricKey} dataKey={metricKey} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dynamic Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-80 transition-colors">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 text-center">Value Representation</h3>
              <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiData.priceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {aiData.priceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', background: '#374151', color: '#fff'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Final Recommendation block */}
        {aiData.isChartResponse && aiData.finalRecommendation && (
          <div className="bg-indigo-600 text-white p-5 rounded-xl shadow-md flex gap-4 items-start">
            <div className="mt-0.5"><IconSparkles size={20} className="text-indigo-200" /></div>
            <div>
              <h4 className="font-semibold mb-1">Final Recommendation</h4>
              <p className="text-indigo-100 text-sm leading-relaxed whitespace-pre-wrap">{aiData.finalRecommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
