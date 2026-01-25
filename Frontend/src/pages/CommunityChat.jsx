import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { sendMessage, getMessages } from "../services/chatService";

const groups = [
  { id: "1", name: " Rice Farmers", description: "Discuss rice farming techniques", color: "from-green-400 to-green-600" },
  { id: "2", name: " Potato Disease Help", description: "Get help with potato diseases", color: "from-emerald-400 to-emerald-600" },
  { id: "3", name: " Organic Farming", description: "Share organic farming tips", color: "from-lime-400 to-lime-600" },
  { id: "4", name: " AgroConnect Community", description: "General community discussions", color: "from-teal-400 to-teal-600" },
  { id: "5", name: " Weather & Irrigation Tips", description: "Weather and irrigation advice", color: "from-green-500 to-green-700" },
  { id: "6", name: " Apple Growers", description: "Discuss apple cultivation and diseases", color: "from-red-400 to-red-600" },
  { id: "7", name: " Tomato Experts", description: "Tomato farming and disease management", color: "from-red-500 to-red-700" },
  { id: "8", name: " Grape Vineyard", description: "Grape growing and wine making tips", color: "from-purple-400 to-purple-600" },
  { id: "9", name: " Strawberry Fields", description: "Strawberry cultivation discussions", color: "from-pink-400 to-pink-600" },
  { id: "10", name: " Orange Grove", description: "Citrus farming and care", color: "from-orange-400 to-orange-600" },
  { id: "11", name: " Peach Orchard", description: "Peach tree management", color: "from-yellow-400 to-yellow-600" },
  { id: "12", name: " Blueberry Patch", description: "Blueberry growing tips", color: "from-blue-400 to-blue-600" },
  { id: "13", name: " Squash Garden", description: "Squash and pumpkin farming", color: "from-amber-400 to-amber-600" },
  { id: "14", name: " Soybean Farmers", description: "Soybean cultivation techniques", color: "from-yellow-500 to-yellow-700" },
  { id: "15", name: " Raspberry Bushes", description: "Raspberry growing community", color: "from-rose-400 to-rose-600" },
];

const CommunityChat = () => {
  const { currentUser } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  // Get avatar initials
  const getAvatarInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Get avatar color based on email
  const getAvatarColor = (email) => {
    const colors = ["bg-green-500", "bg-emerald-500", "bg-lime-500", "bg-teal-500", "bg-green-600"];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close sidebar on mobile when group is selected
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSidebarOpen(false);
  };

  // Fetch messages on group change
  useEffect(() => {
    if (selectedGroup && currentUser) {
      // Unsubscribe from previous listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Set up real-time listener
      unsubscribeRef.current = getMessages(selectedGroup.id, (messagesData) => {
        setMessages(messagesData);
        setError(null);
      });
    }

    // Cleanup on unmount or group change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [selectedGroup, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messageText = newMessage;
    setLoading(true);
    let tempMsg = null;

    try {
      const messageData = {
        sender: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        senderEmail: currentUser.email,
        text: messageText,
      };

      // Add message locally for instant UI update
      tempMsg = {
        id: Date.now().toString(),
        ...messageData,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, tempMsg]);

      setNewMessage(""); // Clear input immediately
      await sendMessage(selectedGroup.id, messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
      // Remove the temp message if sending failed
      if (tempMsg) {
        setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
      }
      // Restore the message text
      setNewMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100 flex-col md:flex-row overflow-hidden">
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden bg-white border-b border-green-200 p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🌱</div>
          <div>
            <h1 className="text-lg font-bold text-green-800">AgroChat</h1>
            <p className="text-xs text-green-600">{selectedGroup.name.split(" ").slice(1).join(" ")}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar with Groups */}
      <div
        className={`
          fixed md:relative z-50 top-0 left-0 h-screen md:h-auto
          w-72 md:w-80 bg-white shadow-xl md:shadow-lg p-4 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🌱</div>
            <h2 className="text-xl font-bold text-green-800">Groups</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-green-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-2 mb-6">
          <div className="text-2xl">🌱</div>
          <h2 className="text-xl font-bold text-green-800">Groups</h2>
        </div>

        <div className="space-y-2">
          {groups.map((group, idx) => (
            <div
              key={group.id}
              onClick={() => handleSelectGroup(group)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                selectedGroup.id === group.id
                  ? `bg-gradient-to-r ${group.color} text-white shadow-lg scale-105`
                  : "bg-green-50 hover:bg-green-100 border border-green-200"
              }`}
            >
              <h3 className="font-bold text-sm md:text-base">{group.name}</h3>
              <p className={`text-xs line-clamp-1 mt-1 ${
                selectedGroup.id === group.id ? "text-white opacity-90" : "text-green-600"
              }`}>
                {group.description}
              </p>
              <div className={`mt-2 flex items-center gap-1 text-xs ${
                selectedGroup.id === group.id ? "text-white opacity-75" : "text-green-500"
              }`}>
                <span className="inline-block w-2 h-2 rounded-full bg-current"></span>
                Active
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-xs text-green-600 font-semibold">💡 Tip</p>
          <p className="text-xs text-green-700 mt-1">Join discussions to help other farmers!</p>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:w-3/4 w-full bg-white md:bg-gradient-to-br md:from-white md:to-green-50">
        {/* Chat Header */}
        <div className="hidden md:flex bg-gradient-to-r from-green-600 to-green-700 shadow-lg p-4 text-white items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
            <p className="text-sm text-green-100 line-clamp-1">{selectedGroup.description}</p>
          </div>
          {currentUser && (
            <div className="text-right">
              <p className="text-xs text-green-200">Logged in as</p>
              <p className="text-sm font-semibold truncate">{currentUser.email}</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-3 mt-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 md:p-4 rounded-r-lg text-sm md:text-base animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl md:text-8xl mb-4 opacity-20">🌱</div>
              <p className="text-green-500 text-center text-sm md:text-base px-4">
                No messages yet. Be the first to share! 👋
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex gap-2 md:gap-3 animate-fadeIn ${
                  msg.sender === currentUser?.uid ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender !== currentUser?.uid && (
                  <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full ${getAvatarColor(msg.senderEmail)} flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-md`}>
                    {getAvatarInitials(msg.senderEmail)}
                  </div>
                )}

                <div className={`flex flex-col max-w-xs md:max-w-md`}>
                  {msg.sender !== currentUser?.uid && (
                    <p className="text-xs font-semibold text-green-700 px-3 py-1">
                      {msg.senderName}
                    </p>
                  )}
                  <div
                    className={`px-3 md:px-4 py-2 md:py-3 rounded-xl shadow-sm text-sm md:text-base break-words transition-all hover:shadow-md ${
                      msg.sender === currentUser?.uid
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none"
                        : "bg-green-100 text-green-800 rounded-bl-none border border-green-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 opacity-70 flex items-center gap-1`}>
                      {msg.createdAt ? new Date(msg.createdAt.toDate ? msg.createdAt.toDate() : msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      }) : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t-2 border-green-200 p-3 md:p-4 shadow-xl">
          {!currentUser ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-green-600 text-xs md:text-sm font-medium"> Please log in to send messages</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-2 md:p-3 text-sm md:text-base border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-green-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-sm md:text-base whitespace-nowrap transform hover:scale-105 active:scale-95 duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">

                    <span className="hidden md:inline">Sending</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="hidden md:inline">Send</span>
                    <span className="text-lg">➤</span>
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;