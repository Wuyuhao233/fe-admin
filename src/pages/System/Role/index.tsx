import MenuTree from '@/components/CusFormItem/MenuTree';
import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import CreateForm from '@/pages/System/components/CreateForm';
import FunctionTreeModal from '@/pages/System/components/FunctionTreeModal';
import TreeModal from '@/pages/System/components/TreeModal';
import RoleController, {
  RoleInfo,
} from '@/pages/System/controller/Role.controller';
import { PlusOutlined } from '@ant-design/icons';
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

const { getRoleList, deleteRoleById, updateRole, addRole } = RoleController;
const { Link } = Typography;

const Role: React.FC<unknown> = () => {
  const [modal, handleModal] = useState({
    visible: false,
    type: '',
  });
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<RoleInfo>();
  const [selectedRowsState, setSelectedRows] = useState<RoleInfo[]>([]);
  const [treeModal, setTreeModal] = useState(false);
  const [functionVisible, setFunctionModal] = useState(false);
  const { run: deleteRole } = useReqWithMsg(
    deleteRoleById,
    actionRef.current?.reload,
  );
  const { run: update, loading: updateLoading } = useReqWithMsg(
    updateRole,
    actionRef.current?.reload,
  );
  const { run: add, loading: addLoading } = useReqWithMsg(
    addRole,
    actionRef.current?.reload,
  );
  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<RoleInfo>();
  function closeModal() {
    handleModal({
      visible: false,
      type: '',
    });
    setEditFormValues(undefined);
  }
  const onMenuChange = async (e: any) => {
    if (editFormValues) {
      const res = await update({
        ...editFormValues,
        menuIds: e,
      });
      if (res.code === 200) {
        setTreeModal(false);
      }
    }
  };
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
      // note 像这种需要自定义的，或者说各种转换的，在editFormValue或者onSubmit处理
      title: '分配菜单',
      dataIndex: 'menus',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: () => {
        return <MenuTree />;
      },
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
              setEditFormValues(record);
              setTreeModal(true);
            }}
          >
            分配菜单
          </Link>
          <Divider type="vertical" />
          <Link
            onClick={() => {
              setEditFormValues(record);
              setFunctionModal(true);
            }}
          >
            分配权限
          </Link>
          <Divider type="vertical" />
          <Link
            onClick={() => {
              handleModal({
                visible: true,
                type: 'edit',
              });
              setEditFormValues(record);
            }}
          >
            修改
          </Link>
          <Divider type="vertical" />
          <Link onClick={() => deleteRole(record.id)}>删除</Link>
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
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              handleModal({
                visible: true,
                type: 'addNew',
              });
              setEditFormValues(undefined);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
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
        onCancel={() => handleModal({ visible: false, type: '' })}
        modalVisible={modal.visible}
      >
        <ProTable<RoleInfo, RoleInfo>
          loading={updateLoading || addLoading}
          onSubmit={async (value) => {
            console.log('value', value);
            value.menuIds = value.menus as string[];
            delete value.menus;
            if (modal.type === 'addNew') {
              await add(value);
            }
            if (modal.type === 'edit') {
              value.id = editFormValues?.id || '';
              await update(value);
            }
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
      <TreeModal
        visible={treeModal}
        setVisible={setTreeModal}
        value={editFormValues?.menus}
        onChange={onMenuChange}
      />
      <FunctionTreeModal
        visible={functionVisible}
        setVisible={setFunctionModal}
        onChange={async (e) => {
          if (editFormValues) {
            const res = await update({
              ...editFormValues,
              functions: e,
            });
            if (res.code === 200) {
              setFunctionModal(false);
            }
          }
        }}
        value={editFormValues?.functions}
      />
    </PageContainer>
  );
};

export default Role;
