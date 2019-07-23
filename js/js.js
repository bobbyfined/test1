$(function () {
    //1.监听游戏规则的点击事件
    $(".rules").click(function () {
        $(".rule").stop().show(1000)
    })
    //2.监听关闭按钮的点击事件
    $(".close").click(function () {
        $(".rule").stop().hide(1000)
    })
    //3监听开始游戏按钮的点击事件
    $(".start").click(function () {
        $(".start").stop().fadeOut(100);
        //调用处理进进度条的方法
        progressHandler();
        //调用灰太狼动画的方法
        startWolfAnimation();
    })
    //4.监听重新开始按钮的点击事件
    $(".restart").click(function () {
        $(".mask").stop().fadeOut();
        //调用处理进度条的方法
        progressHandler()
        //处理重新开始后，灰太狼动画的方法
        startWolfAnimation();
        //重新开始的时候分数要归零
        $(".score").text(0);
    });
    function progressHandler() {
        //重新设置进度条宽度
        $(".progress").css({
            width:180
        })
        //使用定时器处理进度条宽度
        var timer = setInterval(function () {
            /*
            （1）.当这个进度条的长度放在定时器里面的时候，下面有个进度条的长度随分数变化的代码，要写成如下所示的那个样子，
            （2）若进度条的长度放在定时器外面，即window.$progressWidth，那么下面的代码只需写成
                if(flag){window.$progressWidth+=10}else{window.$progressWidth-=10}即可。
            因为（1）情况下，是先开启了定时器，然后再拿到定时器的长度，即定时器的长度是不断更新的。如果下面的代码不变，
            而将var $progressWidth=$(".progress").width();放在定时器上面的话，就是说先拿到定时器的长度，然后开启定时器，
            下面的代码 $(".progress").css({ width: $(".progress").width()+10})是改变定时器的值，而不是$progressWidth
            的值，所以会出现视觉上猛的一增长，但也会瞬间恢复原长的视觉效果，在根本上不起作用。
            * */
            //拿到当前进度条宽度
            var $progressWidth = $(".progress").width();
            //减少当前进度条宽度
            $progressWidth -= 1;
            //重新给当前进度条赋值
            $(".progress").css({
                width: $progressWidth
            })
            //监听当前进度条是否走完
            if ($progressWidth <= 0){
                //清空定时器
                clearInterval(timer);
                //显示重新开始画面
                $(".mask").stop().fadeIn(100)
                //停止灰太狼的动画
                stopWolfAnimation();
            }
        },100)
    }
    var wolfTimer;
    function startWolfAnimation() {
        //定义两个数组保存所有灰太狼和小灰灰图片
        var wolf_1 = ['../image/h0.png','../image/h1.png',
            '../image/h2.png','../image/h3.png',
            '../image/h4.png','../image/h5.png',
            '../image/h6.png','../image/h7.png',
            '../image/h8.png','../image/h9.png'];
        var wolf_2 = ['../image/x0.png','../image/x1.png',
            '../image/x2.png','../image/x3.png',
            '../image/x4.png','../image/x5.png',
            '../image/x6.png','../image/x7.png',
            '../image/x8.png','../image/x9.png'];
        //2.定义一个数组保存所有可能出现的位置
        var arrPos = [
            {left:"100px",top:"115px"},
            {left:"20px",top:"160px"},
            {left:"190px",top:"142px"},
            {left:"105px",top:"193px"},
            {left:"19px",top:"221px"},
            {left:"202px",top:"212px"},
            {left:"120px",top:"275px"},
            {left:"30px",top:"295px"},
            {left:"209px",top:"297px"},
        ];
        //创建一张图片
        var $wolfImage = $("<img src='',class='wolfImage'>");
        //随机获取图片的位置
        var posIndex = Math.round(Math.random()*8);
        //设置图片的显示位置
        $wolfImage.css({
            position:"absolute",
            left:arrPos[posIndex].left,
            top:arrPos[posIndex].top
         });
        //随机获取数组类型（灰太狼或者小灰灰）
        var wolfType = Math.round(Math.random()) == 0 ? wolf_1 : wolf_2;
        //设置图片内容
        window.wolfIndex = 0;
        window.wolfIndexEnd = 5;
        wolfTimer = setInterval(function () {
            if(wolfIndex > wolfIndexEnd){
                $wolfImage.remove();
                clearInterval(wolfTimer);
                startWolfAnimation();
            }
            $wolfImage.attr("src",wolfType[wolfIndex] );
            wolfIndex++;
        },150)
        //将图片添加到界面上
        $(".container").append($wolfImage);

        //调用处理游戏规则的方法
        gameRules($wolfImage);
    }
    function stopWolfAnimation() {
        $(".wolfImage").remove();
        clearInterval(wolfTimer);
    }
    function gameRules($wolfImage) {
        $wolfImage.one("click", function () {
            //修改startWolfAnimate中设置图片内容的索引
            window.wolfIndex = 5;
            window.wolfIndexEnd = 9;
            //拿到当前点击图片的地址
            var $src = $(this).attr("src");
            //根据图片地址判断是否是灰太狼
            var flag = $src.indexOf("h") >= 0;
            //根据点击的图片类型增减分数
            if(flag){
                //+10
                $(".score").text(parseInt($(".score").text()) + 10);
            }else{
                //-10
                $(".score").text(parseInt($(".score").text()) - 10);
            }
        })
    }
})