
function logargs() {
  console.log(arguments)
}

var http = {
  req: function(method,url,data,callback) {
    $.ajax({
      url:         url,
      type:        method,
      contentType: 'application/json',
      data:        data ? JSON.stringify(data) : null,
      dataType:    'json',
      cache:       false,
      success:     callback || logargs,
      error:       callback || logargs
    })
  },


  post: function(url,data,callback) {
    http.req('POST',url,data,callback)
  },

  put: function(url,data,callback) {
    http.req('PUT',url,data,callback)
  },

  get: function(url,callback) {
    http.req('GET',url,null,callback)
  },

  del: function(url,callback) {
    http.req('DELETE',url,null,callback)
  }
}
