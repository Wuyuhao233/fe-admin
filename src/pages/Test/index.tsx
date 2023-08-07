import { PlusOutlined } from '@ant-design/icons';

let Test: React.FC = () => {
  return (
    <div className={' fcr w-screen h-screen'}>
      <h1
        className={
          'w-1/4 h-1/4 border-2 border-blue-100 border-solid font-normal'
        }
      >
        <PlusOutlined />
      </h1>
    </div>
  );
};
export default Test;
