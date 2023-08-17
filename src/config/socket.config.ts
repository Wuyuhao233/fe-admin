export enum SocketMessageType {
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  PASSWORD_CHANGED = 'password_changed',
  UPLOAD_FILE_FINISHED = 'upload_file_finished',
  UPLOAD_FILE_FAILED = 'upload_file_failed',
  USER_MENU_CHANGED = 'user_menu_changed',
}
export interface SocketMessageDto {
  type: SocketMessageType;
  data: any;
}
/**
 * 根据消息类型获取消息
 * @param type
 */
export const getSocketMessage = (type: keyof typeof SocketMessageType) => {
  return SocketMessageType[type] || '未知消息';
};
