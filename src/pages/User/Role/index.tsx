import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import CreateForm from '@/pages/User/components/CreateForm';
import RoleController, {
  RoleInfo,
} from '@/pages/User/controller/Role.controller';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { getRoleList, deleteRoleById, updateRole } = RoleController;
const { Link } = Typography;

const Role: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<RoleInfo>();
  const [selectedRowsState, setSelectedRows] = useState<RoleInfo[]>([]);

  const { run: deleteRole } = useReqWithMsg(
    deleteRoleById,
    actionRef.current?.reload,
  );
  const { run: update, loading: updateLoading } = useReqWithMsg(
    updateRole,
    actionRef.current?.reload,
  );
  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<RoleInfo>();
  function closeModal() {
    handleModalVisible(false);
    setEditFormValues(undefined);
  }
  const columns: ProDescriptionsItemProps<RoleInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // 不在表单中显示
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '角色名称',
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
      title: '职位',
      dataIndex: 'title',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
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
              setEditFormValues(record);
            }}
          >
            修改
          </Link>
          <Divider type="vertical" />
          <Link onClick={() => deleteRole(record.id)}>删除角色</Link>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '角色管理',
      }}
    >
      <ProTable<RoleInfo>
        headerTitle="角色列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => []}
        request={async (params) => {
          const res = await getRoleList({
            pageSize: params.pageSize || 15,
            current: params.current || 1,
          });
          console.log('queryRoles...', res);
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
              console.log('selectedRowsState', selectedRowsState);
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
        <ProTable<RoleInfo, RoleInfo>
          loading={updateLoading}
          onSubmit={async (value) => {
            value.id = editFormValues?.id || '';
            await update(value);
            closeModal();
          }}
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            initialValues: editFormValues,
            layout: 'horizontal',
            wrapperCol: { span: 16 },
            labelCol: { span: 7 },
            style: { width: '80%' },
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
          <ProDescriptions<RoleInfo>
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

export default Role;
