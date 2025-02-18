This is a front-end and back-end separated to-do application. The front end uses Vite + React + Tailwind CSS, and the back end uses Flask + PostgreSQL + JWT, all deployed on AWS.

Features
User Registration and Login (JWT Token)
To-Do Management (add, toggle completion status, delete)
Filtering (All, In Progress, Completed)
Progress Bar showing completion percentage

Tech Stack
Front End: Vite, Tailwind CSS, Heroicons
Back End: Flask, SQLAlchemy, PyJWT, bcrypt
Database: PostgreSQL
Deployment: AWS Elastic Beanstalk (back end) + AWS RDS (PostgreSQL) + S3/CloudFront or Amplify (front end)
Installation and Usage

FrontEnd
Go to the frontend directory.
Install dependencies:
npm install
Start the development server:
npm run dev
Access it at http://localhost:5173.

BackEnd
Go to the backend directory.
Install dependencies:
pip install -r requirements.txt
In development mode, run:
flask run
The server will start at http://127.0.0.1:5000.
Deployment
Back End: Package and upload to AWS Elastic Beanstalk (specifying gunicorn app:application), using AWS RDS for the database.
Front End: Run npm run build to generate static files, then upload them to S3/CloudFront, or use AWS Amplify for automated deployment.

这是一个前后端分离的待办事项应用，前端使用 Vite + React + Tailwind CSS，后端使用 Flask + PostgreSQL + JWT，并部署到 AWS 上。

功能
用户注册、登录（JWT Token）
待办事项管理（添加、切换完成状态、删除）
筛选（全部、进行中、已完成）
进度条，统计完成度

技术栈
前端：React (Vite)、Tailwind CSS、Heroicons
后端：Flask、SQLAlchemy、PyJWT、bcrypt
数据库：PostgreSQL
部署：AWS Elastic Beanstalk（后端） + AWS RDS（PostgreSQL） + S3/CloudFront 或 Amplify（前端）
安装与运行

前端
进入 frontend 目录
npm install 安装依赖
npm run dev 启动开发服务器，浏览器访问 http://localhost:5173

后端
进入 backend 目录
建议创建并激活虚拟环境
pip install -r requirements.txt 安装依赖
flask run（开发环境下）在 http://127.0.0.1:5000 启动

部署
后端：打包并上传到 AWS Elastic Beanstalk（使用 gunicorn app:application），数据库使用 AWS RDS
前端：npm run build 生成静态文件，再上传到 S3 并可用 CloudFront 加速，或使用 AWS Amplify 自动化部署
