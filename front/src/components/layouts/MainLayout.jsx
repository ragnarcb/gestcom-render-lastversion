// src/components/MainLayout.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SideBar from "../sidebar/SideBar"
import { useLocation } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="main-layout">
            <SideBar />
            <div className="main-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        className="motion-container"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MainLayout;