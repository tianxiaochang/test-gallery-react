require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


//引入数据文件
let imageDate = require('../data/imageData.json');

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

var ImgFigure = React.createClass({
// class ImgFigure extends React.Component{
  /*
   *ImgFigure的点击处理函数
   *
   */
  handleClick: function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },

  render() {

    let styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值且不为0，添加图片的角度
    if (this.props.arrange.rotate) {
      ['-moz-', '-ms-', ['-webkit-'], ''].forEach(function(value){
        styleObj[value + 'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));

    }

    if(this.props.arrange.isCenter){
      styleObj['zIndex'] = 11;
    }

    let imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

var getRangeRandom = function (low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0～30度的正负值
var get30DegRandom = function(){
  return (Math.random() > 0.5? "" : "-") + (Math.ceil(Math.random() * 30));
}


var AppComponent = React.createClass({
// class AppComponent extends React.Component {
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {  //水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topy: [0, 0]

    }
  },

  /*
   *翻转图片
   *@params index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   *return {Function} 这是一个闭包函数，其内return一个真正待被执行的的函数   了解闭包－－Javescript深入浅出的第7章
   */
   inverse: function(index){
     return function(){
       var imgsArrangeArr = this.state.imgsArrangeArr;

       imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

       console.log(imgsArrangeArr[index].isInverse);

       this.setState({
         imgsArrangeArr: imgsArrangeArr
       })
     }.bind(this);
   },

  /*
  * 重新布局所有图片
  * @param centerIndex 指定居中那个图片
  */
  rearrange: function(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topy,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random()*2),

        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    //首先居中centerIndex的图片，居中的图片centerIndex不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //获取上部分的图片布局信息
    imgsArrangeTopArr.forEach(function(value, index){
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });

    // 获取左右部分图片的布局信息
    for(let i=0, j=imgsArrangeArr.length, k = j/2;i<j;i++){
      var hPosRangeLORX = null;
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },

  /*
   *利用rerange函数，居中对应index的图片
   *@params index, 需要被居中的图片对应图片信息数组的index值
   *@return {Function}
   */
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },

  getInitialState: function(){
    return {
      imgsArrangeArr: [
        // {
        //   pos: {
        //     left: '0',
        //     top: '0'
        //   },
        //   rotate: 0,  //旋转角度
        //   isInverse: false,   //图片正反面，fale为正面，true为反面
        //   isCenter: false    //图片是否居中

        // }
      ]
    };
  },

  //组件加载后，为每张图片计算其位置的范围
  componentDidMount: function(){
    let stateDOM = ReactDOM.findDOMNode(this.refs.stage),
        stateW = stateDOM.scrollWidth,
        stateH = stateDOM.scrollHeight,
        halfStateW = Math.ceil(stateW/2),
        halfStateH = Math.ceil(stateH/2);

    //拿到一个ImgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    this.Constant.centerPos = {
      left: halfStateW - halfImgW,
      top: halfStateH - halfImgH
    }


    //计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStateW - halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStateW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stateW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stateH-halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topy[0] = -halfImgH;
    this.Constant.vPosRange.topy[1] = halfStateH - halfImgH*3;
    this.Constant.vPosRange.x[0] = halfStateW - imgW;
    this.Constant.vPosRange.x[1] = halfStateW;

    this.rearrange(0);
  },

  render() {

    var controllerUnits = [],
        ImgFigures = [];

    imageDate.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      ImgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav class="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

AppComponent.defaultProps = {
};

export default AppComponent;
