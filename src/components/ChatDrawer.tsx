import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Globe,
  Loader2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { askGeminiChat, GeminiModelType } from '../services/gemini';
import { User } from 'firebase/auth';
import { saveChatMessageToFirestore } from '../services/firebase';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  user: User | null;
  datasetContext: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  setMessages,
  user,
  datasetContext,
}) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleToggleSearch = () => {
    if (!useSearchGrounding) {
      setSelectedModel('gemini-3.5-flash');
      setUseSearchGrounding(true);
    } else {
      setUseSearchGrounding(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    if (user) {
      saveChatMessageToFirestore(user.uid, userMessage);
    }

    try {
      const response = await askGeminiChat(
        messages,
        messageContent,
        selectedModel,
        useSearchGrounding,
        datasetContext
      );

      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'model',
        content: response.text,
        timestamp: Date.now(),
        sources: response.sources,
        modelUsed: selectedModel,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (user) {
        saveChatMessageToFirestore(user.uid, botMessage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const quickPrompts = [
    { label: 'Explain Star Schema for Viva', prompt: 'Explain the Star Schema designed for this Supermarket project and why we used 1-to-many single-directional relationships.' },
    { label: 'Why 4.76% Margin?', prompt: 'In our dataset, why is gross income equal to the 5% tax and why is gross margin percentage 4.7619%? Explain the math clearly for my project report.' },
    { label: 'Global Retail Benchmarks', prompt: 'Compare our supermarket basket size and margin against Walmart and global retail industry benchmarks using Google Search data.', search: true },
    { label: 'Top 3 Viva Questions', prompt: 'Act as an external university examiner and quiz me on the top 3 hardest Power BI DAX questions for this project.' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">AI BI Professor & Advisor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500">
              Multi-turn Copilot • Power BI • DAX • Viva Voce Prep
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              title="Clear chat history"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model & Search Grounding Controls Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs gap-2">
        {/* Model Selector */}
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as GeminiModelType)}
            disabled={useSearchGrounding}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
          >
            <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Viva Prep)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast DAX)</option>
          </select>
        </div>

        {/* Google Search Grounding Toggle */}
        <button
          onClick={handleToggleSearch}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold border transition ${
            useSearchGrounding
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title="Enable live Google Search grounding for real-world retail benchmarks"
        >
          <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>Google Search</span>
        </button>
      </div>

      {/* Chat Messages Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Welcome to your College BI Copilot
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Ask questions about your Supermarket dataset, DAX formulas, Star Schema, or practice your college Viva Voce presentation.
              </p>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-2 pt-2 text-left">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Suggested Prompts
              </span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (qp.search) setUseSearchGrounding(true);
                    handleSendMessage(qp.prompt);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 text-xs transition flex items-center justify-between group shadow-2xs"
                >
                  <span className="group-hover:text-blue-700 font-medium">{qp.label}</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-2xs ${
                    isUser
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Sources Grounding Display */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                      <div className="font-semibold text-blue-700 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Grounded Search Citations:
                      </div>
                      <div className="space-y-0.5">
                        {msg.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-slate-600 hover:text-blue-700 underline truncate max-w-xs"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isUser && (
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                      <span>{msg.modelUsed || selectedModel}</span>
                      <button
                        onClick={() => handleCopyCode(msg.content, msg.id)}
                        className="hover:text-blue-700 flex items-center gap-1 transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-slate-500 flex items-center space-x-2 shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Analyzing with {selectedModel}...</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              useSearchGrounding
                ? 'Ask with live Google retail search data...'
                : 'Ask about DAX, Star Schema, Viva Qs...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
