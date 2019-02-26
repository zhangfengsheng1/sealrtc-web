(function (dependencies) {
  var win = dependencies.win,
    RongIMLib = dependencies.RongIMLib,
    RongIMClient = RongIMLib.RongIMClient;
  win.RongSeal = win.RongSeal || {};

  function connect(params, callbacks) {
    var appKey = params.appKey,
      token = params.token,
      navi = params.navi,
      api = params.api,
      protobuf = params.protobuf;

    var config = {};
    if (navi) {
      config.navi = navi;
    }
    if (api) {
      config.api = api;
    }
    if (protobuf) {
      config.protobuf = protobuf;
    }

    RongIMClient.init(appKey, null, config);

    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
        case RongIMLib.ConnectionStatus['CONNECTED']:
        case 0:
          break;
        case RongIMLib.ConnectionStatus['CONNECTING']:
        case 1:
          console.log('连接中');
          break;
        case RongIMLib.ConnectionStatus['DISCONNECTED']:
        case 2:
          console.log('当前用户主动断开链接');
          break;

        case RongIMLib.ConnectionStatus['NETWORK_UNAVAILABLE']:
        case 3:
          console.log('网络不可用');
          break;

        case RongIMLib.ConnectionStatus['CONNECTION_CLOSED']:
        case 4:
          console.log('未知原因，连接关闭');
          break;

        case RongIMLib.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
        case 6:
          console.log('用户账户在其他设备登录，本机会被踢掉线');
          break;

        case RongIMLib.ConnectionStatus['DOMAIN_INCORRECT']:
        case 12:
          console.log('当前运行域名错误，请检查安全域名配置');
          break;
        }
      }
    });

    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        console.log('receive message', message);
      }
    });

    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        console.log('连接成功', userId);
        callbacks.connected && callbacks.connected();
      },
      onTokenIncorrect: function () {
        console.log('token 无效');
      },
      onError: function (errorCode) {
        console.log('connect error', errorCode);
      }
    }, params.userId);
  }

  function getRTCToken() {
    // var instance = RongIMClient.getInstance();
    return new Promise(function (resolve) {
      resolve();
      // instance.getAgoraDynamicKey(3, channelId, {
      //   onSuccess: function (content) {
      //     resolve(content.dynamicKey);
      //   },
      //   onError: function (error) {
      //     reject(error);
      //   }
      // });
    });
  }

  win.RongSeal.im = {
    connect: connect,
    getRTCToken: getRTCToken
  };

})({
  win: window,
  RongIMLib: window.RongIMLib
});