import React from 'react';

const NotificationSettings = ({ notifications, onToggle }) => {
    return (
        <div className="settings-section">
            <h2>Notificações</h2>
            <div className="settings-content">
                <div className="setting-item">
                    <span>Ativar Notificações de Estoque</span>
                    <div className="toggle-wrapper">
                        <input
                            type="checkbox"
                            id="notifications"
                            className="toggle"
                            checked={notifications}
                            onChange={onToggle}
                        />
                        <label htmlFor="notifications" className="toggle-label"></label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;