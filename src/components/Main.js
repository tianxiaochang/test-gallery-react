require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//引入数据文件
let imageDate = require('../data/imageDate');

//自动执行把图片数据的名字转化为文件路径名
imageDate = (function(imageArr){
  for (let i = 0; i < imageArr.length; i++) {
    let singleImageData = imageArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.filename);
    imageArr[i] = singleImageData;
  }
  return imageArr;
})(imageDate);

// let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <span>hello word</span>
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
