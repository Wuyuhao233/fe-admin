import { MyButton } from '@/components/Button';
import { noSizeInputStyles } from '@/config/styles';
import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import userController, {
  UserInfo,
} from '@/pages/User/controller/userController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Typography, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';

const { queryUserList, deleteUser, modifyUser } = userController;
const { Link } = Typography;

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: UserInfo[]) => {
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<UserInfo[]>([]);

  const { run: deleteUserById } = useReqWithMsg(
    deleteUser,
    actionRef.current?.reload,
  );
  const { run: updateUser, loading: updateLoading } = useReqWithMsg(
    modifyUser,
    actionRef.current?.reload,
  );
  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<UserInfo>();
  function closeModal() {
    handleModalVisible(false);
    setEditFormValues(undefined);
  }
  const columns: ProDescriptionsItemProps<UserInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // 不在表单中显示
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'text',
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
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'select',
      hideInSearch: true,
      // hideInForm: true,
      valueEnum: {
        '1': { text: '男' },
        '2': { text: '女' },
        '3': { text: '其他', status: 'other' },
      },
      formItemProps: {},
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      renderText: (roles) => {
        return roles;
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
              record.gender = String(record.gender);
              setEditFormValues(record);
            }}
          >
            编辑
          </Link>
          <Divider type="vertical" />
          <Link onClick={() => deleteUserById(record.id)}>删除</Link>
        </>
      ),
    },
  ];
  //note 给表单添加样式
  columns.forEach((column) => {
    column.fieldProps = noSizeInputStyles;
  });

  return (
    <PageContainer
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<UserInfo>
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
          <MyButton key={'add'}>
            <PlusOutlined className={'!text-sm'} />
            新建
          </MyButton>,
        ]}
        request={async (params) => {
          const res = await queryUserList({
            pageSize: params.pageSize || 15,
            current: params.current || 1,
          });
          console.log('queryUserList', res);
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
        <ProTable<UserInfo, UserInfo>
          loading={updateLoading}
          onSubmit={async (value) => {
            value.id = editFormValues?.id as number;
            await updateUser(value);
            closeModal();
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
          <ProDescriptions<UserInfo>
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
