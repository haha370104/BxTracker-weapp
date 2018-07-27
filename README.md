# What's this ???

一个用于微信小程序的自定义数据打点工具库，并提供了如下特性：

* 多个数据点的合并发送，并且可自定义每个请求最小/最多的数据包的量
* 支持自定义网络请求方法的注入
* 友好的重试机制
* 请求顺序发出
* 支持通过yarn/npm引入Ts、js或者复制粘贴引入
* 可采用默认基座数据/无基座数据

另外，此工具 **默认不开启** 侵入性的通过劫持重写Page中onShow方法的pv自动打点。但可以手动开启（需要在App onLoad之前调用）

# How To Use 

* yarn 引入

  ```shell
  yarn add weapp-tracker
  ```

* npm 引入

  ```shell
  npm i weapp-tracker --save
  ```

* 手动复制粘贴

  复制dist/weapp-tracker.js文件到小程序开发目录

# Documentation

此工具提供两个打点工具类，分别为BxTracker和Tracker，区别如下

* BxTracker提供默认基座，如wx.getSystemInfo中的内容以及网络类型，数据格式兼容神策小程序SDK。且在系统信息获取完毕之前阻塞所有数据点的打出，直到数据准备完毕
* Tracker默认只带有distinct_id一个字段



使用

* 初始化

  在小程序App.onLaunch之前调用

  ``` javascript
  // es2015
  import { BxTracker } from 'weapp-tracker';
  // CommonJs
  const BxTracker = require("weapp-tracker").BxTracker;
  
  BxTracker.configure(config);
  BxTracker.sharedInstance().setGlobalProperties(globalData);
  
  // 如需劫持page.onShow方法实现自动记录pv，则调用如下方法
  BxTracker.sharedInstance().enableAutoPageViewEvent(page => {
      return {
          message: '',
          detail: {},
      }
  });
  ```

  其中，config格式如下

  ```typescript
  interface TrackerConfig {
    // 服务器地址
    serverURL: string
  
    // track有多少条之后会上传
    patchCount?: number
  
    // 每个请求最多的track条数
    maxNumberOfTrackInRequest?: number
  
    // 自定义的request方法
    customRequest?: CustomRequest
  
    // 用户已经标示的ID
    distinctID?: string
  
    // 两次请求间隔(第一个请求结束到第二个请求开始)时间, 单位毫秒
    requestInterval?: number
  }
  ```

  globalData可以为一个Object，或者一个返回Object的闭包

* 使用

  ``` javascript
  // es2015
  import { BxTracker } from 'weapp-tracker';
  // CommonJs
  const BxTracker = require("weapp-tracker").BxTracker;
  
  BxTracker.sharedInstance().trackMessage('message', {
        ...detail
  });
  ```

# This is a total piece of SHIT !!!

您先试试提个issue过来让我试着改改？

OS：不我觉得这个傻x作者肯定改不好/我等不及/我知道哪里错了我马上就能改好



您不妨自己fork下来改一下……？流程如下：

* fork project

* git clone `your git web url`

* cd BxTracker-weapp

* yarn install

* 对着src里面的ts文件就是一通骚操作

* yarn build

* git commit -m ~~原作者是个傻x，我在帮他擦屁股~~

* git push ~~--force~~

* 看一下自己的引用方式

  * 使用npm/yarn等包管理器？

    * 把你自己项目引用的weapp-trakcer地址指向自己的git链接，并运行包管理器的更新指令
  * 直接复制粘贴了dist/weapp-tracker.js文件？
    * 把新生成的dist/weapp-tracker.js文件替换掉原来文件

* 然后劳烦您不妨给我顺便提个pr？感激不尽