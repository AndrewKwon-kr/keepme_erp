import React, { useEffect, useMemo, useState } from 'react';
import Loading from 'app/loading';
import WorkerSelectModal from './WorkerSelectModal';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { putDailyReportList } from 'api';
import moment from 'moment';

export default function ReportTable({
  data,
  isLoading,
  setData,
  startDate,
  agencyCode,
  manager,
  workers,
  getReportData,
  user,
  prevComment,
  setPrevComment,
  currComment,
  setCurrComment,
}: any) {
  const [enableEdit, setEnableEdit] = useState(false);
  const [saveData, setSaveData] = useState([]);
  const [isSelectModalToggle, setIsSelectModalToggle] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const totalList = [
    { label: '형틀목공', count: 10 },
    { label: '연수생', count: 10 },
    { label: '철근', count: 10 },
    { label: '비계', count: 10 },
    { label: '직원', count: 10 },
    { label: '일반', count: 10 },
    { label: '해체', count: 10 },
    { label: '정리', count: 10 },
    { label: '직영', count: 10 },
    { label: '건축', count: 10 },
    { label: '콘크리트', count: 10 },
  ];

  const onSave = async () => {
    if (window.confirm('저장하시겠습니까?')) {
      try {
        const response = await putDailyReportList({
          workDate: moment(startDate).format('YYYYMMDD'),
          agencyCode: agencyCode,
          beforeDayRemarks: prevComment,
          todayRemarks: currComment,
          empId: user.code,
          details: saveData.map((data) => {
            return {
              ...data,
              workDate: moment(startDate).format('YYYYMMDD'),
              agencyCode: agencyCode,
              empId: user.code,
            };
          }),
        });
        if (response.result_text == 'error') {
          setSaveData(data);
        } else {
          setData(saveData);
        }
        alert(response.result_text);
      } catch (error) {
        console.error(error);
      } finally {
        setEnableEdit(false);
        getReportData();
      }
    }
  };

  const onCancel = () => {
    if (window.confirm('작성하신 내용을 취소하시겠습니까?')) {
      setSaveData(data);
      setEnableEdit(false);
      getReportData();
    }
  };

  const onClickEdit = (title: string) => {
    setModalTitle(title);
    setIsSelectModalToggle(true);
  };

  useEffect(() => {
    if (data) {
      setSaveData(data);
    }
  }, [data]);

  // useEffect(() => {
  //   getReportData();
  // }, [isSelectModalToggle]);

  return (
    <div className="mt-10">
      {isLoading && <Loading />}
      <div className="flex h-10 border-t border-x border-[#DCDCDC] bg-white">
        <div className="min-w-[200px] border-r border-[#DCDCDC] flex items-center justify-center bg-[#F4F5F9] font-medium">
          본사담당
        </div>
        <div className="w-full flex items-center px-5 relative">
          {/* <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="border-0 ring-0 focus:ring-0 w-4/5"
          /> */}
          {manager.map((worker: any) => `${worker?.name} ${worker?.positionName}`).join(', ')}
          <div
            className="absolute right-5 w-12 h-6 rounded-2xl bg-black text-white text-xs flex items-center justify-center cursor-pointer"
            onClick={() => onClickEdit('본사담당')}>
            수정
          </div>
        </div>
      </div>
      <div className="flex h-10 border-t border-x border-[#DCDCDC] bg-white">
        <div className="min-w-[200px] border-r border-[#DCDCDC] flex items-center justify-center bg-[#F4F5F9] font-medium">
          직원
        </div>
        <div className="w-full flex items-center px-5 relative">
          {/* <input
            type="text"
            value={workers}
            onChange={(e) => setWorker(e.target.value)}
            className="border-0 ring-0 focus:ring-0 w-4/5"
          /> */}
          {workers.map((worker: any) => `${worker?.name} ${worker?.positionName}`).join(', ')}
          <div
            className="absolute right-5 w-12 h-6 rounded-2xl bg-black text-white text-xs flex items-center justify-center cursor-pointer"
            onClick={() => onClickEdit('직원')}>
            수정
          </div>
        </div>
      </div>

      <table className="table-fixed border border-[#DCDCDC] bg-white">
        <thead className="border border-[#DCDCDC] bg-[#F4F5F9]">
          <tr className="divide-x divide-[#DCDCDC] h-[60px]">
            <th className="min-w-[60px] font-medium">No.</th>
            <th className="min-w-[140px] font-medium">직종</th>
            <th className="min-w-[140px] font-medium">작업팀</th>
            <th className="w-[300px] border-0 p-0 grid grid-rows-2 h-full divide-y divide-[#DCDCDC] font-medium">
              <div className="h-[30px] flex items-center justify-center">인원</div>
              <div className="h-[30px] grid grid-cols-4 divide-x divide-[#DCDCDC] items-center justify-center">
                <div className="h-[30px] flex items-center justify-center">조출</div>
                <div className="h-[30px] flex items-center justify-center">일계</div>
                <div className="h-[30px] flex items-center justify-center">전야</div>
                <div className="h-[30px] flex items-center justify-center">월누계</div>
              </div>
            </th>
            <th className="w-[calc(100vw_-_640px)] font-medium relative">
              <div className={'font-semibold ' + (enableEdit && ' animate-bounce')}>작업내용</div>
              {enableEdit ? (
                <>
                  <div
                    className="absolute right-20 top-4 w-12 h-6 rounded-2xl bg-[#171C61] text-white text-xs flex items-center justify-center cursor-pointer"
                    onClick={() => onSave()}>
                    저장
                  </div>
                  <div
                    className="absolute right-5 top-4 w-12 h-6 rounded-2xl bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer"
                    onClick={() => onCancel()}>
                    취소
                  </div>
                </>
              ) : (
                <div
                  className="absolute right-5 top-4 w-12 h-6 rounded-2xl bg-black text-white text-xs flex items-center justify-center cursor-pointer"
                  onClick={() => setEnableEdit(true)}>
                  수정
                </div>
              )}
              {/* <div className="absolute right-5 top-4 w-12 h-6 rounded-2xl bg-black text-white text-xs flex items-center justify-center cursor-pointer">
                수정
              </div> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {saveData.map((row: any, index: number) => (
            <tr
              key={index}
              className="divide-x border-b box-content h-[30px] text-center items-center">
              <td>{row.no}</td>
              <td>{row.departmentName}</td>
              <td>{row.teamName}</td>
              <td className="p-0 h-[30px] grid grid-cols-4 divide-x divide-[#DCDCDC] items-center justify-center">
                <div className="h-[30px] flex items-center justify-center">{row.numberOfDays}</div>
                <div className="h-[30px] flex items-center justify-center">{row.numberOfDays}</div>
                <div className="h-[30px] flex items-center justify-center">{row.numberOfEve}</div>
                <div className="h-[30px] flex items-center justify-center">{row.numberOfMonth}</div>
              </td>
              <td className="text-start px-2">
                <input
                  type="text"
                  value={row.workDetail || ''}
                  disabled={!enableEdit}
                  onChange={(e) =>
                    setSaveData(
                      saveData.map((val: any, dataIndex: number) =>
                        index == dataIndex ? { ...val, workDetail: e.target.value } : val,
                      ),
                    )
                  }
                  className="border-0 ring-0 focus:ring-0 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex h-10 border-[#DCDCDC] border bg-white">
        <div className="min-w-[341px] border-r border-[#DCDCDC] flex items-center justify-center font-semibold">
          합계
        </div>
        <div className="w-[300px] grid grid-cols-4 items-center justify-center font-semibold">
          <div className="h-10 flex items-center justify-center border-r border-[#DCDCDC]">
            {data
              .map((row: any) => row.numberOfDays)
              .reduce((prev: any, curr: any) => prev + curr, 0)}
          </div>
          <div className="h-10 flex items-center justify-center border-r border-[#DCDCDC]">
            {data
              .map((row: any) => row.numberOfDays)
              .reduce((prev: any, curr: any) => prev + curr, 0)}
          </div>
          <div className="h-10 flex items-center justify-center border-r border-[#DCDCDC]">
            {data
              .map((row: any) => row.numberOfEve)
              .reduce((prev: any, curr: any) => prev + curr, 0)}
          </div>
          <div className="h-10 flex items-center justify-center border-r border-[#DCDCDC]">
            {data
              .map((row: any) => row.numberOfMonth)
              .reduce((prev: any, curr: any) => prev + curr, 0)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center border-[#DCDCDC] border bg-white ">
        <div className="min-w-[341px] flex items-center justify-center font-semibold">인원집계</div>
        <div className="w-full grid grid-cols-4">
          {totalList.map((total, index) => (
            <div key={index} className="grid grid-cols-2 divide-x h-10 border-[0.5px]">
              <div className="grow flex px-4 py-2 justify-center">{total.label}</div>
              <div className="grow flex px-4 py-2 justify-center">{total.count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-x-7">
        <div className="flex flex-col border border-[#DCDCDC] bg-white">
          <div className="h-10 flex items-center justify-center font-semibold text-sm bg-[#F7F7F7]">
            <span className={enableEdit ? ' animate-bounce' : ''}>전일 특기사항</span>
          </div>
          <div className="border-t bg-white p-5 w-full">
            <BaseTextareaAutosize
              aria-label="minimum height"
              disabled={!enableEdit}
              minRows={3}
              value={prevComment ?? ''}
              onChange={(e) => setPrevComment(e.target.value)}
              className="border-0 ring-0 focus:ring-0 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col border border-[#DCDCDC] bg-white">
          <div className="h-10 flex items-center justify-center font-semibold text-sm bg-[#F7F7F7]">
            <span className={enableEdit ? ' animate-bounce' : ''}>금일 특기사항</span>
          </div>
          <div className="border-t bg-white p-5 w-full">
            <BaseTextareaAutosize
              aria-label="minimum height"
              disabled={!enableEdit}
              minRows={3}
              value={currComment ?? ''}
              onChange={(e) => setCurrComment(e.target.value)}
              className="border-0 ring-0 focus:ring-0 w-full"
            />
          </div>
        </div>
      </div>
      <WorkerSelectModal
        open={isSelectModalToggle}
        toggle={() => setIsSelectModalToggle(false)}
        modalTitle={modalTitle}
        startDate={startDate}
        agencyCode={agencyCode}
        workers={modalTitle == '본사담당' ? manager : workers}
        getReportData={() => getReportData()}
      />
    </div>
  );
}
