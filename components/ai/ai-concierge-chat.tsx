"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Crown,
  ChevronDown,
  RotateCcw,
  ArrowRight,
  Gauge,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";
import { getCarFallbackImage } from "@/lib/utils/car-images";
import Link from "next/link";
import { toast } from "sonner";

interface CarRecommendation {
  id: number;
  name: string;
  price: number;
  hp: number;
  topSpeed: string;
  zeroToHundred: string;
  tag: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: CarRecommendation[];
  timestamp: string;
}

const INITIAL_SUGGESTIONS = [
  "Recommend a 700+ HP supercar under ₹4 Cr",
  "Lamborghini Urus vs. Rolls-Royce Ghost?",
  "Which vehicle is best for weekend track days?",
  "How does the Live Hypercar Auction work?",
  "Can I schedule a home test drive in Mumbai?",
];

export function AiConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content:
        "Welcome to **Carstore VIP Concierge**. I am your personal luxury automotive specialist. Whether you desire high-revving naturally aspirated V12 acoustic mastery, circuit-honed aerodynamics, or bespoke atelier customization, I am pleased to assist you.\n\nHow may I tailor your automotive journey today?",
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speakReply = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/#/g, "")
        .replace(/\[.*?\]\(.*?\)/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 0.98;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening for VIP inquiry...", {
          description: "Speak clearly into your microphone.",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to contact concierge");

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Our concierge team is at your complete disposal.",
        recommendations: data.recommendations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (voiceEnabled && data.reply) {
        speakReply(data.reply);
      }
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Our secure luxury advisory channel is experiencing high volume. Our master specialists remain available via telephone or showroom appointments.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "reset-welcome",
        role: "assistant",
        content:
          "Conversation refreshed. Welcome once again to **Carstore VIP Concierge**. What bespoke automotive inquiry may I assist you with?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center gap-3 px-4 py-3 rounded-full bg-slate-950/90 border border-gold/40 text-gold shadow-[0_8px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.45)] backdrop-blur-md transition-all duration-300"
          aria-label="Open Carstore VIP AI Concierge"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="text-left hidden sm:block pr-1">
            <p className="text-xs font-semibold tracking-wider uppercase text-gradient-gold">
              VIP Concierge
            </p>
            <p className="text-[10px] text-slate-400">Powered by Gemini AI</p>
          </div>

          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold rounded-full border-2 border-slate-950 flex items-center justify-center text-[9px] text-slate-950 font-bold">
              1
            </span>
          )}
        </motion.button>
      </div>

      {/* Concierge Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[640px] max-h-[82vh] bg-slate-950/95 backdrop-blur-2xl border border-gold/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shadow-sm">
                  <Crown className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-playfair font-bold text-white text-base">
                      Carstore VIP Concierge
                    </h3>
                    <Badge className="bg-gold/15 text-gold border-gold/30 text-[10px] px-1.5 py-0 h-4">
                      AI VIP
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Luxury Automotive Specialist • Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (next) {
                      toast.success("Voice Readout Enabled", { description: "Concierge will speak responses." });
                    } else {
                      window.speechSynthesis?.cancel();
                      toast.info("Voice Readout Muted");
                    }
                  }}
                  title={voiceEnabled ? "Mute Voice Readout" : "Enable Voice Readout"}
                  className={`p-1.5 rounded-lg transition ${
                    voiceEnabled ? "text-gold bg-gold/15" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  onClick={resetChat}
                  title="Reset Conversation"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-slate-800 text-white rounded-br-none border border-slate-700"
                        : "bg-slate-900/90 text-slate-200 rounded-bl-none border border-gold/20 shadow-md"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-gold text-[11px] font-semibold tracking-wider uppercase">
                        <Sparkles className="h-3 w-3" />
                        Concierge Advisory
                      </div>
                    )}

                    <div className="space-y-2 whitespace-pre-wrap leading-relaxed text-[13px]">
                      {msg.content.split("\n\n").map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>

                    {/* Rich Car Recommendation Cards */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                        <p className="text-[11px] font-medium text-gold uppercase tracking-wider">
                          Recommended Atelier Allocations:
                        </p>
                        <div className="space-y-2">
                          {msg.recommendations.map((car) => (
                            <div
                              key={car.id}
                              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-gold/40 transition group"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="font-playfair font-bold text-white text-xs group-hover:text-gold transition">
                                    {car.name}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    {car.tag} • {car.hp} HP • {car.zeroToHundred}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold text-gradient-gold">
                                    {formatPrice(car.price)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-900 flex justify-end">
                                <Link
                                  href={`/cars/${car.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gold hover:text-white transition"
                                >
                                  Inspect Vehicle
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="block text-[10px] text-slate-500 mt-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-slate-900/90 border border-gold/20 rounded-2xl rounded-bl-none px-4 py-3 text-slate-400 text-xs flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gold" />
                    <span>VIP Concierge is analyzing atelier specifications...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none flex gap-2">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="whitespace-nowrap text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-gold/15 text-slate-300 hover:text-gold border border-slate-800 hover:border-gold/30 transition flex-shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? "Listening... (Click to cancel)" : "Speak VIP Inquiry"}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center transition flex-shrink-0 ${
                    isListening
                      ? "bg-red-500/20 border border-red-500 text-red-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-gold hover:border-gold/30"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Inquire or speak about supercars, acoustics..."
                  className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 text-xs focus-visible:ring-gold h-10"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="gradient-gold text-slate-950 hover:opacity-90 h-10 w-10 p-0 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Carstore VIP Advisory • Real-time intelligence powered by Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
