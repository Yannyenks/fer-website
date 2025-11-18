import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const VoteLoginButton: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      // go to candidates / voting page
      navigate('/concours/candidates');
    } else {
      navigate('/login');
    }
  };

  const title = user ? `Connecté: ${user.name} — Voter` : 'Se connecter / Voter';

  return (
    <button
      aria-label={title}
      title={title}
      onClick={handleClick}
      className="vote-login-button"
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        width: 56,
        height: 56,
        borderRadius: 9999,
        background: user ? '#10b981' : '#2563eb',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(16,24,40,0.2)',
        zIndex: 60,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Icon: user + ballot */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor" opacity="0.95" />
        <path d="M2 20a10 10 0 0 1 20 0v1H2v-1z" fill="currentColor" opacity="0.85" />
        <path d="M17 9l3 3-7 7-7-7 3-3 4 4 4-4z" fill="white" opacity="0.9" />
      </svg>
    </button>
  );
};

export default VoteLoginButton;
