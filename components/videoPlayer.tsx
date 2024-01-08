"use client";

import {useEffect, useRef} from 'react';
import Hls from 'hls.js';
import {Options} from 'plyr';
import 'plyr/dist/plyr.css';

export default function VideoPlayer(props: { src: string, className: string, postImage: string, referer?: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const Plyr = require('plyr');

        const video = videoRef.current;
        if (!video) return;

        video.controls = true;
        const defaultOptions: Plyr.Options = {
            controls: [
                'play-large',
                'play',
                'rewind',
                'fast-forward',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'captions',
                'settings',
                'pip',
                'airplay',
                'fullscreen'
            ],
            seekTime: 10,
            keyboard: {
                focused: true,
                global: true,
            }
        };
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // This will run in safari, where HLS is supported natively
            video.src = props.src;
        } else if (Hls.isSupported()) {
            // This will run in all other modern browsers

            const hls = new Hls({
                xhrSetup: (xhr, url) => {
                    if (props.referer)
                        xhr.setRequestHeader('Referer', props.referer)
                }
            });
            hls.loadSource(props.src);
            const player = new Plyr(video, defaultOptions);
            hls.attachMedia(video);
        } else {
            console.error(
                'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API'
            );
        }
    }, [props.src, videoRef]);

    return (
        <video data-poster={props.postImage} data-displaymaxtap ref={videoRef} className={props.className}/>
    );
}
