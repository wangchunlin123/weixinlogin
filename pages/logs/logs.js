//logs.js
// const util = require('../../utils/util.js')

Page({
  data: {
    // logs: []
    wifilist:[],
    dialogShow:false,
    buttons: [{text: '取消'}, {text: '确定'}],
    wifiword:"",
    SSID:""
  },
  connectWifi: function () {
    var that = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        //2.初始化 Wi-Fi 模块
        that.startWifi();
      }
    })
  },
  //初始化 Wi-Fi 模块获取wifi列表
  startWifi: function () {
    let that=this;
    wx.authorize({
      scope: 'scope.userLocation',
      success () {
        console.log("定位成功");
        wx.startWifi({
          success (res) {
            console.log(res)
            wx.getWifiList(
              {
                success (res) {
                  console.log(res)
                  wx.onGetWifiList((wifiList)=>{
                    console.log(wifiList.wifiList)
                    that.setData({
                      wifilist: wifiList.wifiList
                    })
                  })
                },
                fail(eor){
                  console.log(eor)
                },
              }
            )
          },
          fail(eor){
            console.log(eor)
          },
        });
      }
    })
  },

  Connected: function (SSID,password) {
    console.log(SSID,password)
    var that = this
    wx.connectWifi({
      SSID: SSID,//wifi名
      BSSID: '',
      password: password,//wifi密码
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: 'wifi连接成功',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: 'wifi连接失败',
        })
      }
    })
  },
  clickwifi(e){
    this.setData({
      SSID:e.target.dataset.index,
    })
    this.setData({
      dialogShow:true,
    })
  },
  bindblur(e){
    this.setData({
      wifiword:e.detail.value
    })
  },
  tapDialogButton(e){
    if(e.detail.index==1){
      this.Connected(this.data.SSID,this.data.wifiword)
    }
    this.setData({
      dialogShow:false
    })
  },
  onLoad: function () {
    this.connectWifi()
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  }
})
