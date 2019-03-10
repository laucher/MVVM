
function Vue(options){
	this.$options = options || {};
	const data = this._data = options.data;
	
	Object.keys(data).forEach((value)=>{
		this._proxyData(value);
	})

	new observer(this,data);
	this.$Compile = new Compile(this,options.el)
}
Vue.prototype = {
	constructor:Vue,
	_proxyData(key){
		 Object.defineProperty(this,key,{
			 enumerable:true,
			 configurable:true,
			 set(val){
				this._data[key] = val;
			 },
			 get(){
				return this._data[key] 
			 }
		 })
	},

}

