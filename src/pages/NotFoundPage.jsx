import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="cont df" style={{ flexDirection: 'column', alignItems: 'center', paddingTop: '100px', minHeight: '50vh' }}>
            <h1 className="gradient-underline" style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
            <p style={{ color: '#fff', fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '30px' }}>Страница не найдена</p>
            <Link to="/" className="btn-open" style={{ textDecoration: 'none' }}>Вернуться на главную</Link>
        </div>
    );
}