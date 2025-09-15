import React from 'react';

export const CharacterModelPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-900/50 rounded-2xl border-2 border-dashed border-cyan-500/50 flex items-center justify-center transition-all duration-300 hover:border-cyan-500 hover:bg-slate-900/80 select-none">
      <div className="text-center text-cyan-400/80 p-2">
        <p className="font-semibold text-lg">Live2D Canvas</p>
        <p className="text-xs mt-1">模型渲染区域</p>
        <p className="text-xs mt-4 opacity-60">
            单击展开/收起AI代理
            <br/>
            按住拖动位置
        </p>
      </div>
    </div>
  );
};
