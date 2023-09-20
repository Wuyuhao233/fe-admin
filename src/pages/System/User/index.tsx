import { MyButton } from '@/components/Button';
import ItemUpload from '@/components/CusFormItem/ItemUpload';
import { noSizeInputStyles } from '@/config/styles';
import { User } from '@/declare/User';
import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import loginController, { RegisterDTO } from '@/pages/Login/loginController';
import RoleController from '@/pages/System/controller/Role.controller';
import userController from '@/pages/System/controller/userController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormCaptcha,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Tag, Typography, message } from 'antd';
import { debounce } from 'lodash';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import CreateForm from '../components/CreateForm';
interface ValidProps {
  disabled?: boolean;
  validateStatus: 'success' | 'warning' | 'error' | 'validating' | '';
  help?: string;
}
const { queryUserList, deleteUser, modifyUser } = userController;
const { Link } = Typography;
const { getMailCaptcha, registerUser } = loginController;
/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: User[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser(selectedRows.find((row) => row.id)?.id || '');
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const UserList: React.FC<unknown> = () => {
  // 重置密码

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<User>();
  const [selectedRowsState, setSelectedRows] = useState<User[]>([]);
  const forRef = useRef<ProFormInstance>(); // 获取表单实例
  const { run: deleteUserById } = useReqWithMsg(
    deleteUser,
    actionRef.current?.reload,
  );

  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<User>();
  const [editType, setEditType] = useState<'add' | 'edit'>('add');

  // 邮箱验证码
  const [captchaBtnDsb, setCaptchaBtnDsb] = useState<ValidProps>({
    disabled: true,
    validateStatus: '',
  });
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
  function closeModal() {
    handleModalVisible(false);
    setEditFormValues(undefined);
    setCaptchaBtnDsb({
      disabled: true,
      validateStatus: '',
    });
  }
  const { run: updateUser, loading: updateLoading } = useReqWithMsg(
    modifyUser,
    () => {
      actionRef.current?.reload();
      closeModal();
    },
  );
  const { run: register, loading: registerLoading } = useReqWithMsg(
    registerUser,
    () => {
      actionRef.current?.reload();
      closeModal();
    },
  );
  const columns: ProDescriptionsItemProps<User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // 不在表单中显示
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      valueType: 'avatar',
      hideInSearch: true,
      renderFormItem: () => {
        return <ItemUpload />;
      },
    },
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      // 增删改的表单配置
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'select',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '性别为必填项',
          },
        ],
      },
      // hideInForm: true,
      valueEnum: {
        '1': { text: '男' },
        '2': { text: '女' },
        '3': { text: '其他', status: 'other' },
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '手机号为必填项',
          },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '邮箱为必填项',
          },
        ],
        style: {
          height: '32px',
        },
      },
      hideInForm: editType === 'edit',
      renderFormItem: () => {
        return (
          <ProFormCaptcha
            allowClear={true}
            name={'email'}
            className={'test'}
            hasFeedback
            validateStatus={captchaBtnDsb.validateStatus}
            help={captchaBtnDsb.help}
            onGetCaptcha={onGetCaptcha}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count}s 后可重新获取`;
              }
              return '获取验证码';
            }}
            countDown={60}
            placeholder={'请输入邮箱'}
            onChange={emailChange}
          />
        );
      },
    },
    {
      title: '验证码',
      key: 'code',
      hideInTable: true,
      dataIndex: 'code',
      valueType: 'text',
      hideInSearch: true,
      hideInDescriptions: true,
      hideInForm: editType === 'edit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '验证码为必填项',
          },
        ],
      },
    },
    {
      title: '角色',
      dataIndex: 'roles',
      valueType: 'select',
      hideInSearch: true,
      fieldProps: {
        placeholder: '请选择角色',
        mode: 'multiple',
      },
      render: (_, record) => {
        return record.roles?.map((item) => {
          return typeof item === 'string' ? (
            '-'
          ) : (
            <Tag color="success" key={item.id}>
              {item.title}
            </Tag>
          );
        });
      },
      request: async () => {
        const res = await RoleController.getRoleList();
        return res.data.map((item) => {
          return {
            label: item.title,
            value: item.id,
          };
        });
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Link
            onClick={() => {
              handleModalVisible(true);
              // note 由于表单的性别是select，所以需要转换一下,设置为字符串
              // record.gender = String(record.gender);
              // note 照片有修改就传，没有就不传,直接修改会影响显示
              // record.avatar = undefined;
              setEditFormValues({
                ...record,
                gender: String(record.gender),
                avatar: undefined,
                roles: record.roles?.map((item) => {
                  return typeof item === 'string' ? item : item.id;
                }),
              });
              setEditType('edit');
            }}
          >
            编辑
          </Link>
          <Divider type="vertical" />
          <Link
            onClick={() => {
              console.log('record', record);
              deleteUserById(record.id);
            }}
          >
            删除
          </Link>
        </>
      ),
    },
  ];
  //note 给表单添加样式
  columns.forEach((column) => {
    column.fieldProps = { ...(column.fieldProps || {}), ...noSizeInputStyles };
  });

  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<User>
        actionRef={actionRef}
        rowKey="id"
        // note 搜索设置
        search={{
          labelWidth: 'auto',
          className: 'search-header',
          //note input 框的宽度
          span: 6,
        }}
        // note 为false时，不显示工具栏
        options={false}
        toolBarRender={() => [
          <MyButton
            key={'add'}
            onClick={() => {
              handleModalVisible(true);
              setEditFormValues(undefined);
              setEditType('add');
            }}
          >
            <PlusOutlined className={'!text-sm'} />
            新建
          </MyButton>,
        ]}
        request={async (params) => {
          const res = await queryUserList({
            ...params,
            pageSize: params.pageSize || 15,
            current: params.current || 1,
          });
          console.log('queryUserList', res, params);
          return {
            data: res.data,
            success: res.success,
          };
        }}
        columns={columns}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<User, RegisterDTO | User>
          loading={updateLoading || registerLoading}
          formRef={forRef}
          onSubmit={async (value) => {
            console.log('value', value);
            if (editType === 'add') {
              await register(value as RegisterDTO);
            }
            if (editType === 'edit') {
              (value as User).id = editFormValues?.id as string;
              await updateUser(value as User);
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            initialValues: editFormValues,
            layout: 'horizontal',
          }}
        />
      </CreateForm>

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<User>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
