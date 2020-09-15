
// 七牛文件上传

import * as qiniu from 'qiniu-js'
import ajax from './ajax'

const domain = 'http://qg9y7v4lp.hn-bkt.clouddn.com/'

export function getToken () {
  return new Promise((resolve, reject) => {
    ajax.get('/qiniu/getToken', {
      token: gStatus.getToken()
    }).then(res => {
      let { code, msg, data } = res.data
      if (code === 200)
      {
        resolve(data.token)
      } else
      {
        reject({
          code,
          msg
        })
      }
    })
  })
}

export function upload ({
  file,
  name,
  token,
  type = 'image',
}) {
  return new Promise((resolve, reject) => {
    if (!file instanceof File)
    {
      return reject({
        code: 400,
        msg: '不是文件对象'
      })
    }
    // 加入时间戳防止重复上传文件失败的错误
    let ob = qiniu.upload(file, type + '/' + new Date().getTime() + name, token)
    ob.error = (err) => {
      reject({
        code: 401,
        msg: '上传失败，请核对token是否有误',
        error: err
      })
    }
    ob.complete = (e) => {
      resolve({
        code: 200,
        msg: '上传成功',
        url: domain + e.key,
        info: e,
      })
    }
    ob.subscribe(ob);
  })
}