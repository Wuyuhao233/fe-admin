import { inputStyles } from '@/config/styles';
import { LoginDTO } from '@/pages/Login/loginController';
import { setAccessToken, setRefreshToken } from '@/store/auth';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from '@@/exports';
import {
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef } from 'react';
import './index.less';
import loginController from './loginController';
const { loginUser, getPublicKey } = loginController;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const forRef = useRef<ProFormInstance>(); // 获取表单实例
  // 登录和注册

  async function loginAction(values: LoginDTO) {
    const { publicKey, rsaPassword } = await getPublicKey(values.password);
    values.password = rsaPassword ? rsaPassword : values.password;
    const { code, data, msg } = await loginUser({ ...values, publicKey });
    if (code === 200) {
      message.success('登录成功', 1, () => {
        if (typeof data === 'object') {
          // note 这里确实比较麻烦，但是不知道怎么解决
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          dispatch(setRefreshToken(data.refresh_token));
          dispatch(setAccessToken(data.access_token));
        }
        navigate('/home');
      });
    } else {
      message.error(msg);
    }
  }

  async function onFinish(values: any) {
    return await loginAction(values);
  }
  return (
    <div id="login" className={'full bg-[rgba(77,139,255,0.8)] relative'}>
      <div className="loginForm absCenter bg-white w-[600px] p-16 rounded-2xl">
        <ProForm
          formRef={forRef}
          // 只有一个提交按钮
          submitter={{
            render: () => [
              <Button
                className={'w-full mt-6 mb-3'}
                style={{
                  borderRadius: '10px',
                  height: '50px',
                }}
                key="submit"
                type="primary"
                htmlType="submit"
              >
                <span className={'text-lg tracking-[30px]'}>登录</span>
              </Button>,
            ],
          }}
          onFinish={onFinish}
        >
          <ProFormText
            fieldProps={inputStyles}
            name={'name'}
            label={'用户名'}
            placeholder={'请输入用户名'}
          />
          <ProFormText.Password
            fieldProps={inputStyles}
            name={'password'}
            label={'密码'}
            placeholder={'请输入密码'}
          />
        </ProForm>
      </div>
    </div>
  );
}
