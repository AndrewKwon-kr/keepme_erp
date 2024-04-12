"use client"

import { Card } from "@mui/material";
import AgencyPicture from "components/Safe/Setting/AgencyPicture";
import AgencySetting from "components/Safe/Setting/AgencySetting";
import DeviceSetting from "components/Safe/Setting/DeviceSetting";

const Setting = () => {
  return (
    <main className="p-10 w-full flex max-2xl:flex-col max-2xl:pb-10 gap-10">
      <section className="w-full">
        <AgencyPicture />
      </section>
      <section className="w-full">
        <AgencySetting />
      </section>
      <section className="w-full">
        <DeviceSetting />
      </section>
    </main>
  )
};

export default Setting;