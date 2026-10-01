import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  RotateCcw,
  Minimize2,
  Maximize2,
  ChevronRight,
  ExternalLink,
  Package,
  Tag
} from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import RatingStars from '../common/RatingStars';

const AiAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hi! I'm **Nova**, your AI shopping concierge. Ask me for product recommendations, gift ideas, active discount codes, or package tracking updates!",
      suggestedActions: [
        "🔥 What's trending today?",
        "🎧 Headphones under $300",
        "🏷️ Any discount codes?",
        "📦 Track my order"
      ],
      products: [],
      order: null,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { addToCart } = useCart();
  const { addToast } = useToast();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await aiApi.sendMessage(text, location.pathname);
      if (res.success && res.data) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: res.data.reply,
          suggestedActions: res.data.suggestedActions || [],
          products: res.data.products || [],
          order: res.data.order || null,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I apologize, I'm having a brief connection issue. Please feel free to re-ask or browse our catalog directly.",
        suggestedActions: ['Browse All Products', 'Any discount codes?'],
        products: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: "Conversation refreshed. How can I assist your shopping journey today?",
        suggestedActions: [
          "🔥 What's trending today?",
          "🎧 Headphones under $300",
          "🏷️ Any discount codes?",
          "📦 Track my order"
        ],
        products: [],
        order: null,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center space-x-2.5 bg-gradient-to-r from-slate-900 via-brand-900 to-brand-700 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:shadow-brand-500/25 border border-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            {/* Live pulsing dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-tight leading-tight">Nova AI</div>
            <div className="text-[10px] text-brand-300 font-semibold leading-tight">Shopping Agent</div>
          </div>
        </button>
      )}

      {/* AI Chat Window Modal / Dock */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-xl ${
            isExpanded
              ? 'w-[95vw] sm:w-[650px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[420px] h-[600px] max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black tracking-tight">Nova Assistant</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    Live Agent
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Powered by Catalog Intelligence</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white'
                        : 'bg-brand-600 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none space-y-3'
                    }`}
                  >
                    <div className="whitespace-pre-line font-medium">
                      {msg.text.split('\n').map((line, idx) => {
                        // Simple bold parsing
                        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
                        return (
                          <span key={idx} className="block">
                            {parts.map((p, i) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return <strong key={i} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>;
                              }
                              if (p.startsWith('`') && p.endsWith('`')) {
                                return (
                                  <code key={i} className="bg-slate-100 text-brand-700 font-mono px-1 py-0.5 rounded font-bold">
                                    {p.slice(1, -1)}
                                  </code>
                                );
                              }
                              return p;
                            })}
                          </span>
                        );
                      })}
                    </div>

                    {/* Rich Attached Order Card */}
                    {msg.order && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2 mt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-900 flex items-center space-x-1">
                            <Package className="w-3.5 h-3.5 text-brand-600" />
                            <span>Order #{msg.order.id}</span>
                          </span>
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px]">
                            {msg.order.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {msg.order.orderItems?.length || 0} items • Total: ${Number(msg.order.totalAmount).toFixed(2)}
                        </div>
                        <Link
                          to="/orders"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center space-x-1 text-[11px] text-brand-600 font-bold hover:underline"
                        >
                          <span>View in Orders Tab</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    {/* Rich Attached Product Recommendations */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {msg.products.map((p) => (
                          <div
                            key={p.id}
                            className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl p-2.5 flex flex-col justify-between transition-colors shadow-2xs"
                          >
                            <div className="flex items-center space-x-2.5 mb-2">
                              <img
                                src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                                alt={p.name}
                                className="w-12 h-12 rounded-lg object-cover bg-white flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <Link
                                  to={`/products/${p.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="font-bold text-slate-900 hover:text-brand-600 truncate block text-[11px]"
                                  title={p.name}
                                >
                                  {p.name}
                                </Link>
                                <div className="text-[10px] text-slate-400 font-semibold">{p.brand}</div>
                                <div className="text-xs font-black text-slate-900 mt-0.5">
                                  ${Number(p.price).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                addToCart(p, 1);
                                addToast(`Added "${p.name}" to cart!`, 'success');
                              }}
                              className="w-full bg-slate-900 hover:bg-brand-600 text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggested Prompt Action Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs transition-all text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center space-x-2 pl-2">
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-xs flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Nova (e.g. 'Show headphones under $300')..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="w-9 h-9 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-600/20 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistantWidget;
