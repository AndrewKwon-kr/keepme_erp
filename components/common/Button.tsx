import styled from "@emotion/styled";
import { Button } from "@mui/material";

export type ButtonType = {
  ver?: string
};

export const CancelButton = styled(Button)`
  background-color: #74788d !important;
  color: white !important;
`;

export const SaveButton = styled(Button)`
  background-color: #171C61 !important;
  color: white !important;
`;

export const KeepmeButton = styled(Button)<ButtonType>`
  background-color: ${props => props.disabled ? '#7679a8' : props.ver} !important;
  color: white !important;
`;
