function intToBigEndianHex(num, byteLength) {
    num = num >>> 0;  // 转为32位无符号整数

    let result = '';
    for (let i = byteLength - 1; i >= 0; i--) {
        let byte = (num >> (i * 8)) & 0xFF;
        result += byte.toString(16).padStart(2, '0');
    }
    return result.toUpperCase();
}

function sha2First(inputArea){
    return BinaryInput.toHex(inputArea.querySelector("binary-input").value);
}
function sha2Fill(self,animationRoot,first,stage){
    let speed0 = self.speed();
    let step = 1;
    if(stage === -1){
        let label = document.createElement("label");
        label.textContent = "分组（以Hex呈现）"
        animationRoot.appendChild(label);
        let line = document.createElement("div");
        for(let i=0;i<animationRoot.groups.length;i++){
            line.textContent = animationRoot.groups[i];
            animationRoot.appendChild(line.cloneNode(true));
        }
        let bytesBox = animationRoot.querySelector("#sha2_fill_bytes_box");
        let k = 0;
        let lineStr = "";
        while(bytesBox.firstChild){
            lineStr = lineStr + bytesBox.firstChild.textContent;
            bytesBox.firstChild.remove();
            k++;
            if(k===64){
                line.textContent = lineStr;
                animationRoot.appendChild(line.cloneNode(true));
                k=0;
            }
        }
        self.setMsg("当前演示完毕，请点击开始重新演示");
        return -1;
    }
    else if(stage === 0){
        self.setMsg("初始化数据")
        animationRoot.groups = [];
        while(animationRoot.firstChild){
            animationRoot.firstChild.remove();
        }
        let count = document.createElement("div");
        count.dataset.binary = first;
        count.dataset.length = intToBigEndianHex(count.dataset.binary.length*4,8);
        count.textContent = "当前分组数:0"
        animationRoot.appendChild(count);
        let bytesBox = document.createElement('div');
        bytesBox.id = "sha2_fill_bytes_box";
        bytesBox.className = "sha2_bytes_box";
        animationRoot.appendChild(bytesBox);
        if(count.dataset.binary.length===0){
            return 2;
        }
    }
    else if(stage === 1){
        self.setMsg("选取数值并分组")
        let hex = animationRoot.firstChild.dataset.binary;
        let bytesBox = animationRoot.querySelector("#sha2_fill_bytes_box");
        let i=0;
        for(i=0;i<hex.length && i<128;i+=2){
            let code = document.createElement("div");
            code.textContent = hex[i]+hex[i+1];
            code.className = "sha2_byte_box";
            setTimeout(()=>{
                bytesBox.appendChild(code);
            },(step++)*speed0);
        }
        animationRoot.firstChild.dataset.binary = animationRoot.firstChild.dataset.binary.substring(i);
        if(i===128){
            setTimeout(()=>{
                let bytes = bytesBox.querySelectorAll(".sha2_byte_box");
                bytes.forEach((b)=>{
                    b.className = "sha2_byte_box_active";
                });
                animationRoot.firstChild.textContent = animationRoot.firstChild.textContent+"+1";
                setTimeout(()=>{
                    let line = ""
                    bytes.forEach((b)=>{
                        line += b.textContent;
                        b.remove();
                    });
                    animationRoot.groups.push(line);
                    animationRoot.firstChild.textContent = `当前分组数:${parseInt(animationRoot.firstChild.textContent.split(":")[1])+1}`;
                },(step++)*speed0);
            },(step++)*speed0);
        }
        if(animationRoot.firstChild.dataset.binary.length!==0){
            return stage;
        }
    }
    else if(stage === 2){
        self.setMsg("末尾填充")
        let bytesBox = animationRoot.querySelector("#sha2_fill_bytes_box");
        let length = bytesBox.childNodes.length;
        setTimeout(()=>{
            let code = document.createElement("div");
            code.textContent = '80';
            code.className = "sha2_byte_box_fill";
            bytesBox.appendChild(code);
        },(step++)*speed0);
        length++;
        let count = animationRoot.querySelector('div[data-binary]');
        if(length<56){
            for(let i=length;i<56;i++){
                setTimeout(()=>{
                    let code = document.createElement("div");
                    code.textContent = '00';
                    code.className = "sha2_byte_box_fill";
                    bytesBox.appendChild(code);
                },(step++)*speed0);
            }
            let lenStr = count.dataset.length;
            for(let i=0;i<lenStr.length;i+=2){
                setTimeout(()=>{
                    let code = document.createElement("div");
                    code.textContent = lenStr[i]+lenStr[i+1];
                    code.className = "sha2_byte_box_number";
                    bytesBox.appendChild(code);
                },(step++)*speed0);
            }
            return -1;
        }
        else{
            for(let i=length;i<64;i++){
                setTimeout(()=>{
                    let code = document.createElement("div");
                    code.textContent = '00';
                    code.className = "sha2_byte_box_fill";
                    bytesBox.appendChild(code);
                },(step++)*speed0);
            }
            self.setMsg("末尾填充 准备新开分组")
            setTimeout(()=>{
                let bytes = bytesBox.querySelectorAll(".sha2_byte_box");
                bytes.forEach((b)=>{
                    b.className = "sha2_byte_box_active";
                });
                animationRoot.firstChild.textContent = animationRoot.firstChild.textContent+"+1";
                setTimeout(()=>{
                    animationRoot.firstChild.textContent = `当前分组数:${parseInt(animationRoot.firstChild.textContent.split(":")[1])+1}`;
                },(step++)*speed0);
            },(step++)*speed0);
            return 3;
        }
    }
    else if(stage === 3){
        let bytesBox = animationRoot.querySelector("#sha2_fill_bytes_box");
        // while(bytesBox.firstChild){
        //     bytesBox.firstChild.remove();
        // }
        self.setMsg("末尾填充");
        let length = bytesBox.childNodes.length;
        for(let i=length;i<56+64;i++){
            setTimeout(()=>{
                let code = document.createElement("div");
                code.textContent = '00';
                code.className = "sha2_byte_box_fill";
                bytesBox.appendChild(code);
            },(step++)*speed0);
        }
        let count = animationRoot.querySelector('div[data-binary]');
        let lenStr = count.dataset.length;
        for(let i=0;i<lenStr.length;i+=2){
            setTimeout(()=>{
                let code = document.createElement("div");
                code.textContent = lenStr[i]+lenStr[i+1];
                code.className = "sha2_byte_box_number";
                bytesBox.appendChild(code);
            },(step++)*speed0);
        }
        setTimeout(()=>{
            let bytes = bytesBox.querySelectorAll(".sha2_byte_box");
            bytes.forEach((b)=>{
                b.className = "sha2_byte_box_active";
            });
            animationRoot.firstChild.textContent = animationRoot.firstChild.textContent+"+1";
            setTimeout(()=>{
                animationRoot.firstChild.textContent = `当前分组数:${parseInt(animationRoot.firstChild.textContent.split(":")[1])+1}`;
            },(step++)*speed0);
        },(step++)*speed0);
        return -1;
    }
    return stage+1;
}
let animateFill = document.querySelector(`animation-area#sha2_fill`)
animateFill.animationFunc = sha2Fill;
animateFill.firstValueFunc = sha2First;
function rotateRight(value, shift) {
    // 将 shift 规范到 0~31 之间
    shift = shift & 31;
    // 如果 shift 为 0，直接返回原值
    if (shift === 0) return value;
    // 将 value 转为无符号 32 位整数
    value = value >>> 0;
    // 右移 shift 位，左移 (32 - shift) 位，两者按位或
    return ((value >>> shift) | (value << (32 - shift))) >>> 0;
}
function sha2BlockExtend(self,animationRoot,first,stage){
    const s0Color = "#f67474";
    const s1Color = "#ffdf00";
    const s2Color = "#009cff";
    const s3Color = "#ff00f2";
    const speed1 = self.speed();
    let step = 1;
    if(stage === -1){
        self.setMsg("当前演示完毕，请点击开始重新演示");
        return -1;
    }
    else if(stage===0){
        self.lock();
        self.setMsg("初始化数据")
        while(animationRoot.firstChild){
            animationRoot.firstChild.remove();
        }
        let hex = first;
        while(hex.length<128){
            hex+="00";
        }
        let count = document.createElement("div");
        count.dataset.binary = hex;
        count.textContent = "当前32位字数:0"
        animationRoot.appendChild(count);
        let bytesBox = document.createElement('div');
        bytesBox.id = "sha2_block_extend_bytes_box";
        bytesBox.className = "sha2_bytes_box";
        animationRoot.appendChild(bytesBox);
        self.unlock();
        return 1;
    }
    else if(stage===1){
        self.lock();
        self.setMsg("将字节数据解释为32位字");
        let hex = animationRoot.firstChild.dataset.binary;
        let bytesBox = animationRoot.querySelector("#sha2_block_extend_bytes_box");
        for(let i=0;i<hex.length && i<128;i+=2){
            let code = document.createElement("div");
            code.textContent = hex[i]+hex[i+1];
            code.className = "sha2_byte_box";
            bytesBox.appendChild(code);
        }
        for(let i=0;i<bytesBox.children.length;i+=4){
            let b0 = bytesBox.children[i];
            let b1 = bytesBox.children[i+1];
            let b2 = bytesBox.children[i+2];
            let b3 = bytesBox.children[i+3];
            setTimeout(()=>{
                b0.className = "sha2_byte_box_fill";
                b1.className = "sha2_byte_box_active";
                b1.style.position = "relative";
                b1.style.left = '-8px';
                b2.className = "sha2_byte_box_active";
                b2.style.position = "relative";
                b2.style.left = '-16px';
                b3.className = "sha2_byte_box_active";
                b3.style.position = "relative";
                b3.style.left = '-24px';
            },(step++)*speed1);
            setTimeout(()=>{
                b0.textContent = b0.textContent + b1.textContent+b2.textContent+b3.textContent;
                b0.className = "sha2_32b_word_box"
                b1.remove();
                b2.remove();
                b3.remove();
            },(step++)*speed1);
        }
        setTimeout(()=>{
            animationRoot.firstChild.textContent = "当前32位字数:16";
            self.unlock();
        },(step++)*speed1)
        return 2;
    }
    else if(stage===2){
        self.lock();
        self.setMsg("设置中间变量");
        let operation = document.createElement("div");
        operation.innerHTML=`
<div data-line="s0" class="sha2_extend_operation_line">
    s0=
    <div data-var="s0" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s0Color};"></div>
</div>
<div data-line="s1" class="sha2_extend_operation_line">
    s1=
    <div data-var="s1" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s1Color};"></div>
</div>
<div class="sha2_extend_operation_line">
    s2=
    <div data-var="s2" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s2Color};"></div>
</div>
<div class="sha2_extend_operation_line">
    s3=
    <div data-var="s3" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s3Color};"></div>
</div>
<div data-line="a" class="sha2_extend_operation_line">
    a=
    <div data-var="a" class="sha2_32b_word_box" style="width: calc(100%/5)"></div>
</div>
        `;
        animationRoot.appendChild(operation);
        self.unlock();
        return 3
    }
    else if(stage===3){
        self.lock();
        self.setMsg("扩展32位字");
        let bytesBox = animationRoot.querySelector(".sha2_bytes_box");
        setTimeout(()=>{
            bytesBox.children[bytesBox.children.length-15].style.backgroundColor = s0Color;
            bytesBox.children[bytesBox.children.length-2].style.backgroundColor = s1Color;
            bytesBox.children[bytesBox.children.length-16].style.backgroundColor = s2Color;
            bytesBox.children[bytesBox.children.length-7].style.backgroundColor = s3Color;
            animationRoot.querySelector("div[data-var=s0]").textContent = bytesBox.children[bytesBox.children.length-15].textContent;
            animationRoot.querySelector("div[data-var=s1]").textContent = bytesBox.children[bytesBox.children.length-2].textContent;
            animationRoot.querySelector("div[data-var=s2]").textContent = bytesBox.children[bytesBox.children.length-16].textContent;
            animationRoot.querySelector("div[data-var=s3]").textContent = bytesBox.children[bytesBox.children.length-7].textContent;
        },(step++)*speed1);
        setTimeout(()=>{
            let step0 = 1;
            let xorSign = document.createElement("span");
            xorSign.textContent = "="
            let s0l = animationRoot.querySelector(`div[data-line="s0"]`)
            let s0v = s0l.children[s0l.children.length-1];
            let s07 = s0v.cloneNode(true);
            s0l.appendChild(xorSign.cloneNode(true));
            xorSign.textContent = "^"
            s07.textContent = `${s0v.textContent}>>>7`
            s0l.appendChild(s07);
            s0l.appendChild(xorSign.cloneNode(true));
            let s018 = s0v.cloneNode(true);
            s018.textContent = `${s0v.textContent}>>>18`
            s0l.appendChild(s018);
            s0l.appendChild(xorSign.cloneNode(true));
            let s03 = s0v.cloneNode(true);
            s03.textContent = `${s0v.textContent}>>3`
            s0l.appendChild(s03);
            setTimeout(()=>{
                s07.textContent = intToBigEndianHex(`${rotateRight(parseInt(s07.textContent.split(">")[0],16),7)}`,4);
                s018.textContent = intToBigEndianHex(`${rotateRight(parseInt(s018.textContent.split(">")[0],16),18)}`,4);
                s03.textContent = intToBigEndianHex(`${parseInt(s03.textContent.split(">")[0],16) >>> 3}`,4);
                s0v.textContent = intToBigEndianHex((parseInt(s07.textContent,16) ^ parseInt(s018.textContent,16) ^parseInt(s03.textContent,16))>>>0,4);
                setTimeout(() => {
                    while(s0l.children.length>=2){
                        s0l.children[s0l.children.length-1].remove();
                    }
                },speed1);
            },(step0++)*speed1);
            let s1l = animationRoot.querySelector(`div[data-line="s1"]`)
            let s1v = s1l.children[s1l.children.length-1];
            xorSign.textContent = "="
            s1l.appendChild(xorSign.cloneNode(true));
            xorSign.textContent = "^"
            let s017 = s1v.cloneNode(true);
            s017.textContent = `${s1v.textContent}>>>17`
            s1l.appendChild(s017);
            s1l.appendChild(xorSign.cloneNode(true));
            let s019 = s1v.cloneNode(true);
            s019.textContent = `${s1v.textContent}>>>19`
            s1l.appendChild(s019);
            s1l.appendChild(xorSign.cloneNode(true));
            let s010 = s1v.cloneNode(true);
            s010.textContent = `${s1v.textContent}>>10`
            s1l.appendChild(s010);
            setTimeout(()=>{
                s017.textContent = intToBigEndianHex(`${rotateRight(parseInt(s017.textContent.split(">")[0],16),17)}`,4);
                s019.textContent = intToBigEndianHex(`${rotateRight(parseInt(s019.textContent.split(">")[0],16),19)}`,4);
                s010.textContent = intToBigEndianHex(`${parseInt(s010.textContent.split(">")[0],16) >>> 10}`,4);
                s1v.textContent = intToBigEndianHex((parseInt(s017.textContent,16) ^ parseInt(s019.textContent,16) ^parseInt(s010.textContent,16))>>>0,4);
                setTimeout(() => {
                    while(s1l.children.length>=2){
                        s1l.children[s1l.children.length-1].remove();
                    }
                },speed1);
            },(step0++)*speed1);
            let al = animationRoot.querySelector(`div[data-line="a"]`)
            setTimeout(()=>{
                let xorSign = document.createElement("span");
                xorSign.textContent = "="
                al.appendChild(xorSign.cloneNode(true));
                xorSign.textContent = "+"
                al.appendChild(animationRoot.querySelector("div[data-var=s0]").cloneNode(true));
                al.appendChild(xorSign.cloneNode(true));
                al.appendChild(animationRoot.querySelector("div[data-var=s1]").cloneNode(true));
                al.appendChild(xorSign.cloneNode(true));
                al.appendChild(animationRoot.querySelector("div[data-var=s2]").cloneNode(true));
                al.appendChild(xorSign.cloneNode(true));
                al.appendChild(animationRoot.querySelector("div[data-var=s3]").cloneNode(true));
                setTimeout(()=>{
                    let alv = animationRoot.querySelector("div[data-var=a]");
                    alv.textContent =intToBigEndianHex((
                        parseInt(animationRoot.querySelector("div[data-var=s0]").textContent,16) +
                        parseInt(animationRoot.querySelector("div[data-var=s1]").textContent,16) +
                        parseInt(animationRoot.querySelector("div[data-var=s2]").textContent,16) +
                        parseInt(animationRoot.querySelector("div[data-var=s3]").textContent,16)
                    ) >>>0,4)
                    setTimeout(() => {
                        while(al.children.length>=2){
                            al.children[al.children.length-1].remove();
                        }
                        let new_av = alv.cloneNode(true);
                        new_av.dataset.var = "";
                        bytesBox.appendChild(new_av);
                        for(let i=0;i<bytesBox.children.length;i++){
                            bytesBox.children[i].style = "";
                        }
                        let count = parseInt(animationRoot.querySelector("div[data-binary]").textContent.split(":")[1]);
                        count++;
                        animationRoot.querySelector("div[data-binary]").textContent = `${animationRoot.querySelector("div[data-binary]").textContent.split(":")[0]}:${count}`;
                        self.unlock();
                    },speed1);
                },speed1)
            },(step0++)*speed1)
        },(step++)*speed1);
        if(bytesBox.children.length===63){
            return -1
        }
    }
    return stage;
}
let animateExtend = document.querySelector(`animation-area#sha2_block_extend`);
animateExtend.animationFunc = sha2BlockExtend;
animateExtend.firstValueFunc = sha2First;

async function sha2BlockExtendFast0(self,animationRoot){
    const s0Color = "#f67474";
    const s1Color = "#ffdf00";
    const s2Color = "#009cff";
    const s3Color = "#ff00f2";
    let promise ;
    let bytesBox = animationRoot.querySelector("#sha2_block_extend_bytes_box");

    for(let k=0;k<64-16;++k){
        let step = 1;
        promise = new Promise((resolve)=>{
            let speed = self.speed();
            setTimeout(()=>{
                bytesBox.children[bytesBox.children.length-15].style.backgroundColor = s0Color;
                bytesBox.children[bytesBox.children.length-2].style.backgroundColor = s1Color;
                bytesBox.children[bytesBox.children.length-16].style.backgroundColor = s2Color;
                bytesBox.children[bytesBox.children.length-7].style.backgroundColor = s3Color;
                animationRoot.querySelector("div[data-var=s0]").textContent = bytesBox.children[bytesBox.children.length-15].textContent;
                animationRoot.querySelector("div[data-var=s1]").textContent = bytesBox.children[bytesBox.children.length-2].textContent;
                animationRoot.querySelector("div[data-var=s2]").textContent = bytesBox.children[bytesBox.children.length-16].textContent;
                animationRoot.querySelector("div[data-var=s3]").textContent = bytesBox.children[bytesBox.children.length-7].textContent;
            },(step++)*speed);
            setTimeout(()=>{
                let step0 = 1;
                let xorSign = document.createElement("span");
                xorSign.textContent = "="
                let s0l = animationRoot.querySelector(`div[data-line="s0"]`)
                let s0v = s0l.children[s0l.children.length-1];
                let s07 = s0v.cloneNode(true);
                s0l.appendChild(xorSign.cloneNode(true));
                xorSign.textContent = "^"
                s07.textContent = `${s0v.textContent}>>>7`
                s0l.appendChild(s07);
                s0l.appendChild(xorSign.cloneNode(true));
                let s018 = s0v.cloneNode(true);
                s018.textContent = `${s0v.textContent}>>>18`
                s0l.appendChild(s018);
                s0l.appendChild(xorSign.cloneNode(true));
                let s03 = s0v.cloneNode(true);
                s03.textContent = `${s0v.textContent}>>3`
                s0l.appendChild(s03);
                setTimeout(()=>{
                    s07.textContent = intToBigEndianHex(`${rotateRight(parseInt(s07.textContent.split(">")[0],16),7)}`,4);
                    s018.textContent = intToBigEndianHex(`${rotateRight(parseInt(s018.textContent.split(">")[0],16),18)}`,4);
                    s03.textContent = intToBigEndianHex(`${parseInt(s03.textContent.split(">")[0],16) >>> 3}`,4);
                    s0v.textContent = intToBigEndianHex((parseInt(s07.textContent,16) ^ parseInt(s018.textContent,16) ^parseInt(s03.textContent,16))>>>0,4);
                    setTimeout(() => {
                        while(s0l.children.length>=2){
                            s0l.children[s0l.children.length-1].remove();
                        }
                    },speed);
                },(step0++)*speed);
                let s1l = animationRoot.querySelector(`div[data-line="s1"]`)
                let s1v = s1l.children[s1l.children.length-1];
                xorSign.textContent = "="
                s1l.appendChild(xorSign.cloneNode(true));
                xorSign.textContent = "^"
                let s017 = s1v.cloneNode(true);
                s017.textContent = `${s1v.textContent}>>>17`
                s1l.appendChild(s017);
                s1l.appendChild(xorSign.cloneNode(true));
                let s019 = s1v.cloneNode(true);
                s019.textContent = `${s1v.textContent}>>>19`
                s1l.appendChild(s019);
                s1l.appendChild(xorSign.cloneNode(true));
                let s010 = s1v.cloneNode(true);
                s010.textContent = `${s1v.textContent}>>10`
                s1l.appendChild(s010);
                setTimeout(()=>{
                    s017.textContent = intToBigEndianHex(`${rotateRight(parseInt(s017.textContent.split(">")[0],16),17)}`,4);
                    s019.textContent = intToBigEndianHex(`${rotateRight(parseInt(s019.textContent.split(">")[0],16),19)}`,4);
                    s010.textContent = intToBigEndianHex(`${parseInt(s010.textContent.split(">")[0],16) >>> 10}`,4);
                    s1v.textContent = intToBigEndianHex((parseInt(s017.textContent,16) ^ parseInt(s019.textContent,16) ^parseInt(s010.textContent,16))>>>0,4);
                    setTimeout(() => {
                        while(s1l.children.length>=2){
                            s1l.children[s1l.children.length-1].remove();
                        }
                    },speed);
                },(step0++)*speed);
                let al = animationRoot.querySelector(`div[data-line="a"]`)
                setTimeout(()=>{
                    let xorSign = document.createElement("span");
                    xorSign.textContent = "="
                    al.appendChild(xorSign.cloneNode(true));
                    xorSign.textContent = "+"
                    al.appendChild(animationRoot.querySelector("div[data-var=s0]").cloneNode(true));
                    al.appendChild(xorSign.cloneNode(true));
                    al.appendChild(animationRoot.querySelector("div[data-var=s1]").cloneNode(true));
                    al.appendChild(xorSign.cloneNode(true));
                    al.appendChild(animationRoot.querySelector("div[data-var=s2]").cloneNode(true));
                    al.appendChild(xorSign.cloneNode(true));
                    al.appendChild(animationRoot.querySelector("div[data-var=s3]").cloneNode(true));
                    setTimeout(()=>{
                        let alv = animationRoot.querySelector("div[data-var=a]");
                        alv.textContent =intToBigEndianHex((
                            parseInt(animationRoot.querySelector("div[data-var=s0]").textContent,16) +
                            parseInt(animationRoot.querySelector("div[data-var=s1]").textContent,16) +
                            parseInt(animationRoot.querySelector("div[data-var=s2]").textContent,16) +
                            parseInt(animationRoot.querySelector("div[data-var=s3]").textContent,16)
                        ) >>>0,4)
                        setTimeout(() => {
                            while(al.children.length>=2){
                                al.children[al.children.length-1].remove();
                            }
                            let new_av = alv.cloneNode(true);
                            new_av.dataset.var = "";
                            bytesBox.appendChild(new_av);
                            for(let i=0;i<bytesBox.children.length;i++){
                                bytesBox.children[i].style = "";
                            }
                            let count = parseInt(animationRoot.querySelector("div[data-binary]").textContent.split(":")[1]);
                            count++;
                            animationRoot.querySelector("div[data-binary]").textContent = `${animationRoot.querySelector("div[data-binary]").textContent.split(":")[0]}:${count}`;
                            // sha2BlockExtendFast0(self,animationRoot);
                            resolve()
                        },speed);
                    },speed)
                },(step0++)*speed)
            },(step++)*speed);
        })
        await promise;
    }
}
function sha2BlockExtendFast(self,animationRoot,first,stage){
    const s0Color = "#f67474";
    const s1Color = "#ffdf00";
    const s2Color = "#009cff";
    const s3Color = "#ff00f2";
    let step = 1;
    if(stage === -1){
        self.setMsg("当前演示完毕，请点击开始重新演示");
        let bytesBox = animationRoot.querySelector("#sha2_block_extend_bytes_box");
        let line = document.createElement("div");
        for(let i=0;i<bytesBox.children.length;i++){
            line.textContent = line.textContent + bytesBox.children[i].textContent;
        }
        animationRoot.appendChild(line);
        return -1;
    }
    else if(stage===0){
        self.lock();
        self.setMsg("初始化数据")
        while(animationRoot.firstChild){
            animationRoot.firstChild.remove();
        }
        let hex = first;
        while(hex.length<128){
            hex+="00";
        }
        let count = document.createElement("div");
        count.dataset.binary = hex;
        count.textContent = "当前32位字数:0"
        animationRoot.appendChild(count);
        let bytesBox = document.createElement('div');
        bytesBox.id = "sha2_block_extend_bytes_box";
        bytesBox.className = "sha2_bytes_box";
        animationRoot.appendChild(bytesBox);
        self.unlock();
        return 1;
    }
    self.lock();
    let speed = self.speed();
    let hex = animationRoot.firstChild.dataset.binary;
    let bytesBox = animationRoot.querySelector("#sha2_block_extend_bytes_box");
    self.setMsg("将字节数据解释为32位字");
    for(let i=0;i<hex.length && i<128;i+=2){
        let code = document.createElement("div");
        code.textContent = hex[i]+hex[i+1];
        code.className = "sha2_byte_box";
        bytesBox.appendChild(code);
    }
    for(let i=0;i<bytesBox.children.length;i+=4){
        let b0 = bytesBox.children[i];
        let b1 = bytesBox.children[i+1];
        let b2 = bytesBox.children[i+2];
        let b3 = bytesBox.children[i+3];
        setTimeout(()=>{
            b0.className = "sha2_byte_box_fill";
            b1.className = "sha2_byte_box_active";
            b1.style.position = "relative";
            b1.style.left = '-8px';
            b2.className = "sha2_byte_box_active";
            b2.style.position = "relative";
            b2.style.left = '-16px';
            b3.className = "sha2_byte_box_active";
            b3.style.position = "relative";
            b3.style.left = '-24px';
        },(step++)*speed);
        setTimeout(()=>{
            b0.textContent = b0.textContent + b1.textContent+b2.textContent+b3.textContent;
            b0.className = "sha2_32b_word_box"
            b1.remove();
            b2.remove();
            b3.remove();
        },(step++)*speed);
    }
    setTimeout(()=>{
        animationRoot.firstChild.textContent = "当前32位字数:16";
    },(step++)*speed)

    setTimeout(()=>{
        self.setMsg("设置中间变量");
        let operation = document.createElement("div");
        operation.setAttribute("var","");
        operation.innerHTML=`
<div data-line="s0" class="sha2_extend_operation_line">
    s0=
    <div data-var="s0" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s0Color};"></div>
</div>
<div data-line="s1" class="sha2_extend_operation_line">
    s1=
    <div data-var="s1" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s1Color};"></div>
</div>
<div class="sha2_extend_operation_line">
    s2=
    <div data-var="s2" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s2Color};"></div>
</div>
<div class="sha2_extend_operation_line">
    s3=
    <div data-var="s3" class="sha2_32b_word_box" style="width: calc(100%/5);background-color:${s3Color};"></div>
</div>
<div data-line="a" class="sha2_extend_operation_line">
    a=
    <div data-var="a" class="sha2_32b_word_box" style="width: calc(100%/5)"></div>
</div>
        `;
        animationRoot.appendChild(operation);
    },(step++)*speed)

    setTimeout(()=>{
        self.setMsg("扩展32位字");
    },(step++)*speed)

    setTimeout(()=>{
        sha2BlockExtendFast0(self,animationRoot).then(()=>{
            let operation = animationRoot.querySelector("div[var]")
            operation.remove();
            self.setMsg("当前演示完毕，请点击开始重新演示");
            self.unlock();
        })
    },(step++)*speed)

    return -1;
}
let animateExtendFast = document.querySelector(`animation-area#sha2_block_extend_fast`);
animateExtendFast.animationFunc = sha2BlockExtendFast;
animateExtendFast.firstValueFunc = sha2First;

async function sha2UpdateS0(self,animationRoot){
    let s0_line = animationRoot.querySelector(`div[data-line="s0"]`);
    let operation = document.createElement("span");
    let a = animationRoot.querySelector(`div[data-var="a"]`);
    a.classList.add("select");
    operation.textContent = "=";
    s0_line.appendChild(operation.cloneNode(true));
    let a1 = document.createElement("div")
    a1.className = "sha2_update_init_value";
    a1.textContent = a.textContent + ">>> 2"
    s0_line.appendChild(a1);
    operation.textContent = "^";
    s0_line.appendChild(operation.cloneNode(true));
    let a2 = document.createElement("div")
    a2.className = "sha2_update_init_value";
    a2.textContent = a.textContent + ">>> 13"
    s0_line.appendChild(a2);
    operation.textContent = "^";
    s0_line.appendChild(operation.cloneNode(true));
    let a3 = document.createElement("div")
    a3.className = "sha2_update_init_value";
    a3.textContent = a.textContent + ">>> 22"
    s0_line.appendChild(a3);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    a1.textContent = intToBigEndianHex(rotateRight(parseInt(a1.textContent.split(">")[0], 16), 2), 4);
    a2.textContent = intToBigEndianHex(rotateRight(parseInt(a2.textContent.split(">")[0], 16), 13), 4);
    a3.textContent = intToBigEndianHex(rotateRight(parseInt(a3.textContent.split(">")[0], 16), 22), 4);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    let s0 = animationRoot.querySelector(`div[data-var="s0"]`);
    s0.textContent = intToBigEndianHex(
        ((parseInt(a1.textContent,16)>>>0)^(parseInt(a2.textContent,16)>>>0)^(parseInt(a3.textContent,16)>>>0)>>>0)
        , 4
    );

    while (s0_line.children.length > 1) {
        s0_line.children[s0_line.children.length - 1].remove();
    }
    a.classList.remove("select");
}
async function sha2UpdateM(self,animationRoot){
    let m_line = animationRoot.querySelector(`div[data-line="m"]`);
    let operation = document.createElement("span");
    operation.textContent = "=";
    m_line.appendChild(operation.cloneNode(true));
    let a = animationRoot.querySelector(`div[data-var="a"]`);
    a.classList.add("select");
    let b = animationRoot.querySelector(`div[data-var="b"]`);
    b.classList.add("select");
    let c = animationRoot.querySelector(`div[data-var="c"]`);
    c.classList.add("select");

    let v0 = document.createElement("div")
    v0.className = "sha2_update_init_value";
    v0.textContent = a.textContent + "&" + b.textContent;
    m_line.appendChild(v0);
    operation.textContent = "^";
    m_line.appendChild(operation.cloneNode(true));

    let v1 = document.createElement("div")
    v1.className = "sha2_update_init_value";
    v1.textContent = a.textContent + "&" + c.textContent;
    m_line.appendChild(v1);
    operation.textContent = "^";
    m_line.appendChild(operation.cloneNode(true));

    let v2 = document.createElement("div")
    v2.className = "sha2_update_init_value";
    v2.textContent = b.textContent + "&" + c.textContent;
    m_line.appendChild(v2);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    v0.textContent = intToBigEndianHex(
        ((parseInt(v0.textContent.split("&")[0], 16)) >>> 0) &
        ((parseInt(v0.textContent.split("&")[1], 16)) >>> 0), 4);
    v1.textContent = intToBigEndianHex(
        ((parseInt(v1.textContent.split("&")[0], 16)) >>> 0) &
        ((parseInt(v1.textContent.split("&")[1], 16)) >>> 0), 4);
    v2.textContent = intToBigEndianHex(
        ((parseInt(v2.textContent.split("&")[0], 16)) >>> 0) &
        ((parseInt(v2.textContent.split("&")[1], 16)) >>> 0), 4);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    let m = animationRoot.querySelector(`div[data-var="m"]`);
    m.textContent = intToBigEndianHex(
        ((parseInt(v0.textContent, 16)) >>> 0) ^
        ((parseInt(v1.textContent, 16)) >>> 0) ^
        ((parseInt(v2.textContent, 16)) >>> 0), 4);

    while (m_line.children.length > 1) {
        m_line.children[m_line.children.length - 1].remove();
    }
    a.classList.remove("select");
    b.classList.remove("select");
    c.classList.remove("select");

}
async function sha2UpdateT2(self,animationRoot){
    let T2_line = animationRoot.querySelector(`div[data-line="T2"]`);
    let operation = document.createElement("span");
    operation.textContent = "=";
    T2_line.appendChild(operation.cloneNode(true));

    let s0 = document.createElement("div");
    s0.className = "sha2_update_init_value";
    s0.textContent = animationRoot.querySelector(`div[data-var="s0"]`).textContent;
    animationRoot.querySelector(`div[data-var="s0"]`).style = "width: calc(100%/7);background-color: #bca21f;"
    T2_line.appendChild(s0);
    operation.textContent = "+";
    T2_line.appendChild(operation.cloneNode(true));
    let m = document.createElement("div");
    m.className = "sha2_update_init_value";
    animationRoot.querySelector(`div[data-var="m"]`).style = "width: calc(100%/7);background-color: #bca21f;"
    m.textContent = animationRoot.querySelector(`div[data-var="m"]`).textContent;
    T2_line.appendChild(m);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    let T2 = animationRoot.querySelector(`div[data-var="T2"]`);
    T2.textContent = intToBigEndianHex(
        (parseInt(s0.textContent,16)+parseInt(m.textContent,16))>>>0,4
    );

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    while(T2_line.children.length > 1) {
        T2_line.children[T2_line.children.length - 1].remove();
    }
    animationRoot.querySelector(`div[data-var="s0"]`).style = "width: calc(100%/7);";
    animationRoot.querySelector(`div[data-var="m"]`).style = "width: calc(100%/7);";

}
async function sha2UpdateS1(self,animationRoot){
    let s1_line = animationRoot.querySelector(`div[data-line="s1"]`);
    let operation = document.createElement("span");
    operation.textContent = "=";
    s1_line.appendChild(operation.cloneNode(true));

    let e0 = document.createElement("div")
    e0.className = "sha2_update_init_value";
    e0.textContent = animationRoot.querySelector(`div[data-var="e"]`).textContent;
    animationRoot.querySelector(`div[data-var="e"]`).classList.add("select");
    let e1 = e0.cloneNode(true);
    let e2 = e0.cloneNode(true);

    e0.textContent = e0.textContent + ">>>6";
    s1_line.appendChild(e0);
    operation.textContent = "^";
    s1_line.appendChild(operation.cloneNode(true));
    e1.textContent = e1.textContent + ">>>11";
    s1_line.appendChild(e1);
    operation.textContent = "^";
    s1_line.appendChild(operation.cloneNode(true));
    e2.textContent = e2.textContent + ">>>25";
    s1_line.appendChild(e2);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    e0.textContent = intToBigEndianHex(rotateRight(parseInt(e0.textContent.split(">")[0],16),6), 4);
    e1.textContent = intToBigEndianHex(rotateRight(parseInt(e1.textContent.split(">")[0],16),11), 4);
    e2.textContent = intToBigEndianHex(rotateRight(parseInt(e2.textContent.split(">")[0],16),25), 4);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    let s1 = animationRoot.querySelector(`div[data-var="s1"]`);
    s1.textContent = intToBigEndianHex(
        (parseInt(e0.textContent,16)>>>0)^(parseInt(e1.textContent,16)>>>0)^(parseInt(e2.textContent,16)>>>0)
        ,4)

    while(s1_line.children.length > 1) {
        s1_line.children[s1_line.children.length - 1].remove();
    }

    animationRoot.querySelector(`div[data-var="e"]`).classList.remove("select");

}
async function sha2UpdateN(self,animationRoot){
    let n_line = animationRoot.querySelector(`div[data-line="n"]`);
    let operation = document.createElement("span");
    operation.textContent = "=";
    n_line.appendChild(operation.cloneNode(true));

    animationRoot.querySelector(`div[data-var="e"]`).classList.add("select");
    animationRoot.querySelector(`div[data-var="f"]`).classList.add("select");
    animationRoot.querySelector(`div[data-var="g"]`).classList.add("select");
    let v0 = document.createElement("div")
    v0.className = "sha2_update_init_value";
    v0.textContent = animationRoot.querySelector(`div[data-var="e"]`).textContent + "&" + animationRoot.querySelector(`div[data-var="f"]`).textContent;
    n_line.appendChild(v0);
    operation.textContent = "^";
    n_line.appendChild(operation.cloneNode(true));

    let v1 = document.createElement("div")
    v1.className = "sha2_update_init_value";
    v1.textContent = "~"+animationRoot.querySelector(`div[data-var="e"]`).textContent + "&" + animationRoot.querySelector(`div[data-var="g"]`).textContent;
    n_line.appendChild(v1);

    let e = (parseInt(animationRoot.querySelector(`div[data-var="e"]`).textContent,16)>>>0);
    let f = (parseInt(animationRoot.querySelector(`div[data-var="f"]`).textContent,16)>>>0);
    let g = (parseInt(animationRoot.querySelector(`div[data-var="g"]`).textContent,16)>>>0);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    v0.textContent = intToBigEndianHex(((e&f)>>>0),4);
    v1.textContent = intToBigEndianHex((((~e)&g)>>>0),4);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    let n = animationRoot.querySelector(`div[data-var="n"]`);
    n.textContent = intToBigEndianHex(
            (((e&f)>>>0)^(((~e)&g)>>>0))>>>0
        ,4)

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    while(n_line.children.length > 1) {
        n_line.children[n_line.children.length - 1].remove();
    }

    animationRoot.querySelector(`div[data-var="e"]`).classList.remove("select");
    animationRoot.querySelector(`div[data-var="f"]`).classList.remove("select");
    animationRoot.querySelector(`div[data-var="g"]`).classList.remove("select");

}
async function sha2UpdateT1(self,animationRoot){
    let t1_line = animationRoot.querySelector(`div[data-line="T1"]`);
    let t1 = animationRoot.querySelector(`div[data-var="T1"]`)
    let offset = parseInt(t1.getAttribute("offset"));
    let operation = document.createElement("span");
    operation.textContent = "=";
    t1_line.appendChild(operation.cloneNode(true));

    let v0 = document.createElement("div")
    v0.className = "sha2_update_init_value";
    v0.textContent = animationRoot.querySelector(`div[data-var="h"]`).textContent;
    animationRoot.querySelector(`div[data-var="h"]`).classList.add("select");
    t1_line.appendChild(v0);

    operation.textContent = "+";
    t1_line.appendChild(operation.cloneNode(true));

    let v1 = document.createElement("div")
    v1.className = "sha2_update_init_value";
    v1.textContent = animationRoot.querySelector(`div[data-var="s1"]`).textContent;
    animationRoot.querySelector(`div[data-var="s1"]`).style = "width: calc(100%/7);background-color: #bca21f;"
    t1_line.appendChild(v1);

    operation.textContent = "+";
    t1_line.appendChild(operation.cloneNode(true));

    let v2 = document.createElement("div")
    v2.className = "sha2_update_init_value";
    v2.textContent = animationRoot.querySelector(`div[data-var="n"]`).textContent;
    animationRoot.querySelector(`div[data-var="n"]`).style = "width: calc(100%/7);background-color: #bca21f;"
    t1_line.appendChild(v2);

    operation.textContent = "+";
    t1_line.appendChild(operation.cloneNode(true));

    let v3 = document.createElement("div")
    v3.className = "sha2_update_init_value";
    v3.textContent = intToBigEndianHex(t1.k[offset],4)
    t1_line.appendChild(v3);

    operation.textContent = "+";
    t1_line.appendChild(operation.cloneNode(true));

    let v4 = document.createElement("div")
    v4.className = "sha2_update_init_value";
    v4.textContent = animationRoot.querySelector(`div.sha2_bytes_box`).children[offset].textContent;
    animationRoot.querySelector(`div.sha2_bytes_box`).children[offset].style = "background-color: #bca21f;"
    t1_line.appendChild(v4);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    t1.textContent = intToBigEndianHex(
        (
            parseInt(v0.textContent,16)+
            parseInt(v1.textContent,16)+
            parseInt(v2.textContent,16)+
            parseInt(v3.textContent,16)+
            parseInt(v4.textContent,16)
        )>>>0
    ,4);

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    while (t1_line.children.length > 1) {
        t1_line.children[t1_line.children.length-1].remove();
    }
    t1.setAttribute("offset",`${offset+1}`);
    animationRoot.querySelector(`div.sha2_bytes_box`).children[offset].style = "";
    animationRoot.querySelector(`div[data-var="h"]`).classList.remove("select");
    animationRoot.querySelector(`div[data-var="s1"]`).style = "width: calc(100%/7);"
    animationRoot.querySelector(`div[data-var="n"]`).style = "width: calc(100%/7);"
    animationRoot.querySelector(`div.sha2_bytes_box`).children[offset].style = ""

}
async function sha2UpdateI(self,animationRoot){
    let t1 = animationRoot.querySelector(`div[data-var="T1"]`);
    let t2 = animationRoot.querySelector(`div[data-var="T2"]`);

    let a = animationRoot.querySelector(`div[data-var="a"]`);
    let b = animationRoot.querySelector(`div[data-var="b"]`);
    let c = animationRoot.querySelector(`div[data-var="c"]`);
    let d = animationRoot.querySelector(`div[data-var="d"]`);
    let e = animationRoot.querySelector(`div[data-var="e"]`);
    let f = animationRoot.querySelector(`div[data-var="f"]`);
    let g = animationRoot.querySelector(`div[data-var="g"]`);
    let h = animationRoot.querySelector(`div[data-var="h"]`);

    d.style = "background-color: #bca21f;";
    t1.style = "width: calc(100%/7);background-color: #bca21f;";

    d.textContent = intToBigEndianHex(
        (parseInt(d.textContent,16)+parseInt(t1.textContent,16))>>>0
    ,4)

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    d.style = "";

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    h.style = "background-color: #bca21f;"
    t2.style = "width: calc(100%/7);background-color: #bca21f;";

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    h.textContent = intToBigEndianHex(
        (parseInt(t1.textContent,16)+parseInt(t2.textContent,16))>>>0
        ,4)

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    t2.style = "width: calc(100%/7);";
    t1.style = "width: calc(100%/7);";

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    a.style = "background-color: #bca21f;";
    b.style = "background-color: #bca21f;";
    c.style = "background-color: #bca21f;";
    e.style = "background-color: #bca21f;";
    f.style = "background-color: #bca21f;";
    g.style = "background-color: #bca21f;";

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    let x = h.textContent;
    h.textContent = g.textContent;
    g.textContent = f.textContent;
    f.textContent = e.textContent;
    e.textContent = d.textContent;
    d.textContent = c.textContent;
    c.textContent = b.textContent;
    b.textContent = a.textContent;
    a.textContent = x;

    await new Promise(resolve => setTimeout(resolve, self.speed()));

    a.style = "";
    b.style = "";
    c.style = "";
    d.style = "";
    e.style = "";
    f.style = "";
    g.style = "";
    h.style = "";

}
function sha2UpdateFirst(inputArea){
    let block = BinaryInput.toHex(inputArea.querySelector("#sha2_update_block_input").value);
    while(block.length<512){
        block += "0";
    }
    let init = BinaryInput.toHex(inputArea.querySelector("#sha2_update_init_input").value);
    while(init.length<64){
        init += "0";
    }
    return [block,init];
}
function sha2UpdateFunc(self,animationRoot,first,stage){
   const speed = self.speed();
    let step = 1;
    if(stage === -1){
        self.setMsg("当前演示完毕，请点击开始重新演示");
        return -1;
    }
    else if(stage === 0){
        self.lock();
        while(animationRoot.firstChild){
            animationRoot.firstChild.remove();
        }
        let block = document.createElement("div");
        block.dataset.data = first[0];
        block.className = "sha2_bytes_box";
        animationRoot.appendChild(block);
        for(let i=0; i<first[0].length; i+=8){
            let word = document.createElement("div");
            word.textContent = first[0].substring(i,i+8);
            word.className = "sha2_32b_word_box";
            block.appendChild(word);
        }
        let init = document.createElement("div");
        init.dataset.data = first[1];
        init.className = "sha2_update_init_values";
        animationRoot.appendChild(init);
        const label = "abcdefgh"
        for (let i=0;i<first[1].length; i+=8){
            let word = document.createElement("div");
            word.textContent = label.charAt(i/8);
            word.className = "sha2_update_init_title";
            init.appendChild(word);
        }
        for (let i=0;i<first[1].length; i+=8){
            let word = document.createElement("div");
            word.textContent = first[1].substring(i,i+8);
            word.dataset.var = label.charAt(i/8);
            word.className = "sha2_update_init_value";
            init.appendChild(word);
        }
        let operation = document.createElement("div");
        operation.innerHTML = `
<div data-line="s0" class="sha2_extend_operation_line">
    s0=
    <div data-var="s0" class="sha2_32b_word_box" style="width: calc(100%/7);"></div>
</div>
<div data-line="m" class="sha2_extend_operation_line">
    m=
    <div data-var="m" class="sha2_32b_word_box" style="width: calc(100%/7);"></div>
</div>
<div data-line="T2" class="sha2_extend_operation_line">
    T2=
    <div data-var="T2" class="sha2_32b_word_box" style="width: calc(100%/7);"></div>
</div>
<div data-line="s1" class="sha2_extend_operation_line">
    s1=
    <div data-var="s1" class="sha2_32b_word_box" style="width: calc(100%/7);"></div>
</div>
<div data-line="n" class="sha2_extend_operation_line">
    n=
    <div data-var="n" class="sha2_32b_word_box" style="width: calc(100%/7)"></div>
</div>
<div data-line="T1" class="sha2_extend_operation_line">
    T1=
    <div data-var="T1" offset="0" class="sha2_32b_word_box" style="width: calc(100%/7)"></div>
</div>
        `;
        animationRoot.appendChild(operation);
        let T1 = animationRoot.querySelector(`div[data-var="T1"]`)
        T1.k = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
        self.unlock();
        return 1;
    }
    else if(stage === 1){
        self.lock();
        new Promise(async (resolve,reject)=>{
            await sha2UpdateS0(self,animationRoot);
            await sha2UpdateM(self,animationRoot);
            await sha2UpdateT2(self,animationRoot);
            await sha2UpdateS1(self,animationRoot);
            await sha2UpdateN(self,animationRoot);
            await sha2UpdateT1(self,animationRoot);
            await sha2UpdateI(self,animationRoot);
            resolve();
        }).then(()=>{
            self.unlock();
        })
        if(animationRoot.querySelector(`div[data-var="T1"]`).getAttribute("offset")!=="63"){
            return 1;
        }
        return -1;
    }
}
let sha2Update = document.getElementById("sha2_update")
sha2Update.animationFunc = sha2UpdateFunc;
sha2Update.firstValueFunc = sha2UpdateFirst;
