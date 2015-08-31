var lodash = require('lodash')
var hl = require('highlight').Highlight

module.exports = {
    website: {
      assets: "./book",
      css: [
        "highlight.css",
        "bigdata.css"
      ]
    },
    // Extend templating filters
    filters: {
        // Author will be able to write "{{ 'test'|myFilter }}"
        json: function(s) {
            return '<pre>' + JSON.stringify(s,null,' ') + '</pre>'
        }
    },
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

                    var txt = ''
                    var myconsole = {
                        log: function(o){
                            console.log(o)
                            txt = txt + 'console> ' + JSON.stringify(o)
                            txt += '\n'
                        },
                        debug: function(o){
                            console.debug(o)
                            txt = txt + 'debug> ' + JSON.stringify(o)
                            txt += '\n'
                        }
                    }

                    var f = new Function('data', '_', 'console', blk.body)

                    var error
                    try {
                        var ret = f.call(this, this.ctx.data, lodash, myconsole)
                        this.ctx.result = ret


                    } catch (err) {

                        this.ctx.result = undefined
                        error = err
                    }

                    var html = '<pre>' + hl(blk.body) + '</pre>'
                    if (txt)
                        html = html + '<div class="console"><pre>' + txt + '</pre></div>'
                    if (error)
                        html = html + '<div class="console error">' + error.stack + '</div>'
                    return html

                }
            },
            json: {
                process: function(blk){
                    // console.log(blk.body)

                    // var f = new Function('data', '_', blk.body)
                    // f.call(this, this.ctx.data, lodash)
                    // console.log(this.ctx.data)
                    // console.log(this.ctx.data.comments)
                    return '<pre>' + JSON.stringify(blk.body) + '</pre>'
                }
            }
    }
}
