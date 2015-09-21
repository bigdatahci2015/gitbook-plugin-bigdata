require(["gitbook", "jQuery"], function(gitbook, $) {

  gitbook.events.bind("page.change", function() {
      console.log('do do')
      $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
      })
  })

})
