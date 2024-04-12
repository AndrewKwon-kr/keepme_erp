import { Card } from "@mui/material";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import defultIamge from 'public/images/icon-user-circle.svg'

interface DashboardCardProps {
  children: ReactNode;
  image: any;
  count: number;
};

interface SettingCardProps {
  children: ReactNode
};

export const ColorCard = (props: DashboardCardProps) => {
  const { children, image, count } = props;
  const [img, setImg] = useState(defultIamge);

  useEffect(() => {
    setImg(image);
  },[]);

  return (
    <Card className="h-[113px] rounded-2xl px-7 py-7 bg-danger text-white">
      <div className="flex justify-start gap-5">
        <Image
          src={img}
          alt='card-icon'
          width={40}
          height={40} 
        />
        <div>
          <div className="text-base">{children}</div>
          <div className="text-xl font-semibold">{count === undefined ? 0 : count} 명</div>
        </div>
      </div>
    </Card>
  )
};

export const BorderCard = (props: DashboardCardProps) => {
  const { children, image, count } = props;
  const [img, setImg] = useState(defultIamge);

  useEffect(() => {
    setImg(image);
  },[]);

  return (
    <Card className="h-[113px] rounded-2xl px-7 py-7 border border-danger">
      <div className="flex justify-start gap-5">
        <Image
          src={img}
          alt='card-icon'
          width={40}
          height={40} 
        />
        <div>
          <div className="text-base text-slate-400">{children}</div>
          <div className="text-xl font-semibold text-danger">{count === undefined ? 0 : count} 명</div>
        </div>
      </div>
    </Card>
  )
};

export const WhiteCard = (props: DashboardCardProps) => {
  const { children, image, count } = props;
  const [img, setImg] = useState(defultIamge);

  useEffect(() => {
    setImg(image);
  },[]);
  
  return (
    <Card className="h-[113px] rounded-2xl px-7 py-7">
      <div className="flex justify-start gap-5">
        <Image
          src={img}
          alt='card-icon'
          width={40}
          height={40} 
        />
        <div>
          <div className="text-base text-slate-400">{children}</div>
          <div className="text-xl font-semibold text-navy">{count === undefined ? 0 : count} 명</div>
        </div>
      </div>
    </Card>
  )
};

export const SettingCard = (props: SettingCardProps) => {
  const { children } = props;

  return (
    <Card className="p-7">
      {children}
    </Card>
  )
};