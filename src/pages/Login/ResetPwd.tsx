import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import { ProFormText, StepsForm } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import loginController, { ResetDTO } from './loginController';

interface ModalFormProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
const { resetPwdCaptcha, getPublicKey, resetPassword } = loginController;
const ResetPwd = ({ visible, setVisible }: ModalFormProps) => {
  const { run: getCaptcha, loading: captchaLoading } =
    useReqWithMsg(resetPwdCaptcha);
  const { run, loading } = useReqWithMsg(resetPassword, () =>
    setVisible(false),
  );
  return (
    <>
      <StepsForm
        onFinish={async (values) => {
          const { rsaPassword, publicKey } = await getPublicKey(
            values.password,
          );
          if (typeof rsaPassword === 'string') {
            await run({
              ...values,
              password: rsaPassword,
              publicKey,
            } as ResetDTO);
          } else {
            message.error('密码加密失败');
          }
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title="修改密码"
              width={800}
              onCancel={() => setVisible(false)}
              open={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="email-confirm"
          title="邮箱验证"
          loading={captchaLoading}
          onFinish={async (value) => {
            // todo 发送验证码
            console.log('email-confirm', value);
            await getCaptcha(value.email);
            return true;
          }}
        >
          <ProFormText
            name="email"
            width="md"
            placeholder="请输入邮箱"
            rules={[{ required: true, type: 'email', message: '请输入邮箱' }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="resPwd" title="重置密码" loading={loading}>
          <ProFormText.Password
            name="password"
            width="md"
            placeholder="请输入密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
          <ProFormText.Password
            name="confirm"
            width="md"
            placeholder="请确认密码"
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不匹配!'));
                },
              }),
            ]}
          />
          <ProFormText
            name="code"
            width="md"
            placeholder="请输入验证码"
            rules={[{ required: true, message: '请输入验证码' }]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};
export default ResetPwd;
