import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import Image from 'next/image';
import defaultImage from 'public/images/icon-user-circle.svg';
import { ResFieldWorkerList } from 'interface/response';
import CloseIcon from '@mui/icons-material/Close';
import PreiodicalUserVitalSign from 'components/Safe/Worker/PeriodicalUserVitalSign';

interface ModalProps {
  open: boolean;
  toggle: any;
  worker: ResFieldWorkerList;
}

const WorkerStatusModal = (props: ModalProps) => {
  const { open, toggle, worker } = props;

  var userImage =
    worker.picture !== null
      ? worker.picture !== ''
        ? worker.picture
        : defaultImage
      : defaultImage;

  return (
    <Dialog open={open} onClose={toggle} maxWidth="lg">
      <DialogTitle sx={{ m: 0, p: 2 }}>근로자 정보</DialogTitle>
      <IconButton
        onClick={toggle}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <UserInfo>
          <Image
            src={userImage}
            className="img-circle d-block"
            alt="worker image"
            width={145}
            height={145}
            style={{ borderRadius: '50%', marginTop: '20px' }}
          />
          <div className="info">
            <h5>{worker.name}</h5>
            <p>
              소속기업 <span>{worker.companyName}</span>
            </p>
            <p>
              지역 <span>{worker.agencyParentName}</span>
            </p>
            <p>
              투입현장 <span>{worker.agencyName}</span>
            </p>
            <p>
              입사일 <span>{worker.startDate}</span>
            </p>
          </div>
        </UserInfo>
        <PreiodicalUserVitalSign userId={worker.userCode} />
      </DialogContent>
    </Dialog>
  );
};

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  .info {
    margin-top: 10px;
    h5 {
      font-weight: bold;
      text-align: center;
    }
    p {
      font-weight: 600;
      margin-left: 10px;
    }
    span {
      font-weight: 500;
      margin-left: 10px;
    }
  }
`;

export default WorkerStatusModal;
