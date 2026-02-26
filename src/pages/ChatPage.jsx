import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  MapPin, 
  MoreVertical, 
  Phone,
  User as UserIcon,
  Smile,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000';
const ENDPOINT = 'http://localhost:5000';
let socket;

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/api/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", chatId);
      } catch (error) {
        console.error("Failed to load messages", error);
        setLoading(false);
      }
    };

    const fetchChatInfo = async () => {
       try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentChat = data.find(c => c._id === chatId);
        setChatInfo(currentChat);
       } catch(e) {}
    }

    if (socketConnected) {
      fetchMessages();
      fetchChatInfo();
    }
  }, [chatId, socketConnected]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageReceived) => {
      if (!chatId || (newMessageReceived.chat._id && chatId !== newMessageReceived.chat._id)) {
        // Notification logic here
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [chatId]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage.trim()) {
      try {
        const token = localStorage.getItem('token');
        const messageText = newMessage;
        setNewMessage("");
        const { data } = await axios.post(`${API_URL}/api/chat/send`, {
          content: messageText,
          chatId: chatId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Send failed", error);
      }
    }
  };

  const otherParticipant = chatInfo?.participants.find(p => p._id !== user.id);

  return (
    <div className="chat-container h-[calc(100vh-120px)] flex flex-col glass-card overflow-hidden">
      {/* Chat Header */}
      <div className="chat-header p-4 border-b flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full md:hidden">
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              {otherParticipant?.name[0] || "?"}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div>
            <h3 className="font-bold text-sm leading-tight">{otherParticipant?.name || "Loading..."}</h3>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/50 rounded-lg text-muted transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg text-muted transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare size={48} className="mx-auto text-muted mb-4 opacity-10" />
            <p className="text-muted text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.sender._id === user.id;
            return (
              <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  isMe 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border'
                }`}>
                  {!isMe && <p className="text-[10px] font-bold opacity-60 mb-1">{m.sender.name}</p>}
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <p className={`text-[9px] mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'} text-right`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white/40">
        <div className="flex items-center gap-3 bg-white border rounded-2xl px-4 py-2 shadow-inner">
          <button className="text-muted hover:text-primary">
            <Smile size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none outline-none py-1 text-sm"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleSendMessage}
          />
          <button 
            onClick={() => handleSendMessage({ key: 'Enter' })}
            disabled={!newMessage}
            className={`p-2 rounded-xl transition-all ${
              newMessage ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-muted mt-2">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}
