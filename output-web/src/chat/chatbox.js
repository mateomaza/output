import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

function Chat() {
    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const pusher = new Pusher('be9c8cfe8a972d05139f', {
            cluster: 'sa1'
        });

        const channel = pusher.subscribe('chat_channel');

        channel.bind('new_message', (data) => {
            setMessages((msgs) => [...msgs, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/send/message', {
                sender,
                receiver,
                content
            });

            console.log(response.data);
            setContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <form onSubmit={sendMessage}>
                <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Sender ID" />
                <input type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Receiver ID" />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your message here"></textarea>
                <button type="submit">Send Message</button>
            </form>

            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}</strong>: {msg.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat