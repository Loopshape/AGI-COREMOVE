
import React, { useState, useCallback } from 'react';
import { AgentStatus, AgentName, LogEntry, ConsensusResult, LogType, SortedChunk } from '../types';
import { AGENT_COLOR_MAP, LOG_TYPE_CLASS_MAP } from '../constants';

interface AiResponsePanelProps {
  isOpen: boolean;
  onClose: () => void;
  agentStatuses: AgentStatus[];
  consensusResult: ConsensusResult | null;
  onCopyConsensus: () => void;
  onApplyConsensus: (type: 'assembled') => void;
  onRerunOrchestrator: () => void;
}

const AiResponsePanel: React.FC<AiResponsePanelProps> = ({
  isOpen,
  onClose,
  agentStatuses,
  consensusResult,
  onCopyConsensus,
  onApplyConsensus,
  onRerunOrchestrator,
}) => {
  const [showFullLogs, setShowFullLogs] = useState<{ [key in AgentName]?: boolean }>({});

  const toggleLogs = useCallback((agentName: AgentName) => {
    setShowFullLogs((prev) => ({ ...prev, [agentName]: !prev[agentName] }));
  }, []);

  const getLogClasses = useCallback((type: LogType) => {
    const base = 'log-entry mb-1 pl-2 border-l-2';
    return `${base} ${LOG_TYPE_CLASS_MAP[type]}`;
  }, []);

  const renderAgentCard = useCallback((agent: AgentStatus) => {
    const agentConfig = AGENT_COLOR_MAP[agent.name] || 'border-gray-500 text-gray-500';
    const activeClass = agent.active ? 'shadow-lg shadow-purple-400/60 transform -translate-y-0.5' : '';
    const logLimit = showFullLogs[agent.name] ? agent.logs.length : 3;

    return (
      <div key={agent.name} className={`agent-card bg-zinc-700/50 rounded-lg p-3 mb-2 border-l-4 ${agentConfig.split(' ')[0]} transition-all duration-300 relative overflow-hidden ${activeClass}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-pulse-once-on-active"></div>
        <div className={`text-sm font-bold ${agentConfig.split(' ')[1]} mb-1`}>{agent.name}</div>
        <div className="text-xs text-zinc-500 mb-1">{agent.status}</div>
        <div className="text-xs text-slate-200 line-clamp-2 min-h-[1.5rem]">{agent.currentResponse || 'Awaiting quantum report...'}</div>
        <div className="mt-2 text-xs text-zinc-500">
          <p className="font-semibold mb-1">Activity Log:</p>
          <div className="bg-black/30 rounded p-2 max-h-24 overflow-y-auto">
            {agent.logs.slice(-logLimit).map((log, logIndex) => (
              <div key={logIndex} className={getLogClasses(log.type)}>
                <span className="text-zinc-400">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
            {agent.logs.length > 3 && (
              <button
                onClick={() => toggleLogs(agent.name)}
                className="text-emerald-400 hover:underline mt-1 block w-full text-left text-xs"
              >
                {showFullLogs[agent.name] ? 'Show Less' : 'Show All'} ({agent.logs.length})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }, [showFullLogs, toggleLogs, getLogClasses]);

  const renderSortedChunk = useCallback((chunk: SortedChunk, index: number) => {
    return (
        <div key={index} className="bg-zinc-800/50 p-2 rounded mb-2 border-l-2 border-emerald-500">
            <div className="text-xs text-zinc-400 flex justify-between">
                <span>Chunk #{index + 1} (from Agent {chunk.agentId})</span>
                <span className="font-mono">SHA256: {chunk.rehashedSortKey.substring(0, 12)}...</span>
            </div>
            <pre className="text-xs text-slate-300 mt-1 whitespace-pre-wrap max-h-20 overflow-auto">
                {chunk.chunk}
            </pre>
        </div>
    );
  }, []);

  const renderConsensusPanel = useCallback(() => {
    if (!consensusResult) return null;

    return (
      <div className="consensus-panel bg-zinc-700/50 border border-purple-400 rounded-lg p-3 mt-4">
        <div className="flex justify-between items-center font-bold text-purple-400 mb-2">
            <span>Enhanced Consensus: Assembled Code</span>
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-mono">MD5: {consensusResult.assemblyChecksum}</span>
        </div>
        
        <div className="mb-2 text-sm font-semibold text-slate-200">Final Assembled Code Preview:</div>
        <pre className="bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-48 border border-teal-400/50">
            {consensusResult.assembledCode}
        </pre>

        <div className="mt-4 mb-2 text-sm font-semibold text-slate-200">Sorted Code Chunks ({consensusResult.sortedChunks.length}):</div>
        <div className="max-h-48 overflow-y-auto p-1 bg-black/20 rounded">
            {consensusResult.sortedChunks.map(renderSortedChunk)}
        </div>

        <div className="flex gap-2 mt-3 text-xs">
          <button onClick={onCopyConsensus} className="flex-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded">Copy Assembled Code</button>
          <button onClick={() => onApplyConsensus('assembled')} className="flex-1 px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded">Apply Assembled Code</button>
          <button onClick={onRerunOrchestrator} className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded">Enhance Further</button>
        </div>
      </div>
    );
  }, [consensusResult, onCopyConsensus, onApplyConsensus, onRerunOrchestrator, renderSortedChunk]);

  if (!isOpen) return null;

  return (
    <div
      id="ai-response-panel"
      className="fixed bottom-16 right-5 w-[calc(100vw-2.5rem)] md:w-[500px] max-h-[600px] bg-[var(--panel)] border border-[var(--accent)] rounded-md p-4 overflow-y-auto z-50 shadow-xl"
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-zinc-500 hover:text-white text-base">×</button>
      <div id="ai-response-content">
        {agentStatuses.map(renderAgentCard)}
        {consensusResult && renderConsensusPanel()}
      </div>
    </div>
  );
};

export default AiResponsePanel;
