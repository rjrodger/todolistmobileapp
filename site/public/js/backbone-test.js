
function logargs() {
  console.log(arguments)
}

var app = {
  model: {}
}

var bb = {
  model: {}
}


bb.init = function() {

  bb.model.Item = Backbone.Model.extend({    
    defaults: {
      text: ''
    },

    initialize: function() {
      var self = this
      _.bindAll(self)
    }

  })


  bb.model.Items = Backbone.Collection.extend({    
    model: bb.model.Item,
    url: '/api/rest/todo',

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.count = 0

      self.on('reset',function() {
        self.count = self.length
      })
    },

    additem: function() {
      var self = this
      var item = new bb.model.Item({
        text:'item '+self.count
      })
      self.add(item)
      self.count++
      item.save() 
    },

    print: function() {
      var self = this
      self.each(function(item){
        logargs(item.toJSON())
      })
    }
  })

}


app.init = function() {
  bb.init()

  app.model.items = new bb.model.Items()
}


$(app.init)
