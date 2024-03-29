import { useEffect } from 'react';
import Router from 'next/router';

const IndexPage = () => {
    useEffect(() => {
        Router.push('/api/auth');
    }, []);

    return (
        <div className='wrapper'>
            <div className='logo' />
            <label>Redirecting to authentication...</label>
        </div>
    );
};

export default IndexPage;
