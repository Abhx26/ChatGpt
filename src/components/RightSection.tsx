"use client";
import React, { useState } from 'react';
import styles from '@/styles/RightSection.module.css';
import chatgptlogo2 from '@/assets/chatgptlogo2.png';
import nouserlogo from '@/assets/nouserlogo.png';
import Image from 'next/image';
import { HashLoader } from 'react-spinners';

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable.");
}

const RightSection = () => {
    const trainingPrompt = [
        {
            role: "user",
            parts: [{ text: "This is Introductory dialogue for any prompt : 'Hello, my dear friend, I am the CHATGPT Bot. Ask me anything regarding procurement, purchase, and logistics. I will be happy to help you.'"}]
        },
        {
            role: "model",
            parts: [{ text: "okay" }]
        },
        {
            role: "user",
            parts: [{ text: "Special Dialogue 1 : if any prompt mentions 'Shashi Shahi' word : 'Of course! Dr. Shashi Shahi is one of the prominent professors at UWindsor! He is an IIT-D alumni with years of invaluable experience and a fun way of engaging in lectures! Likes: Analytics and Research and Case Studies Dislikes: Students near riverside.'"}]
        },
        {
            role: "model",
            parts: [{ text: "okay" }]
        },
        {
            role: "user",
            parts: [{ text: "Special Dialogue 2 : Any prompt that mentions CHATGPT class / classroom A: 'The CHATGPT Batch of 2023 is by far the best the university has ever seen by all sets of standards. Students from different backgrounds come together to form a truly diverse and culturally rich classroom experience. I believe that all students are highly capable and will achieve great things in their professional career!'"}]
        },
        {
            role: "model",
            parts: [{ text: "okay" }]
        }
    ];

    const suggestions = [
        "Can you provide detailed instructions on the best brushing techniques to ensure optimal oral hygiene?",
        "What are the benefits of flossing daily, and how should I properly floss to maintain healthy gums?",
        "How does my diet impact my dental health? Could you suggest some foods that promote strong teeth and gums?",
        "What are some effective ways to prevent cavities in children, and how often should they visit the dentist?",
    ];

    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(true);
    const [allMessages, setAllMessages] = useState([]);

    const sendMessage = async (msg: string) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        const messagesToSend = [
            ...trainingPrompt,
            ...allMessages,
            {
                role: "user",
                parts: [{ text: msg }]
            }
        ];

        setIsSent(false);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "contents": messagesToSend })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const resjson = await res.json();
            console.log(resjson); // Log the response to debug

            const responseMessage = resjson.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";

            const newAllMessages = [
                ...allMessages,
                { role: "user", parts: [{ text: msg }] },
                { role: "model", parts: [{ text: responseMessage }] }
            ];

            setAllMessages(newAllMessages);
            setMessage('');
        } catch (error) {
            console.error("Error fetching the API:", error);
        } finally {
            setIsSent(true);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMessage(suggestion);
        sendMessage(suggestion);
    };

    return (
        <div className={styles.rightSection}>
            <div className={styles.rightin}>
                <div className={styles.header}>
                    <p className={styles.headerText}>Chat</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.headerIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {allMessages.length > 0 ? (
                    <div className={styles.messages}>
                        {allMessages.map((msg, index) => (
                            <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}>
                                <Image src={msg.role === 'user' ? nouserlogo : chatgptlogo2} width={50} height={50} alt="" />
                                <div className={styles.details}>
                                    <h2>{msg.role === 'user' ? 'You' : 'CHATGPT Bot'}</h2>
                                    <p>{msg.parts[0].text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.nochat}>
                        <div className={styles.nochatInner}>
                            <h1>How can I help you today?</h1>
                            <div className={styles.suggestions}>
                                {suggestions.map((suggestion, index) => (
                                    <div key={index} className={styles.suggestionCard} onClick={() => handleSuggestionClick(suggestion)}>
                                        <p>{suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.bottomSection}>
                    <div className={styles.messageBar}>
                        <input 
                            type='text' 
                            placeholder='Message CHATGPT Bot...'
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                        />
                        {isSent ? (
                            <svg onClick={() => sendMessage(message)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.sendIcon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                            </svg>
                        ) : (
                            <HashLoader color="#36d7b7" size={30} />
                        )}
                    </div>
                    <p className={styles.warningText}>CHATGPT BOT can make mistakes. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
}

export default RightSection;
