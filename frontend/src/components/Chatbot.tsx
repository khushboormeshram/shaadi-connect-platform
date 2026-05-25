import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Heart, X, Send, Volume2, VolumeX } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Welcome to Shaadi Connect! I'm here to help with wedding planning. Try saying 'list wedding venues in Mumbai' or 'list marriage bureaus near me'!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL"; // Priya voice
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  // Function to clean and truncate response
  const cleanResponse = (text: string): string => {
    // Remove markdown symbols and normalize whitespace
    let cleaned = text
      .replace(/[*_#|]+/g, "") // Remove *, _, #, |
      .replace(/\s+/g, " ") // Normalize multiple spaces
      .trim();
    // Truncate to 50 words
    const words = cleaned.split(" ").slice(0, 50).join(" ");
    return words.length > 0 ? words : cleaned; // Return truncated or original if too short
  };

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const simulateTyping = useCallback((text: string, callback: (text: string) => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback(text);
    }, 200);
  }, []);

  const getUserLocation = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude},${longitude}`);
          },
          () => {
            resolve("unknown location");
          }
        );
      } else {
        resolve("unknown location");
      }
    });
  }, []);

  const readAloud = useCallback(async (text: string, messageId: number) => {
    if (speakingMessageId === messageId) {
      stopSpeech();
      return;
    }

    stopSpeech();

    // Use Web Speech API for texts under 200 characters for faster response
    if (text.length < 200) {
      const speech = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang === "en-IN") || voices.find((v) => v.lang === "en-US");
      if (voice) {
        speech.voice = voice;
      }
      speech.lang = voice?.lang || "en-US";
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      speech.onend = () => {
        setSpeakingMessageId(null);
      };
      window.speechSynthesis.speak(speech);
      setSpeakingMessageId(messageId);
      return;
    }

    // Fallback to ElevenLabs for longer texts
    try {
      const start = Date.now();
      const response = await axios.post(
        ELEVENLABS_API_URL,
        {
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          responseType: "arraybuffer",
        }
      );
      console.log(`ElevenLabs API took: ${Date.now() - start}ms`);

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeakingMessageId(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.play();
      setSpeakingMessageId(messageId);
    } catch (error) {
      console.error("Error with ElevenLabs TTS:", error);
      // Fallback to Web Speech API
      const speech = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang === "en-IN") || voices.find((v) => v.lang === "en-US");
      if (voice) {
        speech.voice = voice;
      }
      speech.lang = voice?.lang || "en-US";
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      speech.onend = () => {
        setSpeakingMessageId(null);
      };
      window.speechSynthesis.speak(speech);
      setSpeakingMessageId(messageId);
    }
  }, [speakingMessageId, ELEVENLABS_API_KEY]);

  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = { sender: "user", text, timestamp: new Date() };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
        let prompt = `You are a wedding planning expert for Shaadi Connect. Provide a concise answer (max 50 words) about wedding vendors, venues, cultural traditions, or marriage assistance schemes. Use plain text only. Do not use asterisks, bullet points, markdown symbols (like *, -, |, #), or tables. Do not ask follow-up questions unless requested: ${text}`;

        if (text.toLowerCase().includes("list") && text.toLowerCase().includes("marriage bureaus near me")) {
          const location = await getUserLocation();
          prompt = `You are a wedding planning expert for Shaadi Connect. The user is looking for marriage bureaus near their location (${location}). Provide a concise plain text answer (max 50 words) listing reputable marriage bureaus with names and brief descriptions. If location is unknown, suggest popular ones in major Indian cities. Use plain text only. Do not use asterisks, bullet points, markdown symbols (like *, -, |, #), or tables. Include a short note on booking advice.`;
        } else if (text.toLowerCase().includes("list") && text.toLowerCase().includes("vendors near")) {
          const location = await getUserLocation();
          prompt = `You are a wedding planning expert for Shaadi Connect. The user is looking for wedding vendors near their location (${location}). Provide a concise plain text answer (max 50 words) listing reputable vendors (e.g., caterers, decorators, photographers) with names and brief descriptions. If location is unknown, suggest popular vendors in India. Use plain text only. Do not use asterisks, bullet points, markdown symbols (like *, -, |, #), or tables. Include a short note on booking advice.`;
        } else if (text.toLowerCase().includes("list") && text.toLowerCase().includes("wedding venues")) {
          const locationMatch = text.match(/in\s+([a-zA-Z\s]+)/i);
          const location = locationMatch ? locationMatch[1].trim() : await getUserLocation();
          prompt = `You are a wedding planning expert for Shaadi Connect. The user is looking for wedding venues in ${location}. Provide a concise plain text answer (max 50 words) listing popular venues with names and brief descriptions. If location is unknown, suggest popular venues in India. Use plain text only. Do not use asterisks, bullet points, markdown symbols (like *, -, |, #), or tables. Include a short note on pricing and booking advice. Example: Taj Mahal Palace in Mumbai, a luxurious hotel, offers sea-view ballrooms for Rs.3500+ per plate. Book early via Weddingz.in.`;
        }

        const start = Date.now();
        const response = await axios.post(
          `${API_URL}?key=${API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          { headers: { "Content-Type": "application/json" }, timeout: 5000 } // Reduced timeout
        );
        console.log(`Gemini API took: ${Date.now() - start}ms`);

        const botResponseText = cleanResponse(response.data.candidates[0].content.parts[0].text);

        // Start speech immediately with cleaned and truncated response
        readAloud(botResponseText, messages.length + 1);

        // Simulate typing for visual feedback without blocking speech
        simulateTyping(botResponseText, (text) => {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text, timestamp: new Date() },
          ]);
        });
      } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage = "Oops, something went wrong. Let's try again!";
        // Start speech immediately for error
        readAloud(errorMessage, messages.length + 1);
        // Simulate typing for visual feedback
        simulateTyping(errorMessage, (text) => {
          setMessages((prev) => [...prev, { sender: "bot", text }]);
        });
      } finally {
        setLoading(false);
      }
    },
    [simulateTyping, getUserLocation, messages.length, readAloud, ELEVENLABS_API_KEY]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && !isTyping) {
      sendMessage(input);
    }
  };

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
    if (speakingMessageId !== null) {
      stopSpeech();
    }
  };

  // Suggestions tailored to wedding planning and marriage schemes
  const suggestions = [
    "List wedding venues in Mumbai",
    "List marriage bureaus near me",
    "List vendors near me",
    "How to plan a budget wedding?",
    "What are marriage assistance schemes in India?",
  ];

  return (
    <>
      {/* Chat Button with Heart Animation */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer group animate-pulse-slow"
        onClick={toggleChatbot}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white">
          {isOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <Heart className="w-8 h-8 text-white animate-pulse" />
          )}
          <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
            <div className="heart-sparkle heart-sparkle-1"></div>
            <div className="heart-sparkle heart-sparkle-2"></div>
            <div className="heart-sparkle heart-sparkle-3"></div>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-200 transform scale-95 animate-in zoom-in-95 duration-300"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-2xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full filter blur-xl -ml-10 -mb-10"></div>
              <div className="flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative backdrop-blur-sm animate-pulse-slow">
                  <Heart className="w-6 h-6 text-white" />
                  <div className="absolute w-3 h-3 bg-pink-400 rounded-full bottom-0 right-0 border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white animate-fade-in">Shaadi Connect Assistant</h1>
                  <p className="text-sm text-pink-100 animate-fade-in delay-100">Your Wedding Planning Partner 💍</p>
                </div>
              </div>
              <button
                onClick={toggleChatbot}
                className="text-white/90 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-[400px] sm:h-[500px] overflow-y-auto p-4 bg-gradient-to-b from-pink-50 to-white">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-3 animate-slide-in-right`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`relative max-w-[75%] p-3.5 rounded-2xl shadow-sm transition-all duration-300 group ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                        : "bg-white text-gray-800 border border-pink-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        msg.sender === "user" ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.sender === "bot" && (
                      <button
                        onClick={() => readAloud(msg.text, index)}
                        className={`absolute -right-2 -top-2 p-1.5 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          speakingMessageId === index
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-rose-500 text-white hover:bg-rose-600"
                        }`}
                        title={speakingMessageId === index ? "Stop" : "Read Aloud"}
                      >
                        {speakingMessageId === index ? (
                          <VolumeX className="w-3 h-3" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {(isTyping || loading) && (
                <div className="flex justify-start mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl shadow-sm flex items-center gap-2 border border-pink-100">
                    <div className="flex space-x-1.5">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{loading ? "Planning..." : "Typing..."}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="px-4 py-2 bg-pink-50 overflow-x-auto scrollbar-hide">
                <p className="text-xs text-gray-500 mb-2 animate-fade-in">Try asking:</p>
                <div className="flex gap-2 pb-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="px-3 py-1.5 bg-white text-rose-600 text-xs font-medium rounded-full shadow-sm border border-rose-100 hover:bg-rose-50 transition-colors whitespace-nowrap flex-shrink-0 animate-slide-in-right"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-pink-100 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="List venues, bureaus, or vendors..."
                  className="w-full p-3 pl-4 pr-10 bg-pink-50 rounded-full border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 placeholder-gray-400 animate-placeholder-glow"
                  disabled={loading || isTyping}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Send className="w-5 h-5" />
                </div>
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading || isTyping}
                className={`p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-md transition-all duration-300 ${
                  !input.trim() || loading || isTyping
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg hover:from-rose-600 hover:to-pink-600 animate-pulse-slow"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-pink-50 border-t border-pink-100 text-center">
              <p className="text-xs text-gray-500 animate-fade-in">
                Powered by Shaadi Connect AI • Your Love Story, Our Priority 💖
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;