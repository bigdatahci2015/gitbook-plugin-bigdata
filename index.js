var loadsh = require('lodash')

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
                    // console.log(blk.body)

                    var f = new Function('data', '_', blk.body)

                    var ret = f.call(this, this.ctx.data, lodash)
                    console.log(ret)
                    this.ctx.result = ret
                    // console.log(this.ctx.data.comments)
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
