import React, { useState } from 'react';

// A simple SVG spinner component for loading state
const Spinner: React.FC = () => (
  <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AgentSearchPanel: React.FC = () => {
  // State for the input field
  const [task, setTask] = useState('scsfjt.com 集团新闻');
  // State for the application's status: 'idle', 'loading', 'success', 'error'
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  // State to hold the result from the "backend"
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || status === 'loading') return;

    setStatus('loading');
    setResult('');

    // Simulate a 2-second API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // On success
    setStatus('success');
    setResult(`已成功完成任务: "${task}"`);
  };

  const isConnected = status === 'success';

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-200">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-2xl font-bold text-center text-white">AI 代理搜索</h2>
        <p className="text-sm text-gray-400 text-center mt-1 mb-6">
          输入一个任务，AI 代理将在模拟浏览器中为您完成。
        </p>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={status === 'loading'}
            className="flex-grow bg-slate-900 border border-slate-700 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? '处理中...' : '发送'}
          </button>
        </div>
        <div className="flex items-center justify-end mt-2">
          <span className={`flex items-center text-xs ${isConnected ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="relative flex h-2 w-2 mr-1.5">
              {!isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            {isConnected ? '后端已连接' : '后端未连接'}
          </span>
        </div>
      </form>

      {/* Main Content Area with Transitions */}
      <div className="flex-1 flex flex-col items-center justify-center border-t border-slate-700 mx-6 mb-6 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
            {/* IDLE STATE */}
            <div className={`transition-all duration-300 ease-in-out absolute ${status === 'idle' ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}>
                <p className="text-gray-500">等待任务...</p>
            </div>
            
            {/* LOADING STATE */}
             <div className={`transition-all duration-300 ease-in-out absolute flex flex-col items-center space-y-2 ${status === 'loading' ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}>
                <Spinner />
                <p className="text-cyan-400 text-sm">正在为您执行任务...</p>
            </div>

            {/* SUCCESS STATE */}
            <div className={`transition-all duration-300 ease-in-out absolute ${status === 'success' ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}>
                 <p className="text-green-400 text-center">{result}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSearchPanel;