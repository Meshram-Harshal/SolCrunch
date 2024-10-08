import React, { useState } from 'react';
import FastMarquee from 'react-fast-marquee'; // Import FastMarquee
import { motion } from 'framer-motion'; // Import Framer Motion
import { FaCompressArrowsAlt } from "react-icons/fa";
import { MdOutlineCalculate } from "react-icons/md";
import { SiLinuxmint } from "react-icons/si";
import { FaTwitter} from 'react-icons/fa';
import './Home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    // State to manage opened FAQ
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    // Sample FAQs
    const faqs = [
        {
            question: "How is rent saved?",
            answer: "Instead of storing onchain we are storing your account in solana ledger."
        },
        {
            question: "Are my funds saved?",
            answer: "Your funds are SAFU.Even with the technology of ZKSNARKS your funds are safe."
        },
        {
            question: "How many rent i can save?",
            answer: "You will be saving ~0.002 per token compressed."
        },
        {
            question: "What services are currently available?",
            answer: "Currently we are providing Compression/Decompression,compressed token minting and Calculate your rent."
        },
        
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index); // Toggle the FAQ
    };

    return (
        <div className='outer-home'>
            <div className="home-container">
                <div className="home-content">
                    <h1 className="h1-home">The All-in-One ZKcompression is Here</h1>
                    <p className="p-home">
                        Save rent on solana by reclaiming rent exempt
                    </p>
                    <Link to="/Compression-Decompression"><button className="swap-button">Explore</button></Link>
                </div>
                <img
                    src="/logo_main.png"
                    alt="Solana Token Compression"
                    className="crypto-illustration"
                />
            </div>

            <div className="logo-slider">
                <FastMarquee direction="left" speed={50} loop={0} autoFill className='grid'>
                    <div className="logo-item">
                        <img src="/1.png" alt="Raydium Logo" />
                    </div>
                    <div className="logo-item">
                        <img src="/2.png" alt="Serum Logo" />
                    </div>
                    <div className="logo-item">
                        <img src="/3.png" alt="Mango Markets Logo" />
                    </div>
                    <div className="logo-item">
                        <img src="/4.png" alt="Mango Markets Logo" />
                    </div>
                </FastMarquee>
            </div>

            {/* New Section: Why Use Our Product? */}
            <div className="why-use-section">
                <h2 style={{ marginBottom: '8rem' }} className="section-title">Why Use Our Product?</h2>
                <div className="cards-container">
                    <motion.div className="card" whileHover={{ scale: 1.05 }}>
                        <FaCompressArrowsAlt className="icon" />
                        <h3 style={{ marginLeft: '-1.5rem' }}>Compress/Decompress</h3>
                        <p>Compress and Decompress you SPL token</p>
                    </motion.div>
                    <motion.div className="card" whileHover={{ scale: 1.05 }}>
                        <SiLinuxmint className="icon" />
                        <h3>Minting Forge</h3>
                        <p>Directly Mint Compressed Tokens</p>
                    </motion.div>
                    {/* <motion.div className="card" whileHover={{ scale: 1.05 }}>
                        <IoSwapVerticalOutline className="icon" />
                        <h3>Crunchy Swap</h3>
                        <p>Swap Compressed tokens</p>
                    </motion.div> */}
                    <motion.div className="card" whileHover={{ scale: 1.05 }}>
                        <MdOutlineCalculate className="icon" />
                        <h3>Rent Calculator</h3>
                        <p>Calculate your rent</p>
                    </motion.div>
                </div>
            </div>

            {/* New FAQ Section */}
            <div className="faq-section">
                <h2 className="section-title">FAQ</h2>
                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`faq-item ${openFAQ === index ? 'active' : ''}`}>
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                <h3>{faq.question}</h3>
                                <span>{openFAQ === index ? '-' : '+'}</span>
                            </div>
                            {openFAQ === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>About Us</h3>
                    <p>
                    SolCrunch provides a scalable solution for Solana by minimizing rent-exempt requirements and offering advanced zk-compression technology for token compression and decompression.</p>
                </div>
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        {/* <li><a href="https://x.com/SolCrunch">Docs</a></li> */}
                        <li><a href="/tx">Transactions</a></li>
                        <li><a href="/Compression-Decompression">Compression/Decompression</a></li>
                        <li><a href="/Minting-Forge">Minting Forge</a></li>
                        <li><a href="/rent">Calculate your rent</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://x.com/SolCrunch" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                    </div>
                </div>
            </div>
            <hr />
            <div className="footer-bottom">
                <p>&copy; 2024 ZKcompression. All rights reserved.</p>
            </div>
        </footer>
        </div>
    );
};

export default Home;
