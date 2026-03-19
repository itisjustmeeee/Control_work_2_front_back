import React, {useState, useEffect} from 'react';
import { useAuth } from './context/AuthContext';

function UserCard({ user, currentUser, onToggleBlock }) {
    const isSelf = currentUser && user.id === currentUser.id;

    return (
        <div 
            style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '2rem',
                margin: '0.8rem auto',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        >
            <h4>{user.id}</h4>

            <h3>
                {user.first_name} {user.last_name}
            </h3>

            <p><b>Email: </b>{user.email}</p>
            <p><b>Роль: </b>{user.role}</p>

            <p>
                <b>Статус: </b>
                <span style={{color: user.blocked ? 'red' : 'green', fontWeight: 'bold'}}>
                    {user.blocked ? 'Заблокирован' : 'Активен'}
                </span>
            </p>

            {currentUser?.role === 'admin' && !isSelf && (
                <button
                    onClick={() => onToggleBlock(user)}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: user.blocked ? '#35c928' : '#e02d2d',
                        color: 'white'
                    }}
                >
                    {user.blocked ? 'Разблокировать' : 'Заблокировать'}
                </button>
            )}
        </div>
    );
}

export default UserCard;