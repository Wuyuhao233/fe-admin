import { SocketMessageType } from '@/config/socket.config';
import { useAppSelector } from '@/store/hooks';
import { timestampToTime } from '@/utils/tools';
import { message, notification } from 'antd';
import { useEffect } from 'react';
// note 需要用type 来进行遍历
type MessageMap = {
  [key in SocketMessageType]?: (data?: any) => void;
};
const messageMap: MessageMap = {
  [SocketMessageType.USER_ONLINE]: (data: string) => {
    message.success(timestampToTime(Number(data)) + ' 上线了');
  },
  [SocketMessageType.UPLOAD_FILE_FINISHED]: (data: any) => {
    notification.open({
      description: `${data.filename}: ${timestampToTime(
        data.finishDate,
      )} 上传完成`,
      message: '上传成功',
      duration: 0,
    });
  },
  [SocketMessageType.UPLOAD_FILE_FAILED]: (data: any) => {
    notification.open({
      description: `${data.filename}: ${data.finishDate} 上传失败`,
      message: '上传失败',
      duration: 0,
    });
  },
};

const SocketHandler = () => {
  const latestMessage = useAppSelector((state) => state.socket.latestMessage);
  useEffect(() => {
    console.log('latestMessage: ', latestMessage);
    messageMap[latestMessage.type]?.(latestMessage.data);
  }, [latestMessage]);
  return null;
};
export default SocketHandler;
