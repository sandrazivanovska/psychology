import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/mental-health-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Backend error:', error);
        setIsTyping(false);
        return;
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      setIsTyping(false);
    } catch (err) {
      console.error('❌ Network error:', err);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 h-[80vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-right'
                  : 'bg-gray-200 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && (
            <div className="text-sm text-gray-400 animate-pulse">Ботот пишува...</div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded p-2"
            placeholder="Напиши порака..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isTyping}
          >
            Прашај
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
