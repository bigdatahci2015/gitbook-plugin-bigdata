var lodash = require('lodash')
var hl = require('highlight').Highlight
var _ = require('lodash')
var chai = require('chai')
var assert = require('chai').assert
var jade = require('jade')

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
            return '<pre style="font-size:11px;line-height:1;max-height:300px;">' + JSON.stringify(s,null,' ') + '</pre>'
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
                            // console.log(o)
                            txt = txt + 'console> ' + JSON.stringify(o)
                            txt += '\n'
                        },
                        debug: function(o){
                            // console.debug(o)
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
            githubapi: require('./githubapi'),
            lodashexercise: {
                blocks: ["data","output","solution","title"],
                process: function(blk) {

                    var codes = {}
                    _.forEach(blk.blocks, function(blk){
                        codes[blk.name] = _.get(blk, 'body', '').trim()
                    })

                    var txt = ''
                    var myconsole = {
                        log: function(o){
                            // console.log(o)
                            txt = txt + 'console> ' + JSON.stringify(o)
                            txt += '\n'
                        },
                        debug: function(o){
                            // console.debug(o)
                            txt = txt + 'debug> ' + JSON.stringify(o)
                            txt += '\n'
                        }
                    }

                    var ctx = {}
                    var locals = {
                        ctx: ctx,
                        codes: codes,
                        error: null,
                        ret: null,
                        hl: hl,
                        txt: txt
                    }

                    var error
                    try {

                        var dataFunc = new Function('ctx', 'ctx.data = ' + codes.data)
                        var outputFunc = new Function('ctx', 'ctx.output = ' + codes.output)
                        dataFunc.call(this, ctx)
                        outputFunc.call(this, ctx)

                        // try {
                        var solutionFunc = new Function('data', '_', 'console', codes.solution)
                        var ret = solutionFunc.call(this, ctx.data, lodash, myconsole)
                        locals.ret = ret
                        locals.match = _.isEqual(ctx.output, ret)
                        locals.txt = txt
                        // } catch (err){
                        //     // locals.
                        // }

                    } catch (err) {
                        console.error(err)
                        locals.error = err
                    }
                    // console.log(locals)
                    return jade.renderFile(__dirname + '/lodashexercise.jade', locals)
                }
            },
            json: {
                process: function(blk){
                    return '<pre class="json"">' + JSON.stringify(blk.body) + '</pre>'
                }
            }
    }
}
