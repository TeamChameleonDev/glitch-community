import React, { useEffect, forwardRef } from 'react';

const loadedScripts = new Set();
function loadScript(src) {
  if (!loadedScripts.has(src)) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
    loadedScripts.add(src);
  }
}

const WistiaVideo = forwardRef(({ videoId }, ref) => {
  useEffect(() => {
    loadScript(`//fast.wistia.com/embed/medias/${videoId}.jsonp`);
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }, []);
  return (
    <div ref={ref} className="wistia_responsive_padding">
      <div className="wistia_responsive_wrapper">
        <div className={`wistia_embed wistia_async_${videoId}`} videofoam="true" />
      </div>
    </div>
  );
});

export default WistiaVideo;
