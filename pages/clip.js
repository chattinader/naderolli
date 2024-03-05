/* eslint-disable @next/next/no-img-element */
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import '../style.css';
import { useEffect, useRef, useState } from 'react';

export async function getServerSideProps({ query }) {
    const { id } = query;
    const videosFilePath = path.join(process.cwd(), 'videos.json');
    const videosData = JSON.parse(fs.readFileSync(videosFilePath, 'utf8'));
    const video = videosData.find((v) => v.uuid === id);

    if (!video) {
        return { notFound: true };
    }

    return { props: { video } };
}

export default function Clip({ video }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <>
            <Head>
                <title>{video.name}</title>
                <meta name="description" content={`Watch the video: ${video.name}`} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="video.movie" />
                <meta property="og:url" content={`http://yourdomain.com/clip?id=${video.uuid}`} />
                <meta property="og:title" content={video.name} />
                <meta property="og:description" content={`Watch the video: ${video.name}`} />
                <meta property="og:image" content={video.thumbnailUrl} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`http://yourdomain.com/clip?id=${video.uuid}`} />
                <meta property="twitter:title" content={video.name} />
                <meta property="twitter:description" content={`Watch the video: ${video.name}`} />
                <meta property="twitter:image" content={video.thumbnailUrl} />

                {/* Additional tags for video if necessary */}
                <meta property="og:video" content={video.downloadUrl} />
                <meta property="og:video:width" content="1280" />
                <meta property="og:video:height" content="720" />
            </Head>
            <div className='wrapper'>
                <div className='logo' />
                <div className='video-wrapper'>
                    <img src='/CamOverlayRect.png' className='overlay' alt="Overlay" />
                    <div className='videoContainer' onClick={() => setIsPlaying(true)} onDoubleClick={() => toggleFullScreen()}>
                        <video
                            className='videoPlayer'
                            // controls
                            // autoPlay
                            src={video.downloadUrl}
                            ref={videoRef}
                        />
                    </div>
                    <button className='play-button' onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying) toggleFullScreen(); }}>
                        {isPlaying ?
                            <img src='/pause.svg' className='pause' alt="pause" style={{ width: '2rem' }} />
                            :
                            <img src='/play.svg' className='play' alt="play" style={{ width: '2rem' }} />
                        }
                    </button>
                </div>
            </div>
        </>
    );
}