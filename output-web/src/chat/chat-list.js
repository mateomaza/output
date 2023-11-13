import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ChatList() {
    const { userId } = useParams();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get(`get/${userId}/chats`);
                setChats(response.data.chats);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, [userId]);

    return (
        <div>
            <h2>Chats</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <Link to={`/chat/${chat.id}`} className="chat-link">
                            Chat with {chat.participants.join(', ')} - Last message at: {new Date(chat.last_message_time).toLocaleString()}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatList;
