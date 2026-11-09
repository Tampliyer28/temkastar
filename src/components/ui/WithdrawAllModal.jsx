import { useState, useEffect } from 'react';

const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');

export function WithdrawAllModal({ open, onClose, totalPrice, onWithdrawAll }) {
    const [recipient, setRecipient] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setRecipient('');
        setLoading(false);
    }, [open]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!recipient) return alert('Укажите получателя');

        setLoading(true);
        // Имитация запроса
        setTimeout(() => {
            if (onWithdrawAll) onWithdrawAll(recipient);
            alert(`Все подарки выведены на сумму ${fmt(totalPrice)} ₽`);
            setLoading(false);
            onClose();
        }, 300);
    };

    return (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-box df" style={{ maxWidth: '400px' }}>
                <h2>Вывод всего инвентаря</h2>
                <p style={{ color: 'var(--color-6)', textAlign: 'center', marginBottom: '20px', fontFamily: 'Montserrat' }}>
                    Вы собираетесь вывести все подарки на общую сумму <br/>
                    <strong style={{ color: '#3292FF', fontSize: '20px' }}>{fmt(totalPrice)} ₽</strong>
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label className="df" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="title-lk" style={{ marginBottom: '5px' }}>Получатель (TG)</span>
                        <input 
                            className="inp-form" 
                            type="text" 
                            value={recipient} 
                            onChange={(e) => setRecipient(e.target.value)} 
                            placeholder="@username" 
                            style={{ width: '100%' }} 
                        />
                    </label>
                    <div className="df" style={{ gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="export-btn" style={{ flex: 1, borderRadius: '10px', padding: '12px' }} disabled={loading}>
                            {loading ? 'Вывод...' : 'Вывести всё'}
                        </button>
                        <button type="button" className="sell-btn" style={{ flex: 1, borderRadius: '10px', padding: '12px', background: 'var(--color-9)' }} onClick={onClose} disabled={loading}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}