var Promise = require('bluebird')
var request = Promise.promisifyAll(require('request'))
var jade = require('jade')
var _ = require('lodash')

module.exports = {
    process: function(blk){

        var url = _.get(blk,'body','').trim()
        if (url.match(/^http/)){

        return request
            .getAsync({
                url:url,
                headers: {
                    'User-Agent': 'bigdatahci2015',
                },
                qs: {
                    client_id: 'bdceb479949622dbf6b2',
                    client_secret: '3ffe6f4f05c9878289935b6bcab56218c46357fa'
                }
            })
            .then(function(x){
                var locals = {}
                if (x[0].statusCode == 200){
                    var data = JSON.parse(x[0].body)
                    locals = {
                        response: data,
                        url: url
                    }
                    this.ctx.data = data
                } else {
                    locals = {
                        error: JSON.parse(x[0].body),
                        url: url
                    }
                }
                return jade.renderFile(__dirname + '/githubapi.jade', locals)

            }.bind(this))

        } else {
            return ''
        }

    }
}
