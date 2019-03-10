function Watcher(vm,expOrFn,cb){
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.cb = cb;
    this.depIds = {};
    if(typeof expOrFn === "function"){
        this.getter = expOrFn;
    }else{
        this.getter = this.parseGetter(expOrFn);
    }
    this.value = this.get();
}

Watcher.prototype = {
    parseGetter(exp){
        const props = exp.split(',');
        return function (){
            let obj = this.vm;
            for(item of props){
                if(!obj) return;
                obj = obj[item]
            }
            return obj;
        }
    },
    update(){
        this.run();
    },
    run(){
        const newValue = this.get();
        const oldVaue = this.value;
        if(newValue === oldVaue ) return;
        this.value = newValue;
        this.cb.call(this.vm,newValue,oldVaue);
    },
    get(){
        Dep.target = this;
        const value = this.getter();
        Dep.target = null;
        return value;
    },
    addDep(dep){
        if (!this.depIds.hasOwnProperty(dep.uid)) {
            dep.addSub(this);
            this.depIds[dep.uid] = dep;
        }
    }
}