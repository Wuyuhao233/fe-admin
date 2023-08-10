import { IComponent } from '@/declare/warehouse';
import { useReqWithMsg } from '@/hooks/useReqWithMsg';
import { useUpload } from '@/hooks/useUpload';
import CreateForm from '@/pages/System/components/CreateForm';
import ComponentController from '@/pages/Warehouse/ComponentPage/component.controller';
import ModuleController from '@/pages/Warehouse/module.controller';
import SeriesController from '@/pages/Warehouse/series/series.controller';

import { Icon } from '@@/exports';
import { UploadOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Typography, Upload } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import { isArray } from 'lodash';
import React, { useRef, useState } from 'react';

const { getComponentList, deleteComponentById, updateComponent, addComponent } =
  ComponentController;
const { Link } = Typography;

const ComponentPage: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<IComponent>();
  const [selectedRowsState, setSelectedRows] = useState<IComponent[]>([]);
  const [editType, setEditType] = useState<'add' | 'edit'>('add');
  const { run: deleteComponent } = useReqWithMsg(
    deleteComponentById,
    actionRef.current?.reload,
  );
  const { run: update, loading: updateLoading } = useReqWithMsg(
    updateComponent,
    actionRef.current?.reload,
  );
  const { run: addItem, loading: addLoading } = useReqWithMsg(
    addComponent,
    actionRef.current?.reload,
  );

  // 编辑表单的初始化
  const [editFormValues, setEditFormValues] = useState<IComponent>();
  const { run } = useUpload();

  function closeModal() {
    handleModalVisible(false);
    setEditFormValues(undefined);
  }
  const fileRemove: UploadProps['onRemove'] = (file) => {
    console.log('fileRemove', file);
    return true;
  };
  // note 如果没有执行回调函数，那么progress就会一直loading
  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onProgress,
  }) => {
    if (file instanceof File) {
      await run({
        data: file,
        fileName: file.name,
        uploadProgress: onProgress,
        onSuccess: onSuccess,
      });
    }
  };
  const columns: ProDescriptionsItemProps<IComponent>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      // 不在表单中显示
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '物料名称',
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
      title: '物料描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      // note 这个要和后端的字段对应
      dataIndex: 'moduleId',
      title: '模块',
      valueType: 'select',
      render(text, record) {
        return record.module?.description;
      },
      request: async () => {
        const responseMsg = await ModuleController.getModuleList({
          pageSize: 100,
          current: 1,
        });
        return responseMsg.data.map((item) => {
          return {
            label: item.description,
            value: item.id,
          };
        });
      },
    },
    {
      title: '类型',
      dataIndex: 'seriesId',
      valueType: 'select',
      render(text, record) {
        return record.series?.name;
      },
      params: {
        pageSize: 100,
        current: 1,
      },
      request: async (params) => {
        const responseMsg = await SeriesController.getSeriesList(params);
        return responseMsg.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      },
    },
    {
      title: '尺寸',
      key: 'size',
      dataIndex: 'size',
      valueType: 'text',
      render: (text, record) => {
        return `${record.length}x${record.width}x${record.high}`;
      },
      fieldProps: {
        placeholder: '请输入尺寸,格式为长/宽/高',
      },
    },
    {
      title: '重量',
      dataIndex: 'weight',
      valueType: 'digit',
      hideInSearch: true,
      render: (text, record) => {
        return `${record.weight}kg`;
      },
      fieldProps: {
        precision: 2,
        min: 0,
        suffix: 'kg',
      },
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      hideInSearch: true,
      renderFormItem: () => {
        return (
          <Upload
            multiple={true}
            customRequest={customRequest}
            // beforeUpload={beforeUpload}
            onRemove={fileRemove}
            progress={{
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
              },
              strokeWidth: 3,
              format: (percent) => `${parseFloat((percent || 0).toFixed(2))}%`,
            }}
          >
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>
        );
      },
      render: (_, record) => {
        if (isArray(record.attachment) && record.attachment.length > 0) {
          return (
            <Icon
              className=" cursor-pointer "
              fontSize={20}
              icon="ant-design:paper-clip-outlined"
            />
          );
        }
        return;
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
              const { module, series, width, high, length } = record;

              handleModalVisible(true);
              setEditFormValues({
                ...record,
                moduleId: module?.id,
                seriesId: series?.id,
                size: `${length}/${width}/${high}`,
              });
              setEditType('edit');
            }}
          >
            修改
          </Link>
          <Divider type="vertical" />
          <Link onClick={() => deleteComponent(record.id)}>删除</Link>
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
        title: '物料管理',
      }}
    >
      <ProTable<IComponent>
        headerTitle="物料列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key={'btn'} onClick={addModule}>
            添加物料
          </Button>,
        ]}
        request={async (params) => {
          const res = await getComponentList({
            pageSize: params.pageSize || 15,
            current: params.current || 1,
          });
          console.log('queryComponent...', res);
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
        <ProTable<IComponent, IComponent>
          loading={updateLoading || addLoading}
          onSubmit={async (value) => {
            console.log('value', value);
            if (editFormValues?.id) {
              value.id = editFormValues.id;
            }
            if (isArray(value.attachment)) {
              console.log('value.attachment', value.attachment);
            } else {
              value.attachment = value.attachment.fileList.map((item) => {
                return item.response;
              });
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
            style: { width: '100%' },
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
          <ProDescriptions<IComponent>
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

export default ComponentPage;
