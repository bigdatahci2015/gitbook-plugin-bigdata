var lodash = require('lodash')

module.exports = {
    blocks: {
            svg: {
                process: function(blk){
                    return '<svg height="300" width="500">'
                        + blk.body  +
                    '</svg>'
                }
            },
            lodash: {
                process: function(blk){
                    var f = new Function('data', '_', blk.body)
                    var ret = f.call(this, this.ctx.data, lodash)
                    this.ctx.result = ret
                    return '<pre>' + blk.body +'</pre>'
                }
            },
            json: {
                process: function(blk){
                    return '<pre>' + blk.body + '</pre>'
                }
            }
    }
}
