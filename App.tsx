import React from 'react';
import VirtualAssistantPlugin from './components/VirtualAssistantPlugin';

const App: React.FC = () => {
    return (
        <div className="relative h-screen bg-slate-900 font-sans overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-1/3 h-1/3 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                {/* Glassmorphic shapes from user feedback */}
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[30%] rounded-2xl border border-white/5 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.02)]"></div>
                <div className="absolute bottom-[15%] right-[8%] w-[35%] h-[40%] rounded-2xl border border-white/5 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.02)]"></div>
                 <div className="absolute top-[12%] right-[15%] w-[20%] h-[20%] rounded-full border border-white/5 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.02)] opacity-50"></div>
            </div>

            {/* The floating plugin, with a higher z-index to be on top */}
            <div className="relative z-10">
                 <VirtualAssistantPlugin />
            </div>
        </div>
    );
};

export default App;
