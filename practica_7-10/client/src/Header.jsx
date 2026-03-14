import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";
import Registration from './RegistrPage';
import Login from './LoginPage';

function Header() {
    const {user, logout} = useAuth();
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return(
        <header style={{margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={{marginLeft: '0.1rem'}}>Electronics Store</h1>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                {user ? (
                    <div style={{position: 'relative'}}>
                        <button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer'
                            }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#007bff',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                            >
                                {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                            </div>
                        </button>
                        {isProfileMenuOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '60px',
                                    right: 0,
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    minWidth: '180px',
                                    zIndex: 1000
                                }}
                            >
                                <Link
                                    to='/profile'
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '0.8rem 1.2rem',
                                        textDecoration: 'none',
                                        color: '#333',
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    Профиль
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsProfileMenuOpen(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1.2rem',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        color: '#dc3545',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Выйти
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button onClick={() => setIsRegisterOpen(true)} style={{flex: 1, padding: '0.8rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor:'pointer'}}>Регистрация</button>
                        <button onClick={() => setIsLoginOpen(true)} style={{ marginRight: '0.3rem',flex: 1, padding: '0.8rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Вход</button>
                    </>
                )}
            </div>
            <Registration isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}/>
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}/>
        </header>
    );
}

export default Header;