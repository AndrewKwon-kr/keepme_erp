import { Modal } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

export default function WorkerStatusModal({ open, setOpen, data }: any) {
  const handleClose = () => {
    setOpen(false);
  };
  console.log(data);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      disableAutoFocus={true}>
      <div
        className="absolute top-1/2 left-1/2 w-[460px] h-[720px] rounded-md bg-white p-5 flex flex-col"
        style={{ transform: 'translate(-50%, -50%)' }}>
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">근로자 정보</div>
          <IconButton className="p-0" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="py-5">
          <div className="flex items-center justify-center">
            {data.imageUrl ? <img src={data.imageUrl} /> : <img src="/images/image_avatar.svg" />}
          </div>
          <div className="mt-10 flex flex-col">
            <div className="text-lg font-bold mb-3">{data.userName}</div>
            <div className="text-sm">
              <b>소속기업&nbsp;</b>
              {data.agency}
            </div>
            <div className="text-sm">
              <b>부서&nbsp;</b>
              {data.department}
            </div>
          </div>
        </div>
      </div>
      {/* <Box sx={{ ...style, width: 400 }}>
        <h2 id="child-modal-title">Text in a child modal</h2>
        <p id="child-modal-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </p>
        <Button onClick={handleClose}>Close Child Modal</Button>
      </Box> */}
    </Modal>
  );
}
