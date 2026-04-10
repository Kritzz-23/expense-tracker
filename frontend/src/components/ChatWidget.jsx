import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';

import { API_BASE } from '../config';

const STARTER_PROMPTS = [
  'Where did I spend most this week?',
  'Am I close to my budget limit?',
  'What recurring payments should I expect next?',
];

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Ask about weekly spending, budget pressure, or recurring expenses.',
    },
  ]);

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: `user-${Date.now()}`, role: 'user', content: trimmedMessage },
    ]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, { message: trimmedMessage });
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: `assistant-${Date.now()}`, role: 'assistant', content: response.data.answer },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: 'The assistant could not answer right now. Try again after refreshing the dashboard data.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_12px_40px_rgba(59,130,246,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(168,85,247,0.35)]"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-white/10 bg-[#111113]/95 shadow-[0_18px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="border-b border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">AI Finance Assistant</div>
                <div className="text-xs text-zinc-500">Grounded on your logged expense data</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-white disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[22rem] space-y-3 overflow-y-auto p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'border border-white/10 bg-white/5 text-zinc-200'
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about spending, budget, or trends"
                className="flex-1 bg-transparent px-2 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white transition hover:brightness-110 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
