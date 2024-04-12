import { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { PageTitle } from "components/common/Text";
import Image from "next/image";
import { SettingCard } from "../common/Card";

const AgencyPicture = () => {
  return (
    <SettingCard>
      <div className="min-h-[698px]">
        <div className="flex justify-between items-start">
          <PageTitle>현장 사진</PageTitle>
          <Button size="small" variant="contained" type="button" style={{background:'#74788d'}}>추가</Button>
        </div>
        <div className="flex justify-center">
          <Image 
            src=''
            alt="agency image"
          />
        </div>
      </div>
    </SettingCard>
  )
};


export default AgencyPicture;