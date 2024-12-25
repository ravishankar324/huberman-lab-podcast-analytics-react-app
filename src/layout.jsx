import React from 'react';
import './globals.css'; // Import global styles

export default function Layout({ children }) {
  return (
    <div className="app-container">
      {children}
    </div>
  );
}
