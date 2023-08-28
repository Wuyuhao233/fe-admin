 ! /bin/sh -e

cat >> /etc/nginx/conf.d/default.conf <<EOF


  server{
         listen       80;
          listen  [::]:80;
          server_name  localhost;
          #access_log  /var/log/nginx/host.access.log  main;

        root /app/www;
        location /ff{
                rewrite ^/ff(.*)$ $1 break;
                add_header Content-Type application/json;
                proxy_pass http://42.193.237.23:3333;
                proxy_set_header Host \$host;
                proxy_set_header X-Real-IP \$remote_addr;
                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }

        location ^~/{
                alias /app/www/;
                index index.html;
                add_header Content-Type text/html;
        }
  }
    server{
          listen       3001;
          listen  [::]:3001;
          server_name  localhost2;
          #access_log  /var/log/nginx/host.access.log  main;

          root /app/www;
           location /abc {
                          alias /app/www/;
                          index test.html;
                          add_header Content-Type text/html;
            }
          location /ff{
                  rewrite ^/ff(.*)$ $1 break;
                  add_header Content-Type application/json;
                  proxy_pass http://42.193.237.23:3333;
                  proxy_set_header Host \$host;
                  proxy_set_header X-Real-IP \$remote_addr;
                  proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
          }

          location ^~/{
                  try_files \$uri \$uri /index.html;
                 add_header Content-Type text/html;
          }
    }
EOF
 
 echo "starting web server"
 
 nginx -g 'daemon off;'       