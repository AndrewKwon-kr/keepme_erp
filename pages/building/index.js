import Page from 'app/page';
import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Map from 'public/map.png';
import Image from 'next/image';
import { Button } from '@mui/material';

export default function Building() {
  useEffect(() => {
    console.log(process.env.NODE_ENV);
  }, []);
  return (
    <Page>
      <main className="min-h-screen w-full relative">
        <TransformWrapper initialScale={1} minScale={1} maxScale={10}>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <TransformComponent>
              <Button
                className="absolute top-5 left-5 bg-[#597FB1] py-4"
                variant="contained"
                color="primary"
                onClick={() => zoomIn()}>
                확대
              </Button>
              <Button
                className="absolute top-5 left-[100px] bg-[#597FB1] py-4"
                variant="contained"
                color="primary"
                onClick={() => zoomOut()}>
                축소
              </Button>
              <div
                className="w-5 h-5 absolute top-[580px] left-[420px] rounded-full bg-blue-500"
                onClick={() => console.log('!!')}></div>
              <div
                className="w-5 h-5 absolute top-[580px] bg-blue-500 left-[420px] rounded-full animate-ping"
                onClick={() => console.log('!!!')}></div>
              <div className="w-5 h-5 absolute top-[440px] left-[380px] rounded-full transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 animate-bounce"></div>
              <Image src={Map} alt="bg" />
            </TransformComponent>
          )}
        </TransformWrapper>
      </main>
    </Page>
  );
}
