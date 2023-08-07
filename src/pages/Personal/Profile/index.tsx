import { useAppSelector } from '@/store/hooks';
import { ProDescriptions } from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import { useRef } from 'react';

export default () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const actionRef = useRef();
  console.log('current', actionRef.current);
  return (
    //    {/* note 设置布局*/}
    <ProDescriptions
      dataSource={userInfo}
      extra={<div>extra</div>}
      colon={false}
      column={1}
      // note 这是整个外框块的样式
      className={'p-3'}
      // 外部框的样式
      style={{}}
      // 每一行的样式
      labelStyle={{ margin: '10px 0' }}
      contentStyle={{ margin: '10px 0' }}
      actionRef={actionRef}
      // bordered
      formProps={{
        onClick: (e) => console.log('formProps-onClick', e),
        onValuesChange: (e, f) => console.log('formProps-onValuesChange', e, f),
        onMouseEnter: (e) => console.log('formProps-onMouseEnter', e),
      }}
      title="个人中心"
      // note 设置每一行的动作
      editable={{
        // 保存时的回调
        onSave: async (key, row) => {
          console.log('editable-onSave', key, row);
        },
      }}
      columns={[
        {
          title: '头像',
          key: 'avatar',
          dataIndex: 'avatar',
          valueType: 'avatar',
          fieldProps: {},
        },
        {
          title: '名字',
          key: 'text',
          dataIndex: 'name',
          editable: (text, record, index) => {
            console.log('editable', text, record, index);
            return true;
          },
        },
        {
          title: '入职时间',
          key: 'createTime',
          dataIndex: 'createTime',
          valueType: 'dateTime',
        },
        {
          title: 'money',
          key: 'money',
          dataIndex: 'money',
          valueType: 'money',
          render: (dom, entity, index, action) => {
            return (
              <Tooltip title="点击进入编辑状态">
                <div
                  onClick={() => {
                    action?.startEditable('money');
                  }}
                >
                  {dom}
                </div>
              </Tooltip>
            );
          },
        },
      ]}
    >
      <ProDescriptions.Item
        dataIndex="percent"
        label="百分比"
        valueType="percent"
      >
        100
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};
