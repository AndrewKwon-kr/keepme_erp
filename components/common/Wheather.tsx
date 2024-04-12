import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, CardBody, Card } from 'reactstrap';
import moment from 'moment';
import axios from 'axios';
import Image from 'next/image';
import styled from '@emotion/styled';
import { getData } from 'api';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
// import { GET_WEATHER_WARNING } from '@/src/constants/ApiUri';
// import { Popover } from 'devextreme-react';

type WarningData = {
  warning: string;
  level: string;
};

export const GET_WEATHER_WARNING = 'https://inconus.co.kr/api/weather';
export const WEATHER_API_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
export const WEATHER_SERVICE_KEY =
  '7IVauFN%2B1DkYSw0itmlCRa2wj0t3SbBm0FZN14GvvrCxwv9jzO%2BTJ4cd3B75ejI9dipEbaRDb0e5Avw0kTt9Mg%3D%3D';

const WeatherIcon = ({ iconCode, size }: { iconCode: string; size: number }) => {
  const iconSrc = `/weather/${iconCode}.png`;

  return (
    <div>
      <Image
        loader={({ src }) => `${src}`}
        src={iconSrc}
        alt="날씨"
        width={size}
        height={size}
        unoptimized={true}
        priority={true}
      />
    </div>
  );
};

const SKY_CODE_VALUE = [
  { text: '', icon: 'unknown' },
  { text: '맑음', icon: '01d' },
  { text: '', icon: 'unknown' },
  { text: '구름많음', icon: '12d' },
  { text: '흐림', icon: '04d' },
];

const PTY_CODE_VALUE = [
  { text: '없음', icon: 'unknown' },
  { text: '비', icon: '10d' },
  { text: '비/눈', icon: '15d' },
  { text: '눈', icon: '13n' },
  { text: '소나기', icon: '16d' },
  { text: '빗방울', icon: '09d' },
  { text: '빗방울눈날림', icon: '14d' },
  { text: '눈날림', icon: '13d' },
];

/**
 *  기상청 단기예보조회/ 3시간 간격으로 업데이트됨
  Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
  API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
 */
const getWeatherData = async (position: any, today: string) => {
  const serviceKey = WEATHER_SERVICE_KEY;
  const numOfRows = 1000;
  const pageNo = 1;
  const dataType = 'JSON';
  const base_date = today;
  const base_time = '0200'; //최저기온 받으려면 02시
  const nx = 55;
  const ny = 127;

  // 날씨는 기본 axios로 처리
  return await axios.get(
    `${WEATHER_API_URL}/getVilageFcst?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`,
  );
};

/*, time*
 * 기상청 초단기예보
  매시간 30분에 생성되고 10분마다 최신 정보로 업데이트(기온, 습도, 바람)
  +6시간까지 예보됨
 */
const getHourlyWeatherData = async (position: any, today: string, time: string) => {
  const serviceKey = WEATHER_SERVICE_KEY;
  const numOfRows = 1000;
  const pageNo = 1;
  const dataType = 'JSON';
  const base_date = today;
  const base_time = time;
  const nx = 55;
  const ny = 127;

  return await axios.get(
    `${WEATHER_API_URL}/getUltraSrtFcst?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`,
  );
};

export const Weather = () => {
  const [position, setPosition] = useState<[number, number]>([
    35.179560914682995, 129.078531730862,
  ]); //latitude 위도 longitude 경도

  const [customActiveTab, setcustomActiveTab] = useState<string>('1');
  const [dong, setDong] = useState<string>('연산동');
  const [temperature, setTemperature] = useState<string>('');
  const [windSpeed, setWindSpeed] = useState<string>('');
  const [icon, setIcon] = useState<string>('unknown');
  const [description, setDescription] = useState<string>('날씨');
  const [humidity, setHumidity] = useState<number>(0);
  const [minTemperature, setMinTemperature] = useState<number>(0);
  const [maxTemperature, setMaxTemperature] = useState<number>(0);
  const [dateTime, setDateTime] = useState<Date>();
  const [probOfRainfall, setProbOfRainfall] = useState<number>(0);
  const [weatherWarning, setWeatherWarning] = useState<WarningData>({ warning: '', level: '' });

  const date = moment();
  const today = date.format('YYYYMMDD');
  const year = date.format('YYYY');
  const month = date.format('MM');
  const day = date.format('DD');
  const hours = parseInt(date.format('HH'));
  const minutes = parseInt(date.format('mm'));

  //let fcst_time //예보 시각
  const [fcstTime, setFcstTime] = useState(0);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  const [weatherData, setWeatherData] = useState<any>(undefined);
  const [hourlyWeatherData, setHourlyWeatherData] = useState<any>(undefined);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    //getDateTime()
    let base_time; //조회할 기준 시각

    //초단기실황 조회 / param: 현재 시간 직전의 hh:30 (예: 14시 => 13:30, 14:20 => 13:30)
    if (minutes >= 30) {
      base_time = hours + '30';
      //fcst_time = hours + 1
      setFcstTime(hours + 1);
    } else {
      base_time = hours - 1 + '30';
      //fcst_time = hours
      setFcstTime(hours);
    }
    // console.log("**** FCST time ****:", fcstTime)

    if (base_time.length < 4) {
      base_time = '0' + base_time;
    }

    getWeatherData(position, today).then((response) => {
      if (response && response?.data?.response?.header?.resultCode === '00') {
        setWeatherData(response.data.response.body.items.item);
      } else {
        console.log(response.data);
      }
    });
    getHourlyWeatherData(position, today, base_time).then((response) => {
      if (response && response?.data?.response?.header?.resultCode === '00') {
        setHourlyWeatherData(response.data.response.body.items.item);
      } else {
        console.log(response.data);
      }
    });
  }, [hours, minutes, position, today]);

  const getForecastTime = useCallback(() => {
    if (minutes >= 30) {
      return hours + 1;
    } else {
      return hours;
    }
  }, [hours, minutes]);

  useEffect(() => {
    if (weatherData) {
      // console.log(weatherData);
      let tmp, sky, reh, wsd, pop, pty, tmn, tmx;

      //일 최저기온
      tmn = weatherData.filter(
        (x: any) => x.fcstTime === '0600' && x.fcstDate === today && x.category === 'TMN',
      );

      //일 최대기온
      tmx = weatherData.filter(
        (x: any) => x.fcstTime === '1500' && x.fcstDate === today && x.category === 'TMX',
      );

      // const dailyData = weatherData.filter(
      //   (x: any) => x.fcstTime === hours + '00' && x.fcstDate === today,
      // );
      // console.log('dailyData: ', dailyData);

      tmp =
        weatherData.find((item: any) => item.category === 'TMP') !== undefined
          ? weatherData.find((item: any) => item.category === 'TMP').fcstValue
          : 0;
      sky =
        weatherData.find((item: any) => item.category === 'SKY') !== undefined
          ? weatherData.find((item: any) => item.category === 'SKY').fcstValue
          : 0;
      reh =
        weatherData.find((item: any) => item.category === 'REH') !== undefined
          ? weatherData.find((item: any) => item.category === 'REH').fcstValue
          : 0;
      wsd =
        weatherData.find((item: any) => item.category === 'WSD') !== undefined
          ? weatherData.find((item: any) => item.category === 'WSD').fcstValue
          : 0;
      pop =
        weatherData.find((item: any) => item.category === 'POP') !== undefined
          ? weatherData.find((item: any) => item.category === 'POP').fcstValue
          : 0;
      pty =
        weatherData.find((item: any) => item.category === 'PTY') !== undefined
          ? weatherData.find((item: any) => item.category === 'PTY').fcstValue
          : 0;

      const object = {
        date: today,
        hours: hours,
        tmp: tmp,
        sky: parseInt(sky),
        reh: reh,
        wsd: wsd,
        pop: pop,
        pty: parseInt(pty),
        tmn: tmn.length > 0 ? parseInt(tmn[0].fcstValue) : 0,
        tmx: tmx.length > 0 ? parseInt(tmx[0].fcstValue) : 0,
      };

      // console.log(dailyData)
      // console.log(object)

      if (object.pty === 0) {
        setIcon(SKY_CODE_VALUE[object.sky].icon);
      } else {
        setIcon(PTY_CODE_VALUE[object.pty].icon);
      }

      setTemperature([object.tmp].toString());
      setDescription(SKY_CODE_VALUE[object.sky].text);
      setProbOfRainfall(object.pop);
      setHumidity(object.reh);
      setWindSpeed(object.wsd);
      setMinTemperature(object.tmn);
      setMaxTemperature(object.tmx);
    }
  }, [weatherData, hours, today]);

  useEffect(() => {
    if (hourlyWeatherData) {
      let t1h, sky, reh, pty, wsd; //기온, 하늘, 습도, 강수형태, 풍속

      let array = []; //+6시간까지의 데이터를 array로 만들어

      for (var i = 0; i < 6; i++) {
        //  console.log('fcst_time:', getForecastTime())

        let stringHour = (getForecastTime() + i).toString() + '00'; //1500
        let fcstData = hourlyWeatherData.filter((x: any) => x.fcstTime === stringHour);

        t1h =
          fcstData.find((item: any) => item.category === 'T1H') !== undefined
            ? fcstData.find((item: any) => item.category === 'T1H').fcstValue
            : 0;
        reh =
          fcstData.find((item: any) => item.category === 'REH') !== undefined
            ? fcstData.find((item: any) => item.category === 'REH').fcstValue
            : 0;
        wsd =
          fcstData.find((item: any) => item.category === 'WSD') !== undefined
            ? fcstData.find((item: any) => item.category === 'WSD').fcstValue
            : 0;
        pty =
          fcstData.find((item: any) => item.category === 'PTY') !== undefined
            ? parseInt(fcstData.find((item: any) => item.category === 'PTY').fcstValue)
            : 0;
        sky =
          fcstData.find((item: any) => item.category === 'SKY') !== undefined
            ? parseInt(fcstData.find((item: any) => item.category === 'SKY').fcstValue)
            : 0;

        const object = {
          hour: fcstTime + i,
          t1h: t1h,
          sky: sky,
          pty: pty,
          icon: pty === 0 ? SKY_CODE_VALUE[sky].icon : PTY_CODE_VALUE[pty].icon,
          // description: SKY_CODE_VALUE[sky].text,
          reh: reh,
          wsd: wsd,
        };
        array.push(object);
      }
      // console.log('array:', array);
      setHourlyData(array); //현재 ~ 현재 +6 시간 데이터 저장
    }
  }, [hourlyWeatherData, fcstTime, getForecastTime]);

  const toggleCustom = (tab: any) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  useEffect(() => {
    // const getWheatherData = async () => {
    //   try {
    //     const res = await getData(GET_WEATHER_WARNING);
    //     console.log(res);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // getWheatherData();
    // axios
    //   .get(GET_WEATHER_WARNING)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       var { data } = res;
    //       setWeatherWarning({ warning: data.data.warning, level: data.data.level });
    //     }
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="flex items-center max-lg:text-sm">
        <div>{dong}</div>
        <div className="mx-1">
          <WeatherIcon iconCode={hourlyData[0]?.icon} size={40} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <div className="fs-6 fw-bold">{hourlyData[0]?.t1h}°C</div>
          {/* <div className="fs-6 fw-bold">{hourlyData[0]?.wsd}m/s</div> */}
        </div>
        <div className="ml-1">{description}</div>
      </div>
      {/* <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="flex flex-col">
            <div className="flex items-start" id="weather-card-title">
              <h4 className="card-title">현장 날씨</h4>
              <h6 className="text-gray-500">( {hours}시 기준 )</h6>
            </div>
            <div className="mt-2 flex items-center">
              <PlaceOutlinedIcon className="mr-2 text-blue-700" />
              <div className="mt-0.5 text-blue-700">{dong}</div>
            </div>
          </div>

          <div className="text-center" id="weather-card-info">
            <h6>* 날씨는 1일 8회 업데이트 됩니다</h6>
            <Typography
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}>
              <CopyrightPoint> Ⓒ </CopyrightPoint>
              <a className="text-blue-700" href="https://www.weather.go.kr/w/index.do">
                기상청
              </a>
              <CopyrightPoint> & </CopyrightPoint>
              <a className="text-blue-700" href="https://apihub.kma.go.kr/">
                기상청 API 허브
              </a>
            </Typography>
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: 'none',
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus>
              <div className="p-5">
                <Image
                  src="https://www.kogl.or.kr/static/kogl/img/sub/number1.jpg"
                  alt="copyright-logo"
                  width={100}
                  height={40}
                  style={{ height: '40px' }}
                />
                <p>
                  본 저작물은 기상청에서 공공누리 제1유형으로 개방한 기상특보현황조회을
                  이용하였습니다.
                </p>
              </div>
            </Popover>
          </div>
        </div>
        <Row className="mx-2 my-1" id="weather-card-content">
          <Col sm="12">
            <Row>
              {weatherWarning.warning !== '' && (
                <Col sm="12">
                  <div className="bg-primary bg-gradient bg-opacity-10 p-1 text-center flex items-center content-center text-sm">
                    <Image
                      src={'https://www.weather.go.kr/w/resources/image/renew/ic_sym_01.png'}
                      alt="waring-icon"
                      width={25}
                      height={25}
                      style={{ paddingBottom: '2px', marginRight: '5px' }}
                    />
                    {weatherWarning.warning}
                    <span className="text-danger" style={{ fontWeight: 600, margin: '0px 5px' }}>
                      {weatherWarning.level}{' '}
                    </span>
                    발효중
                  </div>
                </Col>
              )}
            </Row>
            <NowWeather className="m-1 mt-3" id="weather-now">
              <NowWeatherContent style={{ display: 'flex' }}>
                <div className="text-center">
                  <WeatherIcon iconCode={icon} size={50} />
                </div>
                <div>
                  <div className="font-size-15 d-block m-auto text-center">{description}</div>
                  <p className="text-center">(강수확률 : {probOfRainfall}%)</p>
                </div>
              </NowWeatherContent>
              <NowWeatherContent className="text-center">
                <p>
                  <span className="text-bold text-gray-500">최고 </span>
                  <span className="text-normal fw-bold">{maxTemperature}°C</span>
                </p>
                <p>
                  <span className="text-bold text-gray-500">최저 </span>
                  <span className="text-normal fw-bold">{minTemperature}°C</span>
                </p>
              </NowWeatherContent>
            </NowWeather>
            <div className="flex items-center justify-between mt-5 max-sm:hidden" id="weahter-more">
              {hourlyData.map((data, key) => (
                <div className="mx-2 mt-2 flex flex-col items-center" key={key}>
                  <p className="text-bold text-gray-500">
                    {hours === data.hour.toString() ? '지금' : data.hour + '시'}
                  </p>
                  <div className="mb-1">
                    <WeatherIcon iconCode={data.icon} size={40} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <div className="fs-6 fw-bold">{data.t1h}°C</div>
                    <div className="fs-6 fw-bold">{data.wsd}m/s</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col  mt-5 sm:hidden md:hidden lg:hidden" id="weahter-more">
              <div className="flex justify-between">
                {hourlyData.slice(0, 3).map((data, key) => (
                  <div className="mx-2 mt-2 flex flex-col items-center" key={key}>
                    <p className="text-bold text-gray-500">
                      {hours === data.hour.toString() ? '지금' : data.hour + '시'}
                    </p>
                    <div className="mb-1">
                      <WeatherIcon iconCode={data.icon} size={40} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <div className="fs-6 fw-bold">{data.t1h}°C</div>
                      <div className="fs-6 fw-bold">{data.wsd}m/s</div>
                    </div>
                  </div>
                ))}
              </div>
              <br />
              <div className="flex justify-between">
                {hourlyData.slice(3).map((data, key) => (
                  <div className="mx-2 mt-2 flex flex-col items-center" key={key}>
                    <p className="text-bold text-gray-500">
                      {hours === data.hour.toString() ? '지금' : data.hour + '시'}
                    </p>
                    <div className="mb-1">
                      <WeatherIcon iconCode={data.icon} size={40} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <div className="fs-6 fw-bold">{data.t1h}°C</div>
                      <div className="fs-6 fw-bold">{data.wsd}m/s</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </CardBody> */}
    </div>
  );
};

const WeatherCard = styled(Card)`
  height: 320px;
  @media screen and (max-width: 580px) {
    height: fit-content;
  }
`;
const NowWeather = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  align-items: center;
`;
const NowWeatherContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 16px;
`;
const CopyrightPoint = styled.span`
  cursor: pointer;
`;

export default Weather;
