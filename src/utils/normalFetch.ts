import { history } from '@@/core/history';
import { message } from 'antd';
import { EnvConfig } from '../../config/env.config';

export const refreshToken = async () => {
  const refreshUrl = EnvConfig.getRefreshTokenUrl();
  const refresh_token = localStorage.getItem('refresh_token');

  const fetchRes = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ refresh_token }),
  });
  const res = await fetchRes.json();
  if (res.code === 200) {
    localStorage.setItem('access_token', res.data);
    return 'success';
  } else {
    message.error('登录已过期，请重新登录').then(() => {
      history.push('/login');
    });
    return 'failed';
  }
};
