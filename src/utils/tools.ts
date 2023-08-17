import { Modal } from 'antd';
import dayjs from 'dayjs';
const { confirm } = Modal;
/**
 * 时间戳转YYYY-MM-DD HH:mm:ss
 */
export const timestampToTime = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};
/**
 * easyConfirm
 *
 */
export const easyConfirm = (title: string, content: string) => {
  return new Promise((resolve, reject) => {
    confirm({
      title,
      content,
      okText: '确认',
      cancelText: '取消',
      onCancel: () => {
        return reject('cancel');
      },
      onOk: () => {
        return resolve('ok');
      },
    });
  });
};
interface Node {
  id: string;
  parentId: string | null;
  children?: Node[];
  icon?: string | JSX.Element;
}
/**
 *
 * @param data
 * @param id
 */
export function findParent<T extends Node>(data: T[], id: string) {
  function searchTree(node: any, targetId: string) {
    if (node.id === targetId) {
      return true; // 找到匹配的 ID，返回 true
    }

    for (let i = 0; i < node.children?.length || 0; i++) {
      const child = node.children[i];
      if (searchTree(child, targetId)) {
        return true; // 在子节点中找到匹配的 ID，返回 true
      }
    }

    return false; // 没有找到匹配的 ID，返回 false
  }
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (searchTree(node, id)) {
      return node;
    }
  }
  return null;
}

/**
 * 构建树
 * @param data
 */
export const buildTree = <T extends Node>(data: T[]) => {
  // parentId -- map
  const map = new Map<string, T>();
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    /**
     * map中有父节点
     * 1. map中有父节点，直接添加到父节点的children中
     * 2. map中有父节点，但是没有children，创建children，添加到父节点的children中
     * 3. map中没有父节点，创建父节点，添加到父节点的children中
     *
     */
    if (item.parentId) {
      const parent = map.get(item.parentId);
      if (parent) {
        if (parent.children) {
          parent.children.push(item);
        } else {
          parent.children = [item];
        }
      } else {
        map.set(item.parentId, {
          children: [item],
        } as any);
      }
    }
    // 子节点先被遍历到，创建了父节点的children
    if (map.has(item.id)) {
      const pre = map.get(item.id);
      if (pre) {
        item.children = pre.children;
      }
    }
    map.set(item.id, item);
  }
};
