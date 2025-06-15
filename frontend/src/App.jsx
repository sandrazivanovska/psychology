import { useState, useRef, useEffect } from 'react';
import { BotIcon, UserIcon, PlusIcon } from 'lucide-react';

function App() {
  const [chats, setChats] = useState([
    { id: 'Разговор 1', messages: [] }
  ]);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const activeChat = chats[activeChatIndex];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedChats = [...chats];
    updatedChats[activeChatIndex].messages.push({ role: 'user', content: input });
    setChats(updatedChats);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://psychology-h57h.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedChats[activeChatIndex].messages }),
      });

      const data = await response.json();
      const fullReply = data.reply;

      let currentReply = '';
      updatedChats[activeChatIndex].messages.push({ role: 'assistant', content: '' });
      setChats([...updatedChats]);

      for (let i = 0; i < fullReply.length; i++) {
        currentReply += fullReply[i];
        await new Promise((r) => setTimeout(r, 15));

        setChats((prev) => {
          const copy = [...prev];
          copy[activeChatIndex].messages[copy[activeChatIndex].messages.length - 1].content = currentReply;
          return copy;
        });
      }

      setIsTyping(false);
    } catch (err) {
      console.error('❌ Error:', err);
      setIsTyping(false);
    }
  };

  const newChat = () => {
    const newId = `Разговор ${chats.length + 1}`;
    setChats([...chats, { id: newId, messages: [] }]);
    setActiveChatIndex(chats.length);
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chats]);

  return (
    <div className="h-screen w-full bg-gray-100 flex">
      {/* Chat History Panel */}
      <div className="w-60 bg-white border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Разговори</h2>
          <button
            onClick={newChat}
            className="p-1 rounded hover:bg-gray-200"
            title="Нов разговор"
          >
            <PlusIcon size={20} />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto">
          {chats.map((chat, index) => (
            <button
              key={index}
              onClick={() => setActiveChatIndex(index)}
              className={`w-full text-left p-2 rounded ${
                index === activeChatIndex ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
              }`}
            >
              {chat.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white text-center py-4 font-semibold text-lg">
            Mental Health Chatbot 💬
          </div>

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {activeChat.messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="bg-blue-600 text-white rounded-full p-2">
                    <BotIcon size={20} />
                  </div>
                )}
                <div
                  className={`max-w-xs p-3 rounded-xl text-sm ${
                    msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="bg-gray-400 text-white rounded-full p-2">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
                <BotIcon size={20} className="text-blue-600" />
                Ботот пишува...
              </div>
            )}
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Напиши нешто..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Прашај
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
