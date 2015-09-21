var _ = require('lodash')
var hl = require('highlight').Highlight

module.exports = {
    blocks: ["data","output","solution","title","template"],
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

        // console.log(locals)
        // console.log(locals.codes.template)

        var error
        try {

            // var dataFunc = new Function('ctx', 'ctx.data = ' + codes.data)
            // var outputFunc = new Function('ctx', 'ctx.output = ' + codes.output)
            // dataFunc.call(this, ctx)
            // outputFunc.call(this, ctx)
            //
            // // try {
            // var solutionFunc = new Function('data', '_', 'console', codes.solution)
            // var ret = solutionFunc.call(this, ctx.data, lodash, myconsole)
            // locals.ret = ret
            // locals.match = _.isEqual(ctx.output, ret)
            // locals.txt = txt

        } catch (err) {
            console.error(err)
            locals.error = err
        }
        // console.log(locals)
        return ''//jade.renderFile(__dirname + '/lodashexercise.jade', locals)
    }
}
