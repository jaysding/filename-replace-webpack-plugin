class FilenameReplaceWebpackPlugin {
    constructor(options) {
        /**
         * interface Object {
         *      form: string;
         *      to: string;
         *      replace: Replace 
         * }
         * interface Replace {
         *      (filename: string): string;
         * }
         * @params  Object or Array<Obj>
         */
        this.options = options;
    }
    
    apply(compiler) {
        compiler.hooks.emit.tapAsync('FilenameReplaceWebpackPlugin', (compilation, callback) => {
            let assets = compilation.assets
            let keys = Object.keys(assets);
            
            keys.forEach(k => {
                if(this.isType(this.options) === 'Array') {
                    this.options.forEach(option => {
                        this.replaceName(assets, option, k);
                    })
                } else if (this.isType(this.options) === 'Object') {
                    this.replaceName(assets, this.options, k);
                }
            })
            callback()
        })
	}

    replaceName (assets, option, oldKey) {
        let isReg = this.isType(option.from) === 'RegExp';
        let isString = typeof option.from === 'string';
        if(option.replace && typeof option.replace === 'function' &&  option.replace(oldKey)) {
            let newFileName = option.replace(oldKey);
            if(option.clone) {
                assets[newFileName] = this.deepClone(assets[oldKey]);
            } else {
                assets[newFileName] = assets[oldKey];
                delete assets[oldKey];
            }
        }
        if((isReg && option.from.test(oldKey)) || (isString && oldKey.indexOf(option.from) !== -1)) {
            if(option.clone) {
                assets[option.to] = this.deepClone(assets[oldKey]);
            } else {
                assets[option.to] = assets[oldKey];
                delete assets[oldKey];
            } 
        }
    }

    isType(obj) {
        return Object.prototype.toString.call(obj).replace(/^\[object ((\S+))\]$/g, '$1')
    }

    deepClone(obj, hash = new WeakMap()) {
        function isComplexDataType(obj) {
            return (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
        }
        if (obj.constructor === Date) {
            return new Date(obj)
        }
        if (obj.constructor === RegExp) {
            return new RegExp(obj)
        }
        if (hash.has(obj)) return hash.get(obj)
        let allDesc = Object.getOwnPropertyDescriptors(obj)
        let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
        hash.set(obj, cloneObj)
        for (let key of Reflect.ownKeys(obj)) {
            cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? this.deepClone(obj[key], hash) : obj[key]
        }
        return cloneObj
    }
}

module.exports = FilenameReplaceWebpackPlugin;