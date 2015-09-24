var _ = require('lodash')
var lodash = _
var hl = require('highlight').Highlight
var jade = require('jade')

module.exports = {
    blocks: ["data","output","solution","title","template"],
    process: function(blk) {

        var codes = {}
        _.forEach(blk.blocks, function(blk){
            codes[blk.name] = _.get(blk, 'body', '').trim()
        })

        var templateStr = _.get(_.find(blk.blocks, {name: 'template'}), 'body', '').trim()
        var template = _.template(templateStr)

        var txt = ''
        var inspects = []
        var myconsole = {
            log: function(o){
                // console.log(o)
                inspects.push(o)
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
            txt: txt,
            inspects: inspects
        }

        // console.log(locals.c)
        ctx.output = locals.codes.output
        // console.log(locals.codes.output)

        var error
        try {

            var dataFunc = new Function('ctx', 'ctx.data = ' + codes.data)
            // var outputFunc = new Function('ctx', 'ctx.output = ' + codes.output)
            dataFunc.call(this, ctx)
            // outputFunc.call(this, ctx)
            //
            // try {
            var solutionFunc = new Function('data', '_', 'console', 'template', codes.solution)
            var ret = solutionFunc.call(this, ctx.data, lodash, myconsole, template)
            locals.ret = ret
            // locals.match = _.isEqual(ctx.output, ret)
            locals.txt = txt

        } catch (err) {
            console.error(err)
            locals.error = err
        }
        // console.log(locals)
        return jade.renderFile(__dirname + '/vizexercise.jade', locals)
    }
}
