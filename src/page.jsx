"use client";

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function DashboardChat() {
  const [messages, setMessages] = useState([]); // Full chat history
  const [input, setInput] = useState('');
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [loadingDots, setLoadingDots] = useState('.'); // Dynamic dots state
  const [messageLimitReached, setMessageLimitReached] = useState(false); // Limit state
  const maxMessages = 20; // Maximum number of responses allowed

  // Handle dynamic dots animation
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length === 4 ? '.' : prev + '.'));
      }, 500); // Update every 500ms
    } else {
      setLoadingDots('.'); // Reset dots when not loading
    }
    return () => clearInterval(interval); // Cleanup interval
  }, [isLoading]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Check if the message limit is reached
    if (messages.filter((msg) => msg.role === 'assistant').length >= maxMessages) {
      setMessageLimitReached(true);
      return;
    }

    const newMessage = { role: 'user', content: trimmedInput };

    // Add user message to the chat
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setShowInitialMessage(false); // Hide the initial message on user input
    setIsLoading(true); // Start loading state

    // Send the full message history to the Flask backend
    fetch('http://127.0.0.1:5000/process-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [...messages, newMessage] }), // Send full chat history
    })
      .then((res) => res.json())
      .then((data) => {
        // Add the assistant's response to the chat
        const botMessage = {
          role: 'assistant',
          content: data.response || 'Error: No response from server',
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false); // Stop loading state
      })
      .catch((err) => {
        console.error('Error:', err);
        const botMessage = {
          role: 'assistant',
          content: 'Error: Could not fetch response',
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false); // Stop loading state
      });
  };

  return (
    <div className="flex h-screen p-1 bg-[#f3f3f3] gap-1">
      {/* Power BI Dashboard (70%) */}
      <div className="w-7/10 h-full bg-customGray shadow-lg rounded-lg">
        <iframe
          title="Power BI Dashboard"
          className="w-full h-full rounded-md"
          src="https://app.powerbi.com/view?r=eyJrIjoiNWViYTk5YTEtZmRkYy00MmY3LWI4MmMtODA5Y2MwMGQ5MDljIiwidCI6IjdhZmI5ZTIyLTkzMDgtNDE4Ni04ZTI5LWVhMjMxZmYzYmFmNyIsImMiOjN9"
          allowFullScreen
        />
      </div>

      {/* Chat Interface (30%) */}
      <div className="w-3/10 h-full flex flex-col bg-customBlack text-white shadow-lg rounded-lg p-1.5 relative">
        {/* White overlay and message when limit is reached */}
        {messageLimitReached && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">You have reached the maximum limit</h1>
              <p className="text-lg text-white">Try again after some time</p>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="h-10 bg-customGray flex items-center justify-center px-4 rounded-t-md">
          <h1 className="text-xl font-bold text-white">AI Assistant</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-2 overflow-y-auto chatbox-scrollbar relative">
          {/* Initial Message */}
          {showInitialMessage && (
  <div className="absolute inset-0 flex justify-center items-center">
    <div className="text-center p-4 rounded-lg bg-customLightBlue text-black max-w-[80%]">
      <p className="font-bold mb-5">
      🤖 Welcome! I'm your AI-powered assistant, here to help you discover the perfect Huberman Lab podcast tailored to your interests.
      </p>
      <p className="font-semibold mb-2">Examples of questions you can ask:</p>
      <div className="font-semibold text-left mb-2space-y-2">
        <p>📌 Who is Andrew Huberman, and what does he specialize in?</p>
        <p>📌 What topics does he cover in his videos?</p>
        <p>📌 Which fitness-related video received the most attention?</p>
        <p>📌 What is this specific video about?</p>
        <p>📌 What does AMA in the dashboard mean?</p>
        <p>📌 Has Andrew made any videos on fitness or exercise science?</p>
        <p>📌 I want to improve my sleep. Which episode should I watch?</p>
      </div>
    </div>
  </div>
)}




          {/* Regular Messages */}
          {!showInitialMessage &&
            messages.map((message, index) => {
              // Only parse assistant messages for the text, thumbnail, and video URL
              if (message.role === 'assistant') {
                const regex = /'([^']*)',\s*'([^']*)',\s*'([^']*)'/;
                const match = message.content.match(regex);

                if (match) {
                  const text = match[1] || ''; // Extracted text
                  const thumbnailUrl = match[2] || ''; // Extracted thumbnail URL
                  const videoUrl = match[3] || ''; // Extracted video URL

                  return (
                    <div
                      key={index}
                      className={` max-w-[95%] mb-6 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`inline-block p-3 rounded-t-xl rounded-br-xl ${
                          message.role === 'user'
                            ? 'bg-[#171717] text-white font-semibold '
                            : 'bg-customLightBlue text-black font-semibold '
                        }`}
                      >
                        {/* Render Thumbnail Image with Link */}
                        {thumbnailUrl && videoUrl && (
                          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={thumbnailUrl}
                              alt="Thumbnail"
                              className="max-w-[200px] rounded-lg cursor-pointer mb-2"
                              onError={(e) => {
                                console.error('Error loading image:', e.target.src);
                                e.target.style.display = 'none'; // Hide broken image
                              }}
                            />
                          </a>
                        )}
                        {/* Render Text Below the Image */}
                        {text && <p className="mt-2">{text}</p>}
                      </div>
                    </div>
                  );
                } else {
                  // Fallback to plain text rendering
                  return (
                    <div
                      key={index}
                      className={`max-w-[95%] mb-6 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`inline-block p-3 rounded-t-xl rounded-br-xl ${
                          message.role === 'user'
                            ? 'bg-[#171717] text-white font-semibold '
                            : 'bg-customLightBlue text-black font-semibold '
                        }`}
                      >
                        <p>{message.content.replace(/^'|'$/g, '')}</p> {/* Remove enclosing quotes */}
                      </div>
                    </div>
                  );
                }
              }

              // Render user messages
              return (
                <div
                  key={index}
                  className={`max-w-[95%] mb-6 ${message.role === 'user' ? 'ml-auto text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-t-xl rounded-bl-xl ${
                      message.role === 'user'
                        ? 'bg-[#171717] text-white font-semibold text-left '
                        : 'bg-customLightBlue text-black font-semibold text-left '
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              );
            })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center text-white-500 font-semibold mt-4">
              Interacting{loadingDots}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="h-16 bg-customGray p-2 flex items-center rounded-b-md">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="h-10 flex-1 p-3 rounded-lg font-semibold bg-customGray text-white placeholder-customWhite focus:outline-none"
              disabled={isLoading || messageLimitReached} // Disable input if limit is reached
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-customBlue-600 text-white focus:outline-none hover:bg-[#000507] transition-colors"
              disabled={isLoading || messageLimitReached} // Disable button if limit is reached
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
