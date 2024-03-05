import { useState, useEffect } from 'react';
import Router from 'next/router';
import '@/style.css';

const CallbackPage = () => {
    const [videoName, setVideoName] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) {
            return;
        }

        fetch(`/api/token?code=${code}`)
            .then((response) => response.json())
            .then((data) => setAccessToken(data.accessToken));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoName || !accessToken) return;

        const fetchResponse = await fetch(`/api/get-video?name=${encodeURIComponent(videoName)}&token=${accessToken}`);
        const videoData = await fetchResponse.json();

        if (videoData.uuid) {
            Router.push(`/clip?id=${videoData.uuid}`);
        }
    };

    return (
        <div className='wrapper'>
            <div className='logo' />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={videoName}
                    onChange={(e) => setVideoName(e.target.value)}
                    placeholder="Video Name"
                    required
                />
                <button type="submit" className='button'>Fetch Video</button>
            </form>
        </div>
    );
};

export default CallbackPage;
