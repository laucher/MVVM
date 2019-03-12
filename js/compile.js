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
        const nodeAttrs = node.attributes;

        [].slice.call(nodeAttrs).forEach((attr)=>{
            const attrName = attr.name;
            if (Utils.isDirective(attrName)) {
                const exp = attr.value;
                const dir = attrName.substring(2);
                if (Utils.isEventDirective(dir)) {
                    Utils.eventHandler(node, me.$vm, exp, dir);
                } else {
                    Utils[dir] && Utils[dir](node, me.$vm, exp);
                }
                node.removeAttribute(attrName);
            }
        });
    },
    compileText(node,exp){
        compileUtil.text(node, this.vm, exp);
    }

}


Utils ={
    isElementNode(node){
        return node.nodeType === Node.ELEMENT_NODE
    },
    isTextNode(node){
        return node.nodeType === Node.TEXT_NODE;
    },
    isDirective(attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },
    bind: function(node, vm, exp, dir) {
        const updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, (value, oldValue)=>{
            updaterFn && updaterFn(node, value, oldValue);
        });
    },
}