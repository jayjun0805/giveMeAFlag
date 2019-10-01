// pages/index/index.js
const ctx = wx.createCanvasContext('upload-canvas');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 2,
    avatarUrl: null
  },
  
  nextTap: function(){

    let current = this.data.current;
    current += 1;
    if(current > 5)
    {
      current = 1;
    }

    this.setData({
      current
    })
  },

  prevTap: function () {
    let current = this.data.current;
    current -= 1;
    if (current <= 0) {
      current = 5;
    }

    this.setData({
      current
    })
  },

  getUserInfo: function(e){
    // console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok"){

      wx.setStorageSync("userInfo", e.detail.userInfo)

      let avatarUrl = e.detail.userInfo.avatarUrl.replace('/132', '/0');

      wx.downloadFile({
        url: avatarUrl,
        success: res => {
          if (res.statusCode === 200) {
            this.setData({
              avatarUrl: res.tempFilePath,
            })
          }
        }
      });
    }
  },

  saveImg: function () {
    // console.log(this.data.current);

    let currentSrc = "https://raw.githubusercontent.com/jayjun0805/giveMeAFlag/master/assets/images/head-"+this.data.current+".png";

    // console.log(currentSrc);

    wx.getImageInfo({
        src: currentSrc,
      　success: res => {
            console.log(res.path)
            ctx.drawImage(this.data.avatarUrl, 0, 0, 700, 700)
            ctx.drawImage(res.path, 0, 0, 700, 700);
            ctx.draw();
            setTimeout(()=>{
              this.canvasToTempFilePath();
            }, 2000)
            
        }
    })

  },

  _saveImageAlbum: function (filePath) {

    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2e3,
          mask: !0
        });

      },
      fail: () => {
        wx.showModal({
          title: '保存失败',
          content: '请打开授权，否则无法保存到相册。',
          confirmText: '去授权',
          success: (a) => {
            a.confirm && wx.openSetting({
              success: (a) => {
                a.authSetting['scope.writePhotosAlbum'];
              }
            });
          }
        });
      },
      complete: () => {
    
      }
    });

  },

  canvasToTempFilePath: function(){

    wx.canvasToTempFilePath({
      destWidth: 700,
      destHeight: 700,
      canvasId: 'upload-canvas',
      success: res => {
        // console.log(res.tempFilePath)
        this._saveImageAlbum(res.tempFilePath)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (res) => {
        if (res.model == 'iPhone X') {
          this.setData({
            isIphoneX: true
          })
        }
      }
    });

    try {
      let userInfo = wx.getStorageSync("userInfo");
      if (userInfo) {
        let avatarUrl = userInfo.avatarUrl.replace('/132', '/0');
        wx.downloadFile({
          url: avatarUrl,
          success: res => {
            if (res.statusCode === 200) {
              this.setData({
                avatarUrl: res.tempFilePath,
              })
            }
          }
        });
      }
    }
    catch (e) {
      this.setData({
        avatarUrl: null
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '亿万网友一起换头像欢庆新中国成立70周年，就差你了！',
      path: '/pages/index/index',
      imageUrl: '/assets/images/untitled.png'
    };
  }
})