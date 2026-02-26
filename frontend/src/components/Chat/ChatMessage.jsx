import React, { useState } from 'react';
import { IconUser, IconBrain, IconSparkles, IconChartBar, IconChartPie, IconChartArea, IconChartLine } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

const getBarChartKeys = (data) => {
  if (!data || data.length === 0) return [];
  return Object.keys(data[0]).filter(k => k !== 'name');
};

export const ChatMessage = ({ msg }) => {
  const [perfChartType, setPerfChartType] = useState('bar'); // bar, area, line
  const [priceChartType, setPriceChartType] = useState('pie'); // pie, bar

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
      <div className="flex-1 pt-1.5 space-y-8">
        <p className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {aiData.introText}
        </p>

        {/* Key Insights Section */}
        {aiData.isChartResponse && aiData.keyInsights && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <IconInfoCircle size={18} />
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiData.keyInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-indigo-100/30 dark:border-gray-700/50 items-start">
                  <div className="mt-1 text-indigo-500"><IconCheck size={16} stroke={3} /></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Container */}
        {aiData.isChartResponse && aiData.performanceData && aiData.priceData && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">

            {/* Performance Comparison Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-80 transition-colors relative group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Score Comparison</h3>
                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                  <button
                    onClick={() => setPerfChartType('bar')}
                    className={`p-1 rounded-md transition-colors ${perfChartType === 'bar' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Bar Chart"
                  >
                    <IconChartBar size={16} />
                  </button>
                  <button
                    onClick={() => setPerfChartType('area')}
                    className={`p-1 rounded-md transition-colors ${perfChartType === 'area' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Area Chart"
                  >
                    <IconChartArea size={16} />
                  </button>
                  <button
                    onClick={() => setPerfChartType('line')}
                    className={`p-1 rounded-md transition-colors ${perfChartType === 'line' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Line Chart"
                  >
                    <IconChartLine size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {perfChartType === 'bar' ? (
                    <BarChart data={aiData.performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', background: '#374151', color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px', color: '#8ca3af' }} />
                      {getBarChartKeys(aiData.performanceData).map((metricKey, idx) => (
                        <Bar key={metricKey} dataKey={metricKey} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
                      ))}
                    </BarChart>
                  ) : perfChartType === 'area' ? (
                    <AreaChart data={aiData.performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        {getBarChartKeys(aiData.performanceData).map((metricKey, idx) => (
                          <linearGradient key={`grad-${metricKey}`} id={`color-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#374151', color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px', color: '#8ca3af' }} />
                      {getBarChartKeys(aiData.performanceData).map((metricKey, idx) => (
                        <Area key={metricKey} type="monotone" dataKey={metricKey} stroke={COLORS[idx % COLORS.length]} fillOpacity={1} fill={`url(#color-${metricKey})`} />
                      ))}
                    </AreaChart>
                  ) : (
                    <LineChart data={aiData.performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#374151', color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px', color: '#8ca3af' }} />
                      {getBarChartKeys(aiData.performanceData).map((metricKey, idx) => (
                        <Line key={metricKey} type="monotone" dataKey={metricKey} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      ))}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Value Representation Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-80 transition-colors relative group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Value Representation</h3>
                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                  <button
                    onClick={() => setPriceChartType('pie')}
                    className={`p-1 rounded-md transition-colors ${priceChartType === 'pie' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Pie Chart"
                  >
                    <IconChartPie size={16} />
                  </button>
                  <button
                    onClick={() => setPriceChartType('bar')}
                    className={`p-1 rounded-md transition-colors ${priceChartType === 'bar' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Bar Chart"
                  >
                    <IconChartBar size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  {priceChartType === 'pie' ? (
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
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#374151', color: '#fff' }} />
                    </PieChart>
                  ) : (
                    <BarChart data={aiData.priceData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8ca3af' }} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', background: '#374151', color: '#fff' }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {aiData.priceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Comparison Table Section */}
        {aiData.isChartResponse && aiData.comparisonTable && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <IconTable size={18} />
              Detailed Comparison
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    {aiData.comparisonTable.headers.map((header, idx) => (
                      <th key={idx} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {aiData.comparisonTable.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`p-4 text-sm ${cellIdx === 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pros & Cons Section */}
        {aiData.isChartResponse && aiData.prosCons && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiData.prosCons.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">{item.name}</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <IconThumbUp size={14} /> Pros
                    </p>
                    <ul className="space-y-1.5">
                      {item.pros.map((pro, pIdx) => (
                        <li key={pIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0 text-emerald-500"><IconCheck size={14} stroke={3} /></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <IconThumbDown size={14} /> Cons
                    </p>
                    <ul className="space-y-1.5">
                      {item.cons.map((con, cIdx) => (
                        <li key={cIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0 text-rose-500"><IconX size={14} stroke={3} /></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Final Recommendation block */}
        {aiData.isChartResponse && aiData.finalRecommendation && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex gap-4 items-start">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <IconSparkles size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1 tracking-tight">Final Recommendation</h4>
              <p className="text-indigo-50 text-sm leading-relaxed whitespace-pre-wrap">{aiData.finalRecommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
