import { ProFormText } from '@ant-design/pro-components';

type IProFormText = React.ComponentProps<typeof ProFormText>;
export const inputStyles: IProFormText['fieldProps'] = {
  size: 'large',
  style: { borderRadius: '10px' },
};
export const noSizeInputStyles: IProFormText['fieldProps'] = {
  style: { borderRadius: '8px' },
};
