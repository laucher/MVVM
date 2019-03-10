function Observer(data){
    this.data = data;
    this.walk(data);
}


Observer.prototype = {
    walk(data){
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key])
        })
    },
    defineReactive(data,key,value){
        const dep = new Dep();
        let childObj = observer(value);
        Object.defineProperty(data,key,{
            configurable:true,
            enumerable:true,
            set(newVal){
                if(newVal === value) return;
                value = newVal;
                childObj = observer(newVal);
                dep.notify();       
            },
            get(){
                if(Dep.target){
                    dep.depend()
                }
                return value;
            }
        })
    }
}


function observer(data){
    if (!data || typeof data !== 'object') {
        return;
    }
    return new Observer(data);
}

let uid = 0;

function Dep(){
    this.uid ++;
    this.subs = []
}

Dep.prototype ={
    depend(){
        // watcher 把dep加进去了
        Dep.target.addDep(this);
    },
    notify(){
        this.subs.forEach(sub=>{
            sub.update();
        })
    },
    addSub(sub){
        this.subs.push(sub);
    },
    removeSub(){
        const index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }
}

Dep.target = null;
