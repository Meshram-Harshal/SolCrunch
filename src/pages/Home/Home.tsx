import React, { useState } from 'react';
import FastMarquee from 'react-fast-marquee'; // Import FastMarquee
import { motion } from 'framer-motion'; // Import Framer Motion
import { FaCompressArrowsAlt } from "react-icons/fa";
import { MdOutlineCalculate } from "react-icons/md";
import { SiLinuxmint } from "react-icons/si";
import { IoSwapVerticalOutline } from "react-icons/io5";
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import './Home.css';

const Home: React.FC = () => {
    // State to manage opened FAQ
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    // Sample FAQs
    const faqs = [
        {
            question: "What is a Multi-Swap DEX?",
            answer: "A Multi-Swap DEX allows users to swap tokens across different liquidity pools seamlessly, maximizing trading efficiency."
        },
        {
            question: "How does MEV protection work?",
            answer: "MEV protection ensures that your trades are executed fairly without front-running or sandwich attacks by bots."
        },
        {
            question: "What tokens can I swap?",
            answer: "You can swap a variety of SPL tokens on our platform, including popular tokens like SOL, USDC, and more."
        },
        {
            question: "Is there a fee for using the DEX?",
            answer: "Yes, there is a small fee for each trade to support the platform and maintain liquidity."
        },
        {
            question: "How can I provide liquidity?",
            answer: "You can provide liquidity by depositing your tokens into our liquidity pools. In return, you earn a share of the trading fees."
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index); // Toggle the FAQ
    };

    return (
        <div className='outer-home'>
            <div className="home-container">
                <div className="home-content">
                    <h1 className="h1-home">The Multi-Swap DEX is Here</h1>
                    <p className="p-home">
                        Power Your Trades with Solana's First Multi-Swap DEX. Effortless token swaps with MEV protection.
                    </p>
                    <button className="swap-button">Explore</button>
                </div>
                <img
                    src="/logo.png"
                    alt="Solana Token Compression"
                    className="crypto-illustration"
                />
            </div>

            <div className="logo-slider">
                <FastMarquee direction="left" speed={50} loop={0} autoFill continuous className='grid'>
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
                    <div className="logo-item">
                        <img src="/logo.png" alt="Mango Markets Logo" />
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
                        <p>Best Price and Route for swapping</p>
                    </motion.div>
                    <motion.div className="card" whileHover={{ scale: 1.05 }}>
                        <IoSwapVerticalOutline className="icon" />
                        <h3>Crunchy Swap</h3>
                        <p>Compress and Decompress while buying or selling the tokens</p>
                    </motion.div>
                    <motion.div className="card" whileHover={{ scale: 1.05 }}>
                        <MdOutlineCalculate className="icon" />
                        <h3>Rent Calculator</h3>
                        <p>All transactions are distributed over the network</p>
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
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="/logo.png" alt="Logo" />
                    </div>
                    <div className="footer-text">
                        <p>Your description or tagline here.</p>
                    </div>
                    <div className="footer-socials">
                        <a href="https://twitter.com/" className="footer-icon">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://facebook.com/" className="footer-icon">
                            <i className="fab fa-facebook"></i>
                        </a>
                        {/* Add more social icons as needed */}
                    </div>
                </div>
                <div className="footer-links">
                    <h4>Useful Links</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        {/* Add more links as needed */}
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Useful Links</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        {/* Add more links as needed */}
                    </ul>
                    <div className="footer-policies">
                        <a href="#terms">Terms of Service</a>
                        <span>|</span>
                        <a href="#privacy">Privacy Policy</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default Home;
