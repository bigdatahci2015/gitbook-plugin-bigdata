require(["gitbook", "jQuery"], function(gitbook, $) {

  gitbook.events.bind("page.change", function() {
      $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      })

      $('.inspect').each(function(i, block) {
          var json = $(block).text()
          $(block).JSONView(json, { collapsed: true })
      })


      var autonavhtml = $('h2').map(function(i) {
          $(this).attr('id','q' + i)
          return '<li><a href=#q'+i+'>' + $(this).find('.text').text() + '</a></li>'
      }).toArray().join('')
      autonavhtml = '<ol>' + autonavhtml + '</ol>'

      $('#autonav').html(autonavhtml)

  })

})
