import 'app/globals.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, setAuthToken } from 'api';

export default function Login() {
  const router = useRouter();

  const [isError, setIsError] = useState({
    phoneNumber: false,
    password: false,
  });

  const handleSubmit = async (event) => {
    setIsError({ phoneNumber: false, password: false });
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    console.log({
      phoneNumber: data.get('phoneNumber'),
      password: data.get('password'),
    });
    // if (data.get('phoneNumber').length < 12) {
    //   console.log(isError);
    //   setIsError({ phoneNumber: true, password: isError.password });
    // }
    // if (data.get('password').length === 0) {
    //   console.log(isError);
    //   setIsError({ phoneNumber: isError.phoneNumber, password: true });
    // }

    // if (data.get('phoneNumber').length >= 12 && data.get('password').length !== 0) {
    const response = await getAuthUser({
      id: data.get('phoneNumber'),
      password: data.get('password'),
      deviceToken: '0',
    });

    if (response.result === 0) {
      localStorage.setItem('authUser', JSON.stringify(response.data[0]));
      setAuthToken(response.data[0].token);
      router.push('/attendance');
    } else if (response.result === -1) {
      alert(response.error_message);
    }
    // }
  };

  const onClickPrivacy = () => {
    window.open('https://inconus.co.kr/policy/privacy', '_blank');
  };
  return (
    <main className="h-screen w-full">
      <div className="flex h-screen">
        <div className="grow bg-[url('/images/bg_login.png')]">
          <div className="absolute left-5 bottom-10 text-gray-300 text-sm">
            <img src="/images/logo_inconus.svg" className="mb-1" />
            <p className="cursor-pointer hover:font-bold" onClick={onClickPrivacy}>
              개인정보처리방침
            </p>
            부산 해운대구 센텀동로 71 709호 | Tel 051.744.7844 | Fax 051.744.7845
            <br />
            Copyright 2022. KANGNAM & INCONUS inc. all rights reserved.
          </div>
        </div>
        <div className="grow-0 w-[480px] p-5 flex flex-col items-center justify-center">
          <img src="/images/logo_keepme.webp" />
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="아이디"
              name="phoneNumber"
              // autoComplete="phoneNumber"
              autoFocus
              error={isError.phoneNumber}
              helperText={isError.phoneNumber && '아이디를 확인 해 주세요'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              // autoComplete="current-password"
              error={isError.password}
              helperText={isError.password && '8 ~ 16자 영문, 숫자 조합이 맞는 지 확인해주세요'}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mt-2 bg-blue-500 text-white">
              로그인
            </Button>
          </Box>
        </div>
      </div>
    </main>
  );
}
