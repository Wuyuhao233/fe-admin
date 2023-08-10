import { ISeries } from '@/declare/warehouse';
import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import CreateForm from '@/pages/System/components/CreateForm';
import ModuleController from '@/pages/Warehouse/module.controller';
import SeriesController from '@/pages/Warehouse/series/series.controller';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Pagination, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { getSeriesList, deleteSeriesById, updateSeries, addSeries } =
  SeriesController;
const { getModuleList } = ModuleController;
const { Link } = Typography;

const Series: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<ISeries>();
  const [selectedRowsState, setSelectedRows] = useState<ISeries[]>([]);
  const [editType, setEditType] = useState<'add' | 'edit'>('add');
  const { run: deleteSeries } = useReqWithMsg(
    deleteSeriesById,
    actionRef.current?.reload,
  );
  const { run: update, loading: updateLoading } = useReqWithMsg(
    updateSeries,
    actionRef.current?.reload,
  );
  const { run: addItem, loading: addLoading } = useReqWithMsg(
    addSeries,
    actionRef.current?.reload,
  );

  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<ISeries>();
  function closeModal() {
    handleModalVisible(false);
    setEditFormValues(undefined);
  }
  const columns: ProDescriptionsItemProps<ISeries, 'text' | 'select'>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // 不在表单中显示
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '类别名称',
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
      title: '类别描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      // TODO 动态，并且具有pageSize和current属性
      // note 初始值通过设定editFormValues来实现，注意具体的字段
      title: '模块',
      dataIndex: 'moduleId',
      valueType: 'select',
      renderText(_, record) {
        return record.module?.description;
      },
      params: {
        pageSize: 15,
        current: 1,
      },
      request: async (params) => {
        const { data } = await getModuleList({
          ...params,
        });
        return data.map((item) => ({
          label: item.description,
          value: item.id,
        }));
      },
      // note 对应FormItem的props
      formItemProps: {},

      /**
       * note 对应Select的props
       * 用作一个函数，返回一个对象
       * 如何去命中select的props呢？ 直接写即可
       */
      fieldProps: {
        placeholder: '请选择模块',
        //note 修改下拉框的位置
        dropdownRender: (original: React.ReactNode) => {
          return (
            <div>
              {original}
              <Pagination current={1} total={15} size={'small'} />
            </div>
          );
        },
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
              handleModalVisible(true);
              setEditFormValues({ ...record, moduleId: record.module?.id });
              setEditType('edit');
            }}
          >
            修改
          </Link>
          <Divider type="vertical" />
          <Link onClick={() => deleteSeries(record.id)}>删除</Link>
        </>
      ),
    },
  ];

  function addModule() {
    handleModalVisible(true);
    setEditFormValues(undefined);
    setEditType('add');
  }

  console.log('editFormValues', editFormValues);
  return (
    <PageContainer
      header={{
        title: '类别管理',
      }}
    >
      <ProTable<ISeries>
        headerTitle="类别列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key={'btn'} onClick={addModule}>
            添加类别
          </Button>,
        ]}
        request={async (params) => {
          const res = await getSeriesList({
            pageSize: params.pageSize || 15,
            current: params.current || 1,
          });
          console.log('querySeries...', res);
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
        <ProTable<ISeries, ISeries>
          loading={updateLoading || addLoading}
          onSubmit={async (value) => {
            if (editFormValues?.id) {
              value.id = editFormValues.id;
            }
            await (editType === 'add' ? addItem(value) : update(value));
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
          <ProDescriptions<ISeries>
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

export default Series;
