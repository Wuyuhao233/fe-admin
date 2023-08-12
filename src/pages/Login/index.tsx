import { inputStyles } from '@/config/styles';
import ResetPwd from '@/pages/Login/ResetPwd';
import { LoginDTO } from '@/pages/Login/loginController';
// import { useNavigate, } from '@@/exports';
import {
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Typography, message } from 'antd';
import { useRef, useState } from 'react';
import './index.less';
import loginController from './loginController';
const { loginUser, getPublicKey } = loginController;
const { Link } = Typography;
export default function Login() {
  const [visible, setVisible] = useState(false);
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
        }
        //   需要刷新页面，所以需要使用window.location.href
        window.location.href = window.location.origin + '/home';
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
          <div className={'flex flex-row-reverse'}>
            <Link onClick={() => setVisible(true)}>忘记密码？</Link>
          </div>
        </ProForm>
      </div>
      <ResetPwd visible={visible} setVisible={setVisible} />
    </div>
  );
}
