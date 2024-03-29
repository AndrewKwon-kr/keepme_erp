import React, { useEffect, useState } from 'react';
import moment from 'moment';

export function KakaoMap(probs) {
  const { latitude, longitude, workerList } = probs;
  const now = moment();

  useEffect(() => {
    const script = document.createElement('script');

    script.async = true;

    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=acfac8870c9ee540051e906a9cf6f4d4&libraries=services,clusterer&autoload=false';

    document.head.appendChild(script);

    script.addEventListener('load', () => {
      if (latitude != null && longitude != null)
        new kakao.maps.load(() => {
          const container = document.getElementById('map');

          const options = {
            center: new kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };
          const positions = workerList.map((worker) => {
            return {
              title: worker.name,
              latlng: new kakao.maps.LatLng(worker.latitude, worker.longitude),
              content: `
                <div style="text-align: center; width: 180px; font-size: 14px; padding: 4px; background-color: black; color: white;">
                  <div>${worker.agencyname} - ${worker.departmentName}</div>
                  <div style="font-size: 14px; font-weight: bold;">${worker.name}</div>
                  <div style="font-size: 12px; color: gray;">${now.format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}</div>
                  <div>${worker.state}&nbsp;&nbsp;${worker.temperature}°C&nbsp;&nbsp;${
                    worker.heartbeat
                  }회</div>
                </div>
                `,
            };
          });

          // 마커 이미지의 이미지 주소입니다
          var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

          var map = new kakao.maps.Map(container, options);

          for (var i = 0; i < workerList.length; i++) {
            // 마커 이미지의 이미지 크기 입니다
            var imageSize = new kakao.maps.Size(24, 35);

            // 마커 이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
              map: map, // 마커를 표시할 지도
              position: positions[i]?.latlng, // 마커의 위치
              image: markerImage, // 마커 이미지
            });

            // 마커에 표시할 인포윈도우를 생성합니다
            var infowindow = new kakao.maps.InfoWindow({
              content: positions[i]?.content, // 인포윈도우에 표시할 내용
            });

            // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
            // 이벤트 리스너로는 클로저를 만들어 등록합니다
            // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
            kakao.maps.event.addListener(
              marker,
              'mouseover',
              makeOverListener(map, marker, infowindow),
            );
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
          }

          // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
          function makeOverListener(map, marker, infowindow) {
            return function () {
              infowindow.open(map, marker);
            };
          }

          // 인포윈도우를 닫는 클로저를 만드는 함수입니다
          function makeOutListener(infowindow) {
            return function () {
              infowindow.close();
            };
          }

          // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
          kakao.maps.event.addListener(map, 'dragend', function () {
            // 지도 중심좌표를 얻어옵니다
            var latlng = map.getCenter();

            var message = '변경된 지도 중심좌표는 ' + latlng.getLat() + ' 이고, ';
            message += '경도는 ' + latlng.getLng() + ' 입니다';

            console.log(message);
          });
        });
    });
  }, [latitude, longitude, workerList]);

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
}
