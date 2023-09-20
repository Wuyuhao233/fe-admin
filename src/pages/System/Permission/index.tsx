import {
  IFunction,
  functionController,
} from '@/pages/System/controller/function.controller';
import MenuController from '@/pages/System/controller/menu.controller';
import {
  CheckCard,
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProList,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import { useState } from 'react';
const { getApis } = MenuController;
const { getLevel1, getListById, addFunction } = functionController;
const Permission = () => {
  const [level1, setLevel1] = useState<IFunction[]>([]);
  const [level2, setLevel2] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [createLevel, setCreateLevel] = useState(1);
  const [curSelected, setCurSelected] = useState<IFunction>();
  const { refresh } = useRequest(getLevel1, {
    onSuccess: (res) => {
      if (res.code === 200) {
        setLevel1(res.data);
        if (res.data.length > 0) {
          setCurSelected(res.data[0]);
        }
      }
    },
  });
  const { refresh: refresh2 } = useRequest(
    () => getListById(curSelected?.id || ''),
    {
      refreshDeps: [curSelected?.id],
      onSuccess: (res) => {
        if (res.code === 200) {
          setLevel2(
            res.data.map((item) => ({
              title: item.name,
              actions: [<a key="add">授权</a>, <a key="delete">删除</a>],
              content: <div>{item.description}</div>,
            })),
          );
        }
      },
    },
  );
  console.log('level1', curSelected);
  return (
    <div className="flex w-fll pfull gap-2 ">
      <div className="w-1/4 h-full overflow-y-scroll">
        <CheckCard.Group
          defaultValue={curSelected?.id}
          value={curSelected?.id}
          onChange={(record) => {
            setCurSelected(level1.find((item) => item.id === record));
          }}
        >
          {level1.map((item) => (
            <CheckCard
              title={item.name}
              description={item.description}
              key={item.id}
              value={item.id}
              checked={curSelected?.id === item.id}
              onChange={(checked) => {
                if (checked) {
                  setCurSelected(item);
                }
              }}
              extra={[
                <Button size={'small'} type="link" key="add">
                  授权
                </Button>,
                <Button size={'small'} type={'link'} key="delete">
                  清空
                </Button>,
              ]}
            />
          ))}
        </CheckCard.Group>
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <div>
          <span>只显示已授予</span>
          <Button onClick={() => setOpen(true)}>添加</Button>
        </div>
        <ProList<any>
          pagination={false}
          showActions="hover"
          rowSelection={{}}
          grid={{ gutter: 16, column: 3 }}
          onItem={(record: any) => {
            return {
              onMouseEnter: () => {
                console.log(record);
              },
              onClick: () => {
                console.log(record);
              },
            };
          }}
          metas={{
            title: {},
            type: {},
            content: {},
            actions: {
              cardActionProps: 'extra',
            },
          }}
          dataSource={level2}
        />
      </div>
      {open && (
        <ModalForm
          title="新建表单"
          open={open}
          onFinish={async (value) => {
            if (value.apis) {
              //   {method,path}
              value.apis = value.apis.map((item: any) => {
                const [method, path] = item.split('~');
                return { method, path };
              });
            }
            const { code, msg } = await addFunction(value);
            if (code === 200) {
              message.success('提交成功');
              if (value.level === 1) {
                refresh();
              } else {
                refresh2();
              }
              return true;
            }
            message.error(msg);
            return false;
          }}
          onOpenChange={setOpen}
        >
          <ProFormText
            width="md"
            name="name"
            label="模块名称"
            placeholder="请输入模块名称"
          />
          <ProFormTextArea
            width="md"
            name="description"
            label="模块描述"
            placeholder="请输入模块描述"
          />
          <ProFormSelect
            name="level"
            width="md"
            fieldProps={{
              onChange: (value) => {
                setCreateLevel(value);
              },
            }}
            label={'模块级别'}
            options={[
              {
                label: '一级模块',
                value: 1,
              },
              {
                label: '二级模块',
                value: 2,
              },
            ]}
          />
          {createLevel === 2 && curSelected?.id && (
            <ProFormSelect
              width="md"
              name={'parentId'}
              label={'上级模块'}
              request={async () => {
                const { code, data } = await getLevel1();
                if (code === 200) {
                  return data.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  });
                }
                return [];
              }}
            />
          )}
          {createLevel === 2 && curSelected?.id && (
            <ProFormTreeSelect
              width="md"
              name={'apis'}
              label={'绑定接口'}
              fieldProps={{
                multiple: true,
                treeCheckable: true,
              }}
              request={async () => {
                const { code, data } = await getApis();
                if (code === 200) {
                  function modifyTree(node: any) {
                    node.value = node.method + '~' + node.title;
                    return node;
                  }
                  data.forEach((item) => {
                    if (item.children) {
                      item.children = item.children.map((ic) => {
                        return modifyTree(ic);
                      });
                    }
                    modifyTree(item);
                  });
                  return data;
                }
                return [];
              }}
            />
          )}
        </ModalForm>
      )}
    </div>
  );
};
export default Permission;
