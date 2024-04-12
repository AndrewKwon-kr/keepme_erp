import { ReactNode } from "react";

interface Props {
  children: ReactNode;
};

export const PageTitle = ({ children }: Props) => {
  return <div className="mb-5 text-lg font-semibold">{children}</div>
};