# 部署说明

## 如何下载代码

1. 首先点击->[Github](https://github.com/Sangzican/wechat.git)进入Github中本小程序代码仓库

2. 之后点击绿色的<kbd>Code</kbd>按钮进行下载

3. 也可以使用git命令下载，下载链接：https://github.com/Sangzican/wechat.git

## 如何将代码导入到开发者工具

1. 打开微信开发者工具，点击左上角项目，选中导入项目

2. 输入项目名称、appid，目录位置选为代码所在文件夹

3. 最后点击导入即可

## 哪些参数需要修改

目前版本暂无需要修改的参数，唯一需要注意到是project.config.json中的appid需要和导入时的appid相同。

## 哪些云函数需要部署

- addCollicton
- changeUserType
- getAroundMarkers
- getCollection
- getCollectionList
- getMarkById
- getMarkByUser
- getMarkByTitle
- getopenid
- getshujuku
- login
- openid
- removeUser
- serch
- uploadMarker

## 涉及到的外部服务

暂无

## 云数据库中需要创建哪些数据

暂无，用户第一次进入时会自动创建

## 云存储中需要上传哪些文件

初始时无需上传文件。用户使用时会上传摊点图片至存储中的markers_img

## 后台需要配置哪些服务

暂无