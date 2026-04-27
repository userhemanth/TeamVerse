import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [inbox, setInbox] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    api.get('/messages/inbox').then(res => {
      setInbox(res.data);
      setLoading(false);
      const targetId = searchParams.get('user');
      if (targetId) {
        const contact = res.data.find(c => String(c.user.id) === targetId);
        if (contact) openConversation(contact.user);
        else api.get(`/users/${targetId}`).then(r => openConversation(r.data));
      }
    });
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const openConversation = (contactUser) => {
    setActiveUser(contactUser);
    api.get(`/messages/${contactUser.id}`).then(res => setMessages(res.data));

    // WebSocket
    if (wsRef.current) wsRef.current.close();
    const ids = [user.id, contactUser.id].sort((a, b) => a - b);
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${ids[0]}/${ids[1]}/`);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages(prev => [...prev, {
        id: msg.id, sender: { id: msg.sender_id }, receiver: { id: msg.receiver_id },
        content: msg.content, created_at: msg.created_at, is_read: false,
      }]);
    };
    wsRef.current = ws;
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeUser) return;
    const content = newMsg.trim();
    setNewMsg('');
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content, sender_id: user.id, receiver_id: activeUser.id }));
    } else {
      const res = await api.post('/messages', { receiver: activeUser.id, content });
      setMessages(prev => [...prev, res.data]);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div className="page-container !py-0 h-[calc(100vh-4rem)] flex gap-0">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-dark-500 overflow-y-auto py-4 pr-2">
        <h2 className="text-lg font-bold text-white mb-4 px-2">Messages</h2>
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 glass-card animate-pulse" />)}</div>
        ) : inbox.length === 0 ? (
          <p className="text-slate-500 text-sm px-2">No conversations yet</p>
        ) : (
          <div className="space-y-1">
            {inbox.map(({ user: contact, last_message, unread_count }) => (
              <button
                key={contact.id}
                onClick={() => openConversation(contact)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center gap-3 ${activeUser?.id === contact.id ? 'bg-primary-900/40 border border-primary-700/40' : 'hover:bg-dark-700'}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                  {contact.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white text-sm truncate">{contact.username}</span>
                    {unread_count > 0 && <span className="ml-2 w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0">{unread_count}</span>}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{last_message?.content || 'No messages'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeUser ? (
          <>
            <div className="border-b border-dark-500 px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-sm">
                {activeUser.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-white">{activeUser.username}</div>
                <div className="text-xs text-emerald-400">● Online</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((msg, i) => {
                const isMine = msg.sender?.id === user?.id || msg.sender === user?.id;
                return (
                  <div key={msg.id ?? i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-dark-700 border border-dark-500 text-slate-200 rounded-bl-sm'}`}>
                      {msg.content}
                      <div className={`text-xs mt-1 ${isMine ? 'text-primary-200' : 'text-slate-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-dark-500 px-6 py-4 flex gap-3">
              <textarea
                className="input-field flex-1 !py-2.5 text-sm resize-none max-h-28"
                placeholder="Type a message..."
                rows={1}
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={sendMessage} className="btn-primary !px-5" disabled={!newMsg.trim()}>Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-white font-semibold mb-1">Select a conversation</h3>
              <p className="text-slate-400 text-sm">Choose a contact from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
