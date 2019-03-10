function Compile(vm,el){
    this.vm = vm;
    this.$el = Utils.isElementNode(el)?el:document.querySelector(el);
    
    if(this.$el){
        this.$fragment = this.toFragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    init(){
        this.compileElement(this.$fragment);
    },
    toFragment(el){
        const fragment = document.createDocumentFragment();
        let child = null;
        while(child = el.firstChild){
            fragment.appendChild(child);
        }
        return fragment;
    },
    compileElement(fragment){
        Array.from(fragment.childNodes).forEach(node=>{
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/;
            if(Utils.isElementNode(node)){
                this.compile(node);
            }
            if(Utils.isTextNode(node)&&reg.test(text)){
                this.compileText(node,RegExp.$1)
            }
            if(node.childNodes&&node.childNodes.length){
                this.compileElement(node);
            }
        })
    },
    compile(node){
        
    },
    compileText(node,exp){
        console.log(node)
        node.textContent=this.vm[exp];
        new Watcher(this.vm,exp,(nv,ov)=>{
            node.textContent = nv;
        })
    }

}


Utils ={
    isElementNode(node){
        return node.nodeType === Node.ELEMENT_NODE
    },
    isTextNode(node){
        return node.nodeType === Node.TEXT_NODE;
    }
}