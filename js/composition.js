//前提条件
const canvas = document.getElementById('Gameboard');	//找到画布
const ctx = canvas.getContext('2d');					//创建二维平面
let raf;
const image = new Image(); 				//引入背景图片
image.src = "images/Background.jpg";	//背景图片地址

//画图与自适应结合
//画图参考：https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
function drawImageActualSize() {
	//将图片大小与画布大小适配
	image.width = canvas.width;
	image.height = canvas.height;
	//以当前画布大小绘制图片
	ctx.drawImage(image, 0, 0, image.width, image.height);
}

//自适应窗口
function SelfFittingWindow(){
	const contentWidth = window.innerWidth*0.8;
	canvas.width = contentWidth;
	/*未知问题：使用document.getElementById('content').clientHeight
	  会导致改变窗口宽度、不改变窗口高度反而改变了canvas高度*/
	const contentHeight = window.innerHeight;	
	//用window.innerHeight避免上述问题的产生
	canvas.height = (contentHeight-200);	
	//-200用于避免由于标题占用空间导致产生滚动条
	image.onload = drawImageActualSize; //加载图片后画出图片
};

//进行窗口自适应
SelfFittingWindow();

//!!!类的运用!!!
class block {
	x = 0;						//x坐标
	y = 0;						//y坐标
	IsGenerate = 0;				//是否生成/下底
	width = canvas.width/4;		//方块宽度
	height = canvas.height/5;	//方块高度
	track = 0;					//方块所在道线
	//一般情况下的绘制
	draw() {
		//未生成时
		if(this.IsGenerate === 0){
			this.track = Math.round(Math.random() * 3);		//随机生成道线
			this.x = this.width * this.track;				//道线对应坐标
			this.IsGenerate = block1						//方块随机生成完毕
		}if(this.y > this.height*4){						//下底
			this.IsGenerate = 0;							//重新生成（x坐标重置）
			this.y = 0;										//y坐标重置
		}
		ctx.fillRect(this.x, this.y, this.width, this.height);	//绘制方块
	}
	//失败之后重置界面
	reset(){
		this.IsGenerate = 0;
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
};

//block类型下五个变量——五个用于玩的方块
let block1 = new block();
let block2 = new block();
let block3 = new block();
let block4 = new block();
let block5 = new block();

//设置几个方块的初始y位置
block2.y = block2.height;
block3.y = block3.height*2;
block4.y = block4.height*3;
block5.y = block5.height*4;

let score = 0;			//游戏分数

const dest = block1.height*4;	//终点高度

//函数部分

//画线/道————放置于body
function DrawBackboard() {
	ctx.lineWidth = 1
	ctx.beginPath();
	//纵向线条
	ctx.moveTo(canvas.width/4, 0);
	ctx.lineTo(canvas.width/4, canvas.height);
	ctx.moveTo(canvas.width/2, 0);
	ctx.lineTo(canvas.width/2, canvas.height);
	ctx.moveTo(canvas.width/4*3, 0);
	ctx.lineTo(canvas.width/4*3, canvas.height);
	//横向线条
	ctx.moveTo(0, canvas.height/5);
	ctx.lineTo(canvas.width, canvas.height/5);
	ctx.moveTo(0, canvas.height/5*2);
	ctx.lineTo(canvas.width, canvas.height/5*2);
	ctx.moveTo(0, canvas.height/5*3);
	ctx.lineTo(canvas.width, canvas.height/5*3);
	ctx.moveTo(0, canvas.height/5*4);
	ctx.lineTo(canvas.width, canvas.height/5*4);
	ctx.closePath();
	ctx.stroke();
};

//参考https://www.jianshu.com/p/fa5512dfb4f5
//requestAnimationFrame效果
(function animloop() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(image, 0, 0, image.width, image.height);
	DrawBackboard();	//补上擦去背景后的道线
 	block1.draw();		//画出更新位置后的方块
 	block2.draw();		//画出更新位置后的方块
 	block3.draw();		//画出更新位置后的方块
 	block4.draw();		//画出更新位置后的方块
 	block5.draw();		//画出更新位置后的方块

    requestAnimationFrame(animloop);
})()

//游戏操作部分

//检测按键对应的轨道上是否有黑块
function CheckClick(block, num){
	if(block.y > dest){		//方块下底
		if(num == block.x / block.width){		//按键正确
			block.y = 0;			//重置y
			block.IsGenerate = 0;	//重置x
			score += 1;				//加分
			document.getElementById("score").textContent = score;	//分数更新
		}
		else{	//按键错误
			alert("Game Over!");	//寄了——
			score = 0;				//分数清零
			document.getElementById("score").textContent = score;	//分数更新
 			block1.reset();			//重置方块位置
 			block2.reset();			//重置方块位置
 			block3.reset();			//重置方块位置
 			block4.reset();			//重置方块位置
 			block5.reset();			//重置方块位置
		}
	}
}

//监测输入
window.addEventListener("keydown", (event) => {
	if (event.defaultPrevented) {
		return; //事件处理后无操作
	}

	switch (event.key) {
		//第一条轨道
		case "s": 
			block1.y += block1.height;	//更新位置
			block2.y += block1.height;	//更新位置
			block3.y += block1.height;	//更新位置
			block4.y += block1.height;	//更新位置
			block5.y += block1.height;	//更新位置
			CheckClick(block1, 0);		//检查按键
			CheckClick(block2, 0);		//检查按键
			CheckClick(block3, 0);		//检查按键
			CheckClick(block4, 0);		//检查按键
			CheckClick(block5, 0);		//检查按键
			break;
		//第二条轨道
		case "d":
			block1.y += block1.height;	//更新位置
			block2.y += block1.height;	//更新位置
			block3.y += block1.height;	//更新位置
			block4.y += block1.height;	//更新位置
			block5.y += block1.height;	//更新位置
			CheckClick(block1, 1);		//检查按键
			CheckClick(block2, 1);		//检查按键
			CheckClick(block3, 1);		//检查按键
			CheckClick(block4, 1);		//检查按键
			CheckClick(block5, 1);		//检查按键
			break;
		//第三条轨道
		case "j":
			block1.y += block1.height;	//更新位置
			block2.y += block1.height;	//更新位置
			block3.y += block1.height;	//更新位置
			block4.y += block1.height;	//更新位置
			block5.y += block1.height;	//更新位置
			CheckClick(block1, 2);		//检查按键
			CheckClick(block2, 2);		//检查按键
			CheckClick(block3, 2);		//检查按键
			CheckClick(block4, 2);		//检查按键
			CheckClick(block5, 2);		//检查按键
			break;
		//第四条轨道
		case "k":
			block1.y += block1.height;	//更新位置
			block2.y += block1.height;	//更新位置
			block3.y += block1.height;	//更新位置
			block4.y += block1.height;	//更新位置
			block5.y += block1.height;	//更新位置
			CheckClick(block1, 3);		//检查按键
			CheckClick(block2, 3);		//检查按键
			CheckClick(block3, 3);		//检查按键
			CheckClick(block4, 3);		//检查按键
			CheckClick(block5, 3);		//检查按键
			break;
		default:
			return;
	}
	//取消默认动作，避免判定两次
	event.preventDefault();
}, true);
