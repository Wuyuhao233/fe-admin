import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import CreateForm from '@/pages/System/components/CreateForm';
import MenuController, {
  MenuDto,
  MenuInfo,
} from '@/pages/System/controller/menu.controller';
import { findParent } from '@/utils/tools';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Tooltip, Typography, message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const {
  queryMenuList,
  deleteMenu: deleteItem,
  modifyMenu,
  addMenu,
  getMenuInfo,
  getChildMenuList,
} = MenuController;
const { Link } = Typography;

const Menu: React.FC<unknown> = () => {
  const [dataSource, setDataSource] = useState<MenuInfo[]>([]);
  const [params] = useState({
    pageSize: 15,
    current: 1,
  });
  const { run: addMenuItem, loading: addLoading } = useReqWithMsg(addMenu);
  const getDataSource = useCallback(async () => {
    const { code, data } = await queryMenuList(params);
    if (code === 200) {
      setDataSource(
        data.map((item: MenuInfo) => {
          if (item.hasChild) {
            item.children = [];
          }
          return item;
        }),
      );
    } else {
      message.error('获取菜单列表失败');
    }
  }, [params]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    getDataSource();
  }, [getDataSource, refresh]);

  const [modal, handleModal] = useState({
    visible: false,
    type: '',
  });
  const actionRef = useRef<ActionType>();
  const recordRef = useRef<MenuInfo>();
  const [row, setRow] = useState<MenuInfo>();
  const [selectedRowsState, setSelectedRows] = useState<MenuInfo[]>([]);
  //类型 ：
  const [type, setType] = useState('0');
  const { run: deleteMenu } = useReqWithMsg(
    deleteItem,
    actionRef.current?.reload,
  );
  const { run: update, loading: updateLoading } = useReqWithMsg(
    modifyMenu,
    actionRef.current?.reload,
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    [],
  );
  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<MenuInfo>();
  function closeModal() {
    handleModal({
      visible: false,
      type: '',
    });
    setEditFormValues(undefined);
  }
  const refreshAfterAction = async (value?: MenuDto | MenuInfo) => {
    console.log('refreshAfterAction', value);
    if (!value) {
      return;
    }
    //编辑的是最外层的菜单
    if (!value.parentId) {
      setRefresh(!refresh);
      setExpandedRowKeys([]);
    } else {
      //   更新当前的节点
      const parent = findParent(dataSource, value.parentId);
      let updateId = parent ? parent.id : editFormValues?.id;
      const { data, code } = await getMenuInfo(updateId || '');
      if (code === 200) {
        const index = dataSource.findIndex((item) => item.id === updateId);
        if (index !== -1) {
          dataSource[index] = data;
          setDataSource([...dataSource]);
        }
      }
    }
  };
  const onSubmit = async (value: MenuDto) => {
    console.log('onSubmit', value);
    if (modal.type === 'addNew') {
      value.parentId = null;
    }
    if (modal.type === 'addChildren') {
      value.parentId = editFormValues?.id || null;
    }
    // radio 类型的值转换为number
    value.type = Number(value.type);
    if (modal.type === 'edit') {
      await update({
        ...editFormValues,
        ...value,
      });
    } else {
      await addMenuItem(value);
    }
    // note 刷新表格,editFormValues 就是当前的节点
    await refreshAfterAction(editFormValues);
    closeModal();
  };
  const onDelete = async (record: MenuInfo) => {
    await deleteMenu(record.id as string);
    await refreshAfterAction(record as MenuDto);
  };
  const columns: ProDescriptionsItemProps<MenuInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // 不在表单中显示
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '名称',
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
      title: '类型',
      dataIndex: 'type',
      valueType: 'radioButton',
      hideInSearch: true,
      // note 修改表单中的排序
      order: 1,
      valueEnum: {
        1: { text: '目录' },
        2: { text: '菜单' },
        3: { text: '按钮' },
      },
      fieldProps: {
        buttonStyle: 'solid',
        onChange: (e) => {
          setType(e.target.value);
        },
      },
    },
    {
      title: '路由',
      dataIndex: 'route',
      valueType: 'text',
      hideInSearch: true,
      // 按钮类型不显示
      hideInForm: type === '3',
      formItemProps: {
        // note 设置表单的label
        label: (
          <>
            <span>路由</span>
            <Tooltip title={'路由必须以/开头'}>
              <QuestionCircleOutlined />
            </Tooltip>
          </>
        ),
        rules: [
          {
            required: true,
            message: '路由为必填项',
          },
          {
            pattern: /^\/.*/,
            message: '路由必须以/开头',
          },
        ],
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      hideInSearch: true,
      //   按钮类型不显示
      hideInForm: type === '3',
    },
    {
      title: '文件地址',
      dataIndex: 'filePath',
      valueType: 'text',
      hideInSearch: true,
      // 菜单类型显示
      hideInForm: type !== '2',
    },
    {
      title: '是否显示',
      dataIndex: 'show',
      valueType: 'switch',
      hideInSearch: true,
      hideInTable: true,
      // 菜单类型显示
      hideInForm: type !== '2',
      fieldProps: {
        checkedChildren: '显示',
        unCheckedChildren: '隐藏',
        defaultValue: true,
      },
    },
    {
      title: '权限代码',
      dataIndex: 'authCode',
      valueType: 'text',
      // 按钮类型显示
      hideInForm: type !== '3',
    },
    {
      title: '排序号',
      dataIndex: 'orderNumber',
      valueType: 'digit',
      // 按钮类型不显示
      hideInForm: type === '3',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '时间范围',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInForm: true,
      hideInDescriptions: true,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Link
            key={'add'}
            onClick={() => {
              handleModal({
                visible: true,
                type: 'addChildren',
              });
              setEditFormValues({
                id: record.id,
                type: '1',
              } as MenuInfo);
              recordRef.current = record;
            }}
          >
            添加
          </Link>
          <Divider type="vertical" />

          <Link
            key={'edit'}
            onClick={() => {
              handleModal({
                visible: true,
                type: 'edit',
              });
              setEditFormValues(record);
            }}
          >
            编辑
          </Link>
          <Divider type="vertical" />
          <Link key={'delete'} onClick={() => onDelete(record)}>
            删除
          </Link>
        </>
      ),
    },
  ];

  const expandHandle = async (expanded: boolean, record: MenuInfo) => {
    if (expanded) {
      const { data, code } = await getChildMenuList(record.id);
      if (code === 200) {
        record.children = data.map((item: MenuInfo) => {
          if (item.hasChild) {
            item.children = [];
          }
          return item;
        });
        setDataSource([...dataSource]);
        setExpandedRowKeys([...expandedRowKeys, record.id]);
      } else {
        message.error('获取子菜单失败');
      }
    }
  };

  return (
    <PageContainer
      header={{
        title: '菜单管理',
      }}
    >
      <ProTable<MenuInfo>
        headerTitle="菜单列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        // 设置展开属性
        expandable={{
          rowExpandable: () => true,
          onExpand: expandHandle,
          expandedRowKeys,
          onExpandedRowsChange: (rowKeys) => {
            setExpandedRowKeys(rowKeys);
          },
        }}
        // 刷新等操作
        options={{
          reload: () => {
            setRefresh(!refresh);
            setExpandedRowKeys([]);
          },
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
              setEditFormValues({
                // note 设置默认值
                type: '1',
              } as MenuInfo);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
        dataSource={dataSource}
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
        <ProTable<MenuInfo, MenuDto>
          loading={updateLoading || addLoading}
          onSubmit={onSubmit}
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
          <ProDescriptions<MenuInfo>
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

export default Menu;
