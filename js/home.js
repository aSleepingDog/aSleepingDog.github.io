const contextMap = {
    "C/C++": `            
<div class="technology_paragraph">
目前写的比较多的编程语言，感觉能学的东西比较多，而且能实现很多东西。一开始在学校里学的C，然后根据自己的兴趣学习了C++。选择了密码学的部分算法和整体组织来学习C++的特性。目前写过简单的高精度库，密码学库，Json解析器和TCP/HTTP服务器。
</div>
<div class="technology_paragraph">
而且写C++有种真正感觉在控制内存和硬件的感觉，写出来的话很有成就感（当然用的时候也有一点警惕感，怕玩崩溃了）
</div>`,
    "Java":`
<div class="technology_paragraph">
最早体系学习的语言，一开始在学校学的，后来（被忽悠）在外面又去培训了两年。主要还是学Spring，SpringBoot那一套，OEM主要是MyBatis，MyBatis-plus。后面也是学了个ruoyi的框架那套。
</div>
<div class="technology_paragraph">
最早在学校写的是纯JavaEE的网络聊天室，后面就是各种基于ruoyi的管理系统了。不过极致的OOP和错综复杂的包关系让我不太想写了。现在回来再写还得查查再写。
</div>
    `,
    "Python":`
<div class="technology_paragraph">
最早学的语言，是在高中阶段学的（主要是学考的），后来拿去过了一个计算机二级考试。现在主要是当脚本语言在写，平时写得也不多。除非其他语言写起来比较麻烦的小工具才会用python写。
</div>
<div class="technology_paragraph">
写C系的语言写多了之后反而不喜欢强制游标卡尺缩进了，动态类型总是让我猜猜看不太感冒，对很多基础库了解得也不够多。刚入学的第一个项目是Python的聊天室（当时是网上复刻了一个），后面学校又开了一次课写的是dj的酒店管理，linux课服务器用fastAPI写了个网盘http服务器。
</div>
    `,
    "FrontEnd":`
<div class="technology_paragraph">
前端技术栈比较复杂，其中三件套（html+css+js）在外面稍微培训过一次，所以写得比较多，以后可能依旧继续写这个（这个博客也是纯三件套的），vue写过一次，暂时不考虑往vue去。前端的技术栈变化得比较快，而且也不是我要的主要方向。
</div>
<div class="technology_paragraph">
接下来是js的感想吧，虽然代码块是C系，但是动态类型不喜欢。由于前端写得比python还多，所以在动态类型上栽得跟头比py还多，前端逻辑也不输后端。写的时候就比较痛苦。Node.js也写过，还写过C++对Node.js的库。总之是个我不太喜欢，但是避不开的语言。
</div>
    `
}
const context = document.getElementById("technology_context");
let items = document.getElementsByClassName("technology_stack_item");
Array.from(items).forEach(item => {
    item.addEventListener("click", (event) => {
        let name = event.target.dataset.technology;
        if(name===undefined){
            return;
        }
        context.innerHTML = contextMap[name];
    })
})