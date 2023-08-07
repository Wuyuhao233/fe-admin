import { Button, ButtonProps } from 'antd';

export const MyButton: React.FC<ButtonProps> = (props) => {
  const {
    children,
    className = '!rounded-[8px]  !px-[12px]',
    shape = 'round',
    size = 'large',
    type = 'primary',
    ...rest
  } = props;
  return (
    <Button
      className={className}
      type={type}
      size={size}
      shape={shape}
      {...rest}
    >
      <div
        // note 为了让按钮中的文字和图标居中，使用flex布局
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {children}
      </div>
    </Button>
  );
};
