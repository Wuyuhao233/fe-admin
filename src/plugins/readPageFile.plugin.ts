import { IApi } from '@umijs/max';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 读取pages下的文件，生成路径
 * note plugin -- 插件
 * @param api
 */
export default (api: IApi) => {
  api.onStart(() => {
    let componentPaths: string[] = [];
    const pagePath = path.join(__dirname, '../pages');
    function readDirSync(dirPath: string) {
      const files = fs.readdirSync(dirPath);
      files.forEach((item) => {
        const filePath = path.join(dirPath, item);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          readDirSync(filePath);
        } else {
          // 将和page 的相对路径存储起来
          const p = filePath.replace(pagePath, '').split(path.sep).join('/');
          if (p.endsWith('index.js')) {
            componentPaths.push(p);
          }
        }
      });
    }
    readDirSync(pagePath);
    // 写在config下的pathName.ts文件中
    fs.writeFileSync(
      path.join(__dirname, '../config/pathName.ts'),
      `export const pathName = ${JSON.stringify(componentPaths)};`,
    );
  });
  api.describe({
    key: 'readPageFile',
    config: {
      onChange: api.ConfigChangeType.reload,
    },
    enableBy: api.EnableBy.register,
  });
};
