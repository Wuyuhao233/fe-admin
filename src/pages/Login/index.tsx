import loginController from '@/pages/Login/loginController';
import { setAccessToken, setRefreshToken } from '@/store/auth';
import { useAppDispatch } from '@/store/hoos';
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useNavigate, useRequest } from '@umijs/max';
import { Divider, Space, Spin, Tabs, message } from 'antd';
import type { CSSProperties } from 'react';
import './index.less';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '28px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export default () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { run, loading } = useRequest(loginController.loginUser, {
    manual: true,
  });
  // const count = useAppSelector((state: RootState) => state.test.count);
  const login = async (form: any) => {
    const { code, data, message: msg } = await run(form);
    if (code === 200) {
      message.success('登录成功！', 1, () => {
        navigate('/');
      });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      dispatch(setAccessToken(data.access_token));
      dispatch(setRefreshToken(data.refresh_token));
    } else {
      message.error(msg);
    }
  };
  return (
    <Spin delay={2000} spinning={loading}>
      <div id={'loginPage'}>
        <LoginFormPage
          backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
          logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          title="Huisman登录"
          subTitle="您可靠的海工伙伴"
          onFinish={login}
          actions={
            <div className={'loginPageActions'}>
              <Divider plain>
                <span
                  className={'font-normal'}
                  style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}
                >
                  其他登录方式
                </span>
              </Divider>
              <Space align="center" size={24}>
                <div
                  className={
                    'fcc w-[40] h-[40] border-[1px] border-[#D4D8DD] rounded-[50%]'
                  }
                >
                  <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
                </div>
                <div
                  className={
                    'fcc w-[40] h-[40] border-[1px] border-[#D4D8DD] rounded-[50%]'
                  }
                >
                  <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
                </div>
                <div
                  className={
                    'fcc w-[40] h-[40] border-[1px] border-[#D4D8DD] rounded-[50%]'
                  }
                >
                  <WeiboOutlined style={{ ...iconStyles, color: '#333333' }} />
                </div>
              </Space>
            </div>
          }
        >
          <Tabs
            centered
            defaultActiveKey="account"
            items={[
              {
                label: '账号密码登录',
                key: 'account',
                children: (
                  <>
                    <ProFormText
                      name="name"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'用户名'}
                      rules={[
                        {
                          required: true,
                          message: '请输入用户名!',
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'密码'}
                      rules={[
                        {
                          required: true,
                          message: '请输入密码！',
                        },
                      ]}
                    />
                  </>
                ),
              }, // 务必填写 key
              {
                label: '手机号登录',
                key: 'mobile',
                children: (
                  <>
                    <ProFormText
                      fieldProps={{
                        size: 'large',
                        prefix: <MobileOutlined className={'prefixIcon'} />,
                      }}
                      name="mobile"
                      placeholder={'手机号'}
                      rules={[
                        {
                          required: true,
                          message: '请输入手机号！',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: '手机号格式错误！',
                        },
                      ]}
                    />
                    <ProFormCaptcha
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      captchaProps={{
                        size: 'large',
                      }}
                      placeholder={'请输入验证码'}
                      captchaTextRender={(timing, count) => {
                        if (timing) {
                          return `${count} ${'获取验证码'}`;
                        }
                        return '获取验证码';
                      }}
                      name="captcha"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]}
                      onGetCaptcha={async () => {
                        message.success('获取验证码成功！验证码为：1234');
                      }}
                    />
                  </>
                ),
              },
            ]}
          ></Tabs>
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginFormPage>
      </div>
    </Spin>
  );
};
