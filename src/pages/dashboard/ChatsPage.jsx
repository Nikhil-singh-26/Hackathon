import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

import io from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const ENDPOINT = 'http://localhost:5000';

export default function ChatsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch chats", error);
        setLoading(false);
      }
    };

    fetchChats();

    const socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("message received", (newMessage) => {
      setChats((prev) => {
        const chatToUpdate = prev.find(c => c._id === newMessage.chat._id);
        if (chatToUpdate) {
            // Update latest message and move to top
            const updatedChat = { ...chatToUpdate, latestMessage: newMessage, updatedAt: new Date().toISOString() };
            return [updatedChat, ...prev.filter(c => c._id !== newMessage.chat._id)];
        }
        return prev;
      });
    });

    return () => socket.disconnect();
  }, [user]);

  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p._id !== user.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="chats-page max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="os-page-title">Messages</h1>
          <p className="text-muted">Stay connected with your event partners.</p>
        </div>
      </div>

      <div className="glass-card p-4 mb-6 flex items-center gap-4">
        <Search className="text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search conversations..." 
          className="bg-transparent border-none outline-none w-full text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-muted">Loading your conversations...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <MessageSquare size={48} className="mx-auto text-muted mb-4 opacity-10" />
            <h3 className="font-bold text-lg mb-2">No messages yet</h3>
            <p className="text-muted">Your active conversations will appear here.</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = chat.participants.find(p => p._id !== user.id);
            return (
              <div 
                key={chat._id} 
                onClick={() => navigate(`/dashboard/chat/${chat._id}`)}
                className="glass-card hover:bg-white/40 transition-all cursor-pointer p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {otherParticipant?.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{otherParticipant?.name}</h3>
                    <p className="text-sm text-muted line-clamp-1">
                      {chat.latestMessage ? chat.latestMessage.text : "No messages yet"}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : ""}</span>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
