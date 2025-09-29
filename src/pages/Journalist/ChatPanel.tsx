import React from 'react';
import { FiSend, FiSearch } from 'react-icons/fi';
// Make sure this path is correct for your project structure
import userAvatar from '../../assets/signUp.png'; 

const contacts = [
  { name: 'John Doe', status: 'online', avatar: userAvatar },
  { name: 'Jane Smith', status: 'offline', avatar: userAvatar },
  { name: 'Alex Johnson', status: 'online', avatar: userAvatar },
];

const messages = [
  { sender: 'John Doe', text: 'Hey, did you see the latest release notes?' },
  { sender: 'You', text: 'Not yet, anything major?' },
  { sender: 'John Doe', text: 'Yeah, the new analytics features are live. Pretty impressive stuff.' },
];

const ChatPanel: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl h-full flex flex-col ring-1 ring-white/10">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-bold text-white">Messages</h3>
        <div className="relative mt-2">
          <input type="text" placeholder="Search contacts..." className="w-full text-sm bg-gray-800/50 rounded-full pl-8 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-shrink-0 border-b border-gray-700/50">
        <div className="p-2 space-y-1">
          {contacts.map(contact => (
            <div key={contact.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer">
              <div className="relative">
                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-gray-800 ${contact.status === 'online' ? 'bg-green-400' : 'bg-gray-500'}`} />
              </div>
              <span className="font-medium text-sm text-gray-200">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Message Area */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.sender === 'You' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="relative">
          <input type="text" placeholder="Type a message..." className="w-full text-sm bg-gray-800/50 rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;