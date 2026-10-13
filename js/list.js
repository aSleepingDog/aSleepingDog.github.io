class ArticleTag extends HTMLElement {
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
        let title = this.textContent;
        let update = this.getAttribute("update");
        let href = this.getAttribute("href");
        let id = this.id===undefined||this.id===""?"":`${this.id}-`;
        this.innerHTML = `
        <div ${id===""?"":`${id}article_tag_area`} class="article_tag_area">
            <div class="article_title" ${id===""?"":`${id}article_title`}>${title}</div>
            <div class="article_update_time" ${id===""?"":`${id}article_update_time`}>更新时间:${update}</div>
        </div>
        `;
        if(href!==""&&href!==undefined){
            this.addEventListener("dblclick",()=>{
                window.location.href = href;
            })
        }
    }
}
customElements.define('article-tag', ArticleTag);
