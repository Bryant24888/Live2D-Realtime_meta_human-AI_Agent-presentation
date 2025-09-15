import { GoogleGenAI, Chat } from '@google/genai';
import React, { useState, useRef, useEffect, FormEvent } from 'react';

// Message type
interface Message {
    sender: 'user' | 'bot';
    text: string;
}

// A simple SVG spinner component for loading state
const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const VirtualAssistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([{sender: 'bot', text: "你好! 我是你的虚拟助手，有什么可以帮你的吗？"}]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize the chat model
    useEffect(() => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const chatInstance = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a helpful virtual assistant.',
                },
            });
            setChat(chatInstance);
        } catch (error) {
            console.error("Failed to initialize the AI model:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: '错误: 无法初始化AI模型。请检查您的API密钥和配置。' }]);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            let botResponse = '';
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

            for await (const chunk of stream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = botResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: '抱歉，我遇到了一个错误。请再试一次。' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
            <header className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">虚拟助手</h2>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-300'}`}>
                                <p className="text-sm whitespace-pre-wrap">
                                    {msg.text}
                                    {isLoading && msg.sender === 'bot' && msg.text === '' && '...'}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <footer className="p-4 border-t border-slate-700">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="问我任何事..."
                        disabled={isLoading || !chat}
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim() || !chat}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-20"
                    >
                        {isLoading ? <Spinner /> : '发送'}
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default VirtualAssistant;