function idBar(id){
    if(id===undefined || id===null || id===""){
        return "";
    }
    return `${id}-`;
}
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {

    }
}

class IndexArea extends HTMLElement{
    forElement = "";
    indexStack = [];
    static get observedAttributes() {
        return [];
    }
    constructor(){
        super();
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.isConnected) {
            this.render();
        }
    }
    render(){
        this.forElement = this.getAttribute("for")
        const id = idBar(this.getAttribute('id'));
        if(this.indexStack.length===0){
            let root = document.createElement("div");
            root.className = "index_block";
            if(id!==""){
                root.id = `${id}index`
            }
            this.indexStack.push(root);
            let head = document.createElement("div");
            head.className = "index_head";
            head.textContent = "目录"
            this.appendChild(head);
            this.appendChild(root);
        }
        if(this.forElement!=="" && document.getElementById(this.forElement)!==null){
            let mainContext = document.getElementById(this.forElement);
            for(let i = 0; i < mainContext.children.length; i++){
                const levelRegex = /title_level([1-9][0-9]*|0)/
                let level = -1;
                if(!levelRegex.test(mainContext.children[i].className) && !/H[1-6]/.test(mainContext.children[i].tagName)){
                    continue;
                }
                else if(levelRegex.test(mainContext.children[i].className)){
                    level = parseInt(mainContext.children[i].className.split("title_level")[1]);
                }
                else if(/H[1-6]/.test(mainContext.children[i].tagName)){
                    level = parseInt(mainContext.children[i].tagName.substring(1));
                }
                while(this.indexStack.length > 1 && this.indexStack[this.indexStack.length-1] >= level){
                    this.indexStack.pop()
                }
                let title = document.createElement("div")
                title.target = mainContext.children[i];
                title.className = "index_title";
                title.textContent = mainContext.children[i].textContent;
                this.indexStack[0].appendChild(title)
                let padding = window.getComputedStyle(title).paddingLeft;
                title.style.paddingLeft = `calc(${padding}*${level})`;
                this.indexStack.push(level)
                title.addEventListener("click", (e)=>{
                    window.scrollTo({
                        top:e.target.target.getBoundingClientRect().top +
                            window.scrollY -
                            this.indexStack[0].getBoundingClientRect().top +
                            this.indexStack[0].clientTop + parseFloat(window.getComputedStyle(document.getElementById(this.forElement)).paddingTop),
                        behavior: 'smooth'
                    });
                })
            }
            this.addScrollListener();
        }
    }
    // 添加滚动监听方法
    addScrollListener() {
        window.addEventListener('scroll', () => {
            this.updateActiveTitle();
        });
        // 初始执行一次
        this.updateActiveTitle();
    }

    // 更新当前激活的标题
    updateActiveTitle() {
        const mainContext = document.getElementById(this.forElement);
        if (!mainContext) return;

        const titles = this.indexStack[0]?.querySelectorAll('.index_title');
        if (!titles || titles.length === 0) return;

        // 获取页面中心位置
        const centerY = window.innerHeight / 2;

        let activeTitle = null;
        let minDistance = Infinity;

        // 遍历所有标题对应的目标元素，找到最接近页面中心的
        titles.forEach(title => {
            const target = title.target;
            if (!target) return;

            const targetRect = target.getBoundingClientRect();
            const targetCenter = targetRect.top + targetRect.height / 2;
            const distance = Math.abs(targetCenter - centerY);

            if (distance < minDistance) {
                minDistance = distance;
                activeTitle = title;
            }
        });

        // 清除所有标题的激活状态
        titles.forEach(title => {
            title.classList.remove('active');
        });

        // 给当前激活的标题添加边框
        if (activeTitle) {
            activeTitle.classList.add('active');
        }
    }
}
customElements.define('index-area', IndexArea);

class CodeArea extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor(){
        super();
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.isConnected) {
            this.render();
        }
    }
    render(){
        let opinions = this.getElementsByTagName("code-opinion");
        let list = [];
        for(let opinion of opinions){
            list.push({
                language:opinion.getAttribute("language"),
                html:opinion.innerHTML
            })
        }
        if(opinions.length === 0){
            return;
        }
        const id = idBar(this.getAttribute('id'));
        this.innerHTML = `
        <div ${id===""?"":`id="${id}coding_area"`} class="coding_area">
            <div ${id===""?"":`id="${id}coding_config"`} class="coding_config">
                <select ${id===""?"":`id="${id}coding_choice"`} class="coding_choice"></select>
                <div ${id===""?"":`id="${id}coding_button_show"`} class="coding_button" data-operation="show" flag="0">展开</div>
                <div ${id===""?"":`id="${id}coding_button_copy"`} class="coding_button" data-operation="copy">复制</div>
            </div>
            <div ${id===""?"":`id="${id}coding_text_area"`} class="coding_text_area"></div>
        </div>`
        let selectArea = this.querySelector("select.coding_choice");
        let area = this.querySelector(".coding_text_area");
        for(let i=0;i<list.length;i++){
            let opinion = document.createElement("option");
            opinion.className = "coding_opinion";
            opinion.textContent = list[i].language;
            if(id!==""){
                radio.id = `${id}coding_opinion-{opinion.dataset.language}`;
            }
            selectArea.appendChild(opinion);
            let coding = document.createElement("div");
            coding.className = "coding_text_hidden";
            coding.dataset.language = list[i].language;
            coding.innerHTML = list[i].html;
            coding.addEventListener("dblclick",(e)=>{
                let tar = e.target;
                console.log(tar.innerText);
            })
            area.appendChild(coding);
        }
        let first = this.querySelector(".coding_text_hidden");
        if (first) {
            first.className = "coding_text";
        }
        selectArea.addEventListener("change", (e) => {
            let language = e.target.value;
            let root = e.target.parentNode.parentNode.parentNode;
            let texts = root.getElementsByClassName("coding_text");
            for(let i = 0; i < texts.length; i++){
                texts[i].className = "coding_text_hidden";
            }
            let targetText = root.querySelector(`.coding_text_hidden[data-language="${language}"]`);
            targetText.className = "coding_text";
        })
        this.querySelector(`div.coding_button[data-operation="show"]`).addEventListener("click", (e)=>{
            let pres = this.querySelectorAll('pre');
            if(e.target.getAttribute('flag')==="0"){
                e.target.textContent = "收起";
                e.target.setAttribute("flag","1");
                for(let i = 0; i < pres.length; i++){
                    pres[i].style.maxHeight = "none";
                }
            }
            else if(e.target.getAttribute('flag')==="1"){
                e.target.textContent = "展开";
                e.target.setAttribute("flag","0");
                for(let i = 0; i < pres.length; i++){
                    pres[i].style.maxHeight = "40vh";
                }
            }
        })
        this.querySelector(`div.coding_button[data-operation="copy"]`).addEventListener("click", (e)=>{
            let target = e.target;
            copyToClipboard(this.querySelector("div.coding_text pre").innerText)
                .then(()=>{
                    target.textContent = "已复制";
                    setTimeout(()=>{target.textContent = "复制";},500)
                })
                .catch((err)=>{
                    target.textContent = "错误";
                })
        })
    }
}
customElements.define('code-area', CodeArea);

function defaultAnimate(self,animationRoot,first,stage){
    return stage;
}
function defaultFirstValue(inputArea){
    return undefined;
}
class Animation extends HTMLElement{
    animationFunc = defaultAnimate;
    firstValueFunc = defaultFirstValue;
    stage = 0;
    mutex = false;
    static get observedAttributes() {
        return [];
    }
    constructor(){
        super();
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.isConnected) {
            this.render();
        }
    }
    render(){
        const id = idBar(this.getAttribute('id'));
        let defaultSpeed = this.getAttribute("speed");
        try{
            defaultSpeed = parseInt(defaultSpeed);
            if(defaultSpeed < 0){
                throw Error("negative integer");
            }
        }
        catch (e){
            throw Error("Animation: attribute speed must be a positive integer");
        }
        this.innerHTML = `
        <div ${id===""?"":`id = "${id}animation_area"`} class="animation_area">
            ${this.innerHTML===""?"":`<div>初始数据</div>`}
            <div ${id===""?"":`id="${id}input"`} input>
                ${this.innerHTML}
            </div>
            <div ${id===""?"":`id="${id}msg"`} msg>这里显示动画消息</div>
            <div>
                <label>播放速度</label>
                <input type="number" min="1" step="1" value="${defaultSpeed}" speed>
            </div>
            <div ${id===""?"":`id="${id}operator"`} class="operator">
                <div ${id===""?"":`id="${id}operator_opinion-start"`} class="operator_opinion" data-operator="start">⏹️</div>
                <div ${id===""?"":`id="${id}operator_opinion-next"`} class="operator_opinion" data-operator="next">▶️</div>
            </div>
            <div ${id===""?"":`id="${id}animation_field"`} class="animation_field"></div>
        </div>
        `
        let root = this.querySelector(".animation_field");
        let start = this.querySelector(`.operator_opinion[data-operator="start"]`);
        start.addEventListener("click", (e)=>{
            this.mutex = false;
            let first = this.value();
            this.stage = 0;
            this.stage = this.animationFunc(this,root,first,this.stage);
        })
        let next = this.querySelector(`.operator_opinion[data-operator="next"]`)
        next.addEventListener("click", (e)=>{
            if(this.mutex) return;
            let first = this.value();
            this.stage = this.animationFunc(this,root,first,this.stage);
        })
    }

    setMsg(msg){
        let msgDiv = this.querySelector("div[msg]");
        msgDiv.textContent = msg;
    }

    lock(){
        this.mutex = true;
    }
    unlock(){
        this.mutex = false;
    }
    speed(){
        let speedInput = this.querySelector(`input[type="number"][speed]`);
        let min = parseInt(speedInput.getAttribute("min"));
        let v = parseInt(speedInput.value);
        return v<min?min:v;
    }
    value(){
        let input = this.querySelector("div[input]");
        return this.firstValueFunc(input);
    }
}
customElements.define('animation-area', Animation);

class BinaryInput extends HTMLElement{
    static get observedAttributes() {
        return [];
    }
    constructor(){
        super();
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.isConnected) {
            this.render();
        }
    }
    render(){
        const base64CharList = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
        const idbar = idBar(this.getAttribute('id'));
        const password = this.getAttribute("password");
        this.innerHTML = `            
            <div class="binary_input" ${idbar===""?"":`id="${idbar}binary_input"`}>
                <div class="type_choice_field" ${idbar===""?"":`id="${idbar}type_choice_field"`}>
                    <input type="radio" name="${idbar}input_type" value="0" ${idbar===""?"":`id="${idbar}input_type_utf8"`} checked>
                    <label class="type_choice_label" ${idbar===""?"":`for="${idbar}input_type_utf8"`}>UTF-8</label>
                    <input type="radio" name="${idbar}input_type" value="1" ${idbar===""?"":`id="${idbar}input_type_bin"`}>
                    <label class="type_choice_label" ${idbar===""?"":`for="${idbar}input_type_bin"`}>Bin</label>
                    <input type="radio" name="${idbar}input_type" value="2" ${idbar===""?"":`id="${idbar}input_type_hex"`}>
                    <label class="type_choice_label" ${idbar===""?"":`for="${idbar}input_type_hex"`}>Hex</label>
                    <input type="radio" name="${idbar}input_type" value="3" ${idbar===""?"":`id="${idbar}input_type_base64"`}>
                    <label class="type_choice_label" ${idbar===""?"":`for="${idbar}input_type_base64"`}>Base64</label>
                </div>
                <div ${idbar===""?"":`id="${idbar}type_param_field"`} class="type_param_field">
                    <div class="base64_replace_field_hidden" ${idbar===""?"":`id="${idbar}base64_replace_field"`} hidden>
                        <label ${idbar===""?"":`for="${idbar}base64_replace_add"`}>替换+</label>
                        <select class="replace_char" ${idbar===""?"":`id="${idbar}base64_replace_add"`} char="0"></select>
                        <label ${idbar===""?"":`for="${idbar}base64_replace_backslash"`}>替换/</label>
                        <select class="replace_char" ${idbar===""?"":`id="${idbar}base64_replace_backslash"`} char="1"></select>
                        <label ${idbar===""?"":`for="${idbar}base64_replace_equal"`}>替换=</label>
                        <select class="replace_char" ${idbar===""?"":`id="${idbar}base64_replace_equal"`} char="2"></select>
                    </div>
                </div>
                <div class="input_field">
                    <input type=${password?"password":"text"} class="input_text" type="text" ${idbar===""?"":`id="${idbar}input_text"`} rows="5">
                </div>
            </div>`
        let base64Selects = this.querySelectorAll(`select[char]`);
        base64Selects.forEach(select=>{
            const map = {
                "0": 10, "1": 14,"2": 18
            }
            for(let i=0  ;i<base64CharList.length;i++){
                let c = base64CharList[i];
                let opinion = document.createElement("option");
                opinion.value = c;
                opinion.text = c;
                if(map[select.getAttribute("char")]===i){
                    opinion.selected = true;
                }
                select.appendChild(opinion);
            }
        })
        let typeRadio = this.querySelectorAll(`input[type="radio"]`);
        typeRadio.forEach(radio=>{
            radio.addEventListener('change',(e)=>{
                if(e.target.getAttribute("value")==="3"){
                    this.querySelector(`div[class="base64_replace_field_hidden"]`).className = "base64_replace_field"
                }
                else{
                    let target = this.querySelector(`div[class="base64_replace_field"]`);
                    if(target!==null){
                        target.className = "base64_replace_field_hidden";
                    }
                }
            })
        })
    }

    get value(){
        let typeRadio = this.querySelectorAll(`input[type="radio"]`)
        let type = 0;
        typeRadio.forEach(radio=>{
            if(radio.checked){
                type = parseInt(radio.value)
            }
        })
        let textInput = this.querySelector(`input[type="text"]`);
        let text = textInput.value;
        if(type===1){
            for(let i=0;i<text.length;i++){
                let c = text.charAt(i);
                if(!(c==="1"||c==="0")){
                    throw Error(`binary-input${this.id===""?"":`[id=${this.id}]`}:Bin mode only support char 1 or 0`);
                }
            }
            while((text.length>>>0)%8!==0){
                text = "0"+text;
            }
        }
        else if(type===2){
            const list = "0123456789ABCDEFabcdef"
            for(let i=0;i<text.length;i++){
                let c = text.charAt(i);
                if(list.indexOf(c)===-1){
                    throw Error(`binary-input${this.id===""?"":`[id=${this.id}]`}:Hex mode only support char in 0123456789ABCDEFabcdef`);
                }
            }
            while((text.length>>>0)%2!==0){
                text = "0"+text;
            }
        }
        else if(type===3){
            let list = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/=";
            let c0 = this.querySelector(`select[char="0"]`).value;
            let c1 = this.querySelector(`select[char="1"]`).value;
            let c2 = this.querySelector(`select[char="2"]`).value;
            if(c0===c1 || c1===c2 || c2===c0){
                throw Error(`binary-input${this.id===""?"":`[id=${this.id}]`}:Replaced chars must be distinct for every pair`);
            }
            list = list.replace("+",c0);
            list = list.replace("/",c1);
            list = list.replace("=",c2);
            for(let i=0;i<text.length;i++){
                let c = text.charAt(i);
                if(list.indexOf(c)===-1){
                    throw Error(`binary-input${this.id===""?"":`[id=${this.id}]`}:Base64 mode only support char in ${list}`);
                }
            }
            while(text.indexOf(c0)!==-1){
                text[text.indexOf(c0)] = "+"
            }
            while(text.indexOf(c1)!==-1){
                text[text.indexOf(c1)] = "/";
            }
            while(text.indexOf(c2)!==-1){
                text[text.indexOf(c2)] = "=";
            }
            while((text.length>>>0)%4!==0){
                text += "=";
            }
        }
        return {
            "type" : type,
            "text" : text
        };
    }

    static toHex(value){
        if(value.type === 0){
            const encoder = new TextEncoder();
            const bytes = encoder.encode(value.text);
            let hex = Array.from(bytes)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            hex = hex.toUpperCase();
            if(hex.length%2===1){
                hex = "0"+hex;
            }
            return hex;
        }
        else if(value.type===1){
            let binStr = value.text;
            const mod = binStr.length % 8;
            // 需要在前面补0的个数，余数不为0才补
            const padLen = mod === 0 ? 0 : 8 - mod;
            const padded = binStr.padStart(binStr.length + padLen, '0');

            let hex = '';
            for (let i = 0; i < padded.length; i += 8) {
                const byte = parseInt(padded.slice(i, i + 8), 2);
                hex += byte.toString(16).padStart(2, '0');
            }
            return hex;
        }
        else if(value.type===2){
            return value.text;
        }
        else if(value.type===3){
            let b64 = value.text;
            const binary = atob(b64);
            const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
            return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        }
        return "";
    }
}
customElements.define('binary-input', BinaryInput);

document.querySelectorAll("img.default").forEach((img)=>{
    img.addEventListener("click", (e)=>{
        let dialog = document.querySelector(`body dialog[type="img"]`);
        if(!dialog){
            dialog = document.createElement("dialog");
            dialog.setAttribute("type", "img");
            document.querySelector("body").appendChild(dialog);
            dialog.addEventListener("dblclick", (e)=>{
                let target = e.target;
                while(target.tagName.toLowerCase()!=="dialog"){
                    target = target.parentNode;
                }
                while(target.firstChild){
                    target.firstChild.remove();
                }
                target.close();
            })
            dialog.addEventListener("wheel", (e)=>{
                e.preventDefault()
            })
        }
        let div = document.createElement("div");
        div.className = "img_player";
        let childImg = document.createElement("img");
        childImg.src = img.src;
        childImg.className = "default";
        childImg.scale = 1
        childImg.translateX = 0;
        childImg.translateY = 0;
        childImg.addEventListener("wheel", (e)=>{
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = e.target.scale * delta;
            const scaleRatio = newScale / e.target.scale;
            e.target.scale = newScale;
            childImg.style.transform = `translate(${e.target.translateX}px, ${e.target.translateY}px) scale(${e.target.scale})`;
        })
        childImg.addEventListener("mousedown", (e)=>{
            e.preventDefault()
            if(childImg.moving) return;
            childImg.moving = true;
            childImg.startX = e.clientX - childImg.translateX;
            childImg.startY = e.clientY - childImg.translateY;
        })
        childImg.addEventListener("mousemove", (e)=>{
            if(!childImg.moving) return;
            e.preventDefault()
            childImg.translateX = e.clientX - childImg.startX;
            childImg.translateY = e.clientY - childImg.startY;
            childImg.style.transform = `translate(${e.target.translateX}px, ${e.target.translateY}px) scale(${e.target.scale})`;
        })
        childImg.addEventListener("mouseup", (e)=>{
            e.preventDefault()
            if(!childImg.moving) return;
            childImg.translateX = e.clientX - childImg.startX;
            childImg.translateY = e.clientY - childImg.startY;
            childImg.style.transform = `translate(${e.target.translateX}px, ${e.target.translateY}px) scale(${e.target.scale})`;
            childImg.moving = false;
        })
        div.appendChild(childImg);
        dialog.appendChild(div);
        dialog.showModal();
        let notice = document.createElement("div");
        notice.textContent = "上下滚动放缩 拖拽移动 双击退出";
        notice.className = "notice";
        dialog.appendChild(notice);
    })
})