import { LoginDTO, RegisterDTO } from '@/pages/Login/loginController';
import { useNavigate } from '@@/exports';
import {
  ProForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Typography, message } from 'antd';
import { debounce } from 'lodash';
import { ChangeEventHandler, useRef, useState } from 'react';
import './index.less';
import loginController from './loginController';
const { Link } = Typography;
type IProFormText = React.ComponentProps<typeof ProFormText>;
interface ValidProps {
  disabled?: boolean;
  validateStatus: 'success' | 'warning' | 'error' | 'validating' | '';
  help?: string;
}
const { getMailCaptcha, loginUser, registerUser, getPublicKey } =
  loginController;
const inputStyles: IProFormText['fieldProps'] = {
  size: 'large',
  style: { borderRadius: '10px' },
};
type Rule = NonNullable<IProFormText['rules']>[number];

export default function Login() {
  const navigate = useNavigate();
  const forRef = useRef<ProFormInstance>(); // 获取表单实例
  // 登录和注册
  const [authState, setAuthState] = useState<'login' | 'register'>('login');

  async function loginAction(values: LoginDTO) {
    const { publicKey, rsaPassword } = await getPublicKey(values.password);
    values.password = rsaPassword ? rsaPassword : values.password;
    const { code, data, msg } = await loginUser({ ...values, publicKey });
    if (code === 200) {
      message.success('登录成功', 1, () => {
        if (typeof data === 'object') {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        navigate('/home');
      });
    } else {
      message.error(msg);
    }
  }
  async function registerAction(values: RegisterDTO) {
    delete values.confirmPassword;
    const { code, msg } = await registerUser(values);
    if (code === 200) {
      message.success('注册成功,将返回登录页', 1, () => {
        forRef.current?.resetFields();
        setAuthState('login');
      });
    } else {
      message.error(msg);
    }
  }

  async function onFinish(values: any) {
    if (authState === 'login') {
      return await loginAction(values);
    }
    if (authState === 'register') {
      return await registerAction(values);
    }
  }
  // 邮箱验证码
  const [captchaBtnDsb, setCaptchaBtnDsb] = useState<ValidProps>({
    disabled: true,
    validateStatus: '',
  }); // 验证码按钮
  const emailChange: ChangeEventHandler<HTMLInputElement> = debounce((e) => {
    console.log('validating....');
    const email = e.target.value;
    // 验证邮箱格式
    const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/; // eslint-disable-line
    if (reg.test(email)) {
      setCaptchaBtnDsb({
        disabled: false,
        validateStatus: 'success',
      });
    } else {
      setCaptchaBtnDsb({
        disabled: true,
        validateStatus: 'error',
        help: '请输入正确的邮箱!',
      });
    }
  }, 500);
  const onGetCaptcha = async () => {
    if (captchaBtnDsb.disabled) {
      message.error('邮箱格式不正确');
      return Promise.reject('邮箱格式不正确');
    }
    const { code, data } = await getMailCaptcha(
      forRef.current?.getFieldValue('email'),
    );
    if (code === 200) {
      message.success('验证码发送成功，请注意查收！');
    } else {
      message.error(data);
    }
  };
  // 确认密码
  const [confirmPwd, setConfirmPwd] = useState<ValidProps>({
    validateStatus: '',
    help: undefined,
  });
  const validatePwd: Rule = {
    validator: async (_, value) => {
      if (!value) {
        setConfirmPwd({
          validateStatus: 'error',
          help: '请确认密码!',
        });
        return Promise.reject('请确认密码!');
      }
      if (value !== forRef.current?.getFieldValue('password')) {
        setConfirmPwd({
          validateStatus: 'error',
          help: '两次输入的密码不匹配!',
        });
        return Promise.reject('两次输入的密码不匹配!');
      }
      setConfirmPwd({
        validateStatus: 'success',
        help: undefined,
      });
      return Promise.resolve();
    },
  };
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
                <span className={'text-lg tracking-[30px]'}>
                  {authState === 'login' ? '登录' : '注册'}
                </span>
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
          {authState === 'register' && (
            <>
              <ProFormText.Password
                fieldProps={inputStyles}
                name={'confirmPassword'}
                dependencies={['password']}
                label={'确认密码'}
                hasFeedback
                validateStatus={confirmPwd.validateStatus}
                help={confirmPwd.help}
                rules={[validatePwd]}
              />
              <ProFormCaptcha
                allowClear={true}
                fieldProps={inputStyles}
                name={'email'}
                style={{ borderRadius: '10px' }}
                className={'test'}
                label={'邮箱'}
                hasFeedback
                validateStatus={captchaBtnDsb.validateStatus}
                help={captchaBtnDsb.help}
                onGetCaptcha={onGetCaptcha}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count}s 获取验证码`;
                  }
                  return '获取验证码';
                }}
                countDown={60}
                captchaProps={{
                  // 需要验证邮箱格式
                  size: 'large',
                  style: { borderRadius: '10px' },
                }}
                placeholder={'请输入邮箱'}
                onChange={emailChange}
              />
              <ProFormText
                fieldProps={inputStyles}
                name={'code'}
                label={'验证码'}
                placeholder={'请输入验证码'}
              />
            </>
          )}
          {authState === 'login' && (
            <div>
              忘记密码？<Link>点击重置</Link>
            </div>
          )}
        </ProForm>
        {authState === 'login' ? (
          <div>
            没有账号？
            <Link onClick={() => setAuthState('register')}>点击注册</Link>
          </div>
        ) : (
          <div>
            已有账号？
            <Link onClick={() => setAuthState('login')}>点击登录</Link>
          </div>
        )}
      </div>
    </div>
  );
}
