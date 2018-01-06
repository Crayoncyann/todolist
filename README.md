# 移动端 TodoList


- iphonePlus示例图

![mylist](todolist/screenshots/iphone6Plus-mylist.gif)


## 基本功能

1. todo 的添加
- 通过添加按钮打开输入页面, 没有输入时有提示词
- 点击其他区域关闭输入页面
2. todo 的删除
- 逐个删除: 左滑动显示删除按钮, 点击删除
- 批量删除: 点击菜单键, 显示操作界面, 批量操作删除
3. todo 的修改
- 长按文字 2s 以上，显示编辑界面
- 点击确定按钮提交, 更新 todo 信息
4. todo 的状态更新
- 未完成的置于上部，完成的置于下部
5. 没有 todo 时, 显示背景图~~颜文字~~


## 构造过程

1. 使用 *HTML5* 和 *CSS3* 编写静态页面
2. 基于 *Node.js* 和 *Express* 搭建后端
- 配置静态路径
- ~~配置 DB~~
- 配置路由(动态)
- 配置 API
- 配置地址(选择本地8000端口)
3. 使用 *JavaScript* 渲染页面
- 原生 JavaScript 封装 AJAX
- 获取数据并渲染
- 绑定事件(touch, move, animation 等)

- 使用的一些工具
1. 矢量图 [iconfont](http://www.iconfont.cn/)
2. Lodash [lodash](http://lodashjs.com/docs/)


## 使用方式

1. 安装 express 和 body-parser, 在项目路径运行
   > ```yarn add express```
   > ```yarn add body-parser```
   也可直接运行 yarn, 按照 package 自行安装
   > ```yarn install```
2. 运行 app 文件
   > ```node app.js```
   提示运行成功即可
3. 在浏览器中访问提示中的地址 localhost:8000
   使用开发者模式, 变更 device toolbar,  选择 iphone6 以上的 Plus 版本


其他版本待续 ...
