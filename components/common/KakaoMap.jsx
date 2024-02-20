import React, { useEffect, useState } from 'react';

export function KakaoMap(probs) {
  useEffect(() => {
    const script = document.createElement('script');

    script.async = true;

    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=acfac8870c9ee540051e906a9cf6f4d4&libraries=services,clusterer&autoload=false';

    document.head.appendChild(script);

    script.addEventListener('load', () => {
      if (probs.latitude != null && probs.longitude != null)
        new kakao.maps.load(() => {
          const container = document.getElementById('map');

          const options = {
            center: new kakao.maps.LatLng(probs.latitude, probs.longitude),
            level: 3,
          };

          new kakao.maps.Map(container, options);
        });
    });
  }, [probs.latitude, probs.longitude]);

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
}
