FROM gplane/pnpm:latest as builder

WORKDIR /data/web

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine as nginx

WORKDIR /data/web
RUN mkdir -p /app/www
#将打包后的文件复制到nginx容器中
COPY --from=builder /data/web/dist /app/www

# 暴露 80端口和443端口，因为我们服务监听的端口就是80，443端口是为了支持https。
EXPOSE 80
EXPOSE 443
EXPOSE 3001
# 如果镜像中有nginx配置，先给删了
RUN rm -rf /etc/nginx/conf.d/default.conf
# 把项目里的./nginx/config.sh shell脚本复制到ngxin镜像/root文件夹下
COPY ./nginx/config.sh /root
# 给刚复制进去的shell脚本设置权限，让镜像启动的时候可以正常运行这个shell脚本。
RUN chmod +x /root/config.sh
# 镜像启动的时候运行config.sh脚本
CMD ["/root/config.sh"]