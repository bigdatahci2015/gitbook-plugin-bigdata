var Promise = require('bluebird')
var request = Promise.promisifyAll(require('request'))
var jade = require('jade')
var _ = require('lodash')

module.exports = {
    process: function(blk){
        var qstring = _.get(blk,'body','').trim()

        return Promise
            .resolve([{foo:1},{foo:2}])
            .then(function(data){
                this.ctx.data = data
                var locals = {
                    code: qstring
                }
                return jade.renderFile(__dirname + '/mongoquery.jade', locals)
            }.bind(this))
    }
}
