function pd( func ) {
  return function( event ) {
    event.preventDefault()
    func && func(event)
  }
}

document.ontouchmove = pd()

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape:      /\{\{-(.+?)\}\}/g,
  evaluate:    /\{\{=(.+?)\}\}/g
};


var browser = {
  android: /Android/.test(navigator.userAgent)
}
browser.iphone = !browser.android


var app = {
  model: {},
  view: {}
}

var bb = {
  model: {},
  view: {}
}


bb.init = function() {

  var scrollContent = {
    scroll: function() {
      var self = this
      setTimeout( function() {
        if( self.scroller ) {
          self.scroller.refresh()
        }
        else {
          self.scroller = new iScroll( $("div[data-role='content']")[0] )
        }
      },1)
    }
  }


  bb.model.State = Backbone.Model.extend(_.extend({    
    defaults: {
      items: 'loading'
    },
  }))


  bb.model.Item = Backbone.Model.extend(_.extend({    
    defaults: {
      text: ''
    },

    initialize: function() {
      var self = this
      _.bindAll(self)
    }

  }))


  bb.model.Items = Backbone.Collection.extend(_.extend({    
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
    }

  }))


  bb.view.Head = Backbone.View.extend(_.extend({    
    events: {
      'tap #add': function(){ 
        var self = this
        self.items.additem() 
      }
    },

    initialize: function( items ) {
      var self = this
      _.bindAll(self)
      self.items = items

      self.setElement("div[data-role='header']")

      self.elem = {
        add: self.$el.find('#add'),
        title: self.$el.find('h1')
      }
      
      self.tm = {
        title: _.template( self.elem.title.html() )
      }

      self.elem.add.hide()

      app.model.state.on('change:items',self.render)
      self.items.on('add',self.render)
    },

    render: function() {
      var self = this
      
      var loaded = 'loaded' == app.model.state.get('items')

      self.elem.title.html( self.tm.title({
        title: loaded ? self.items.length+' Items' : 'Loading...'
      }) )

      if( loaded ) {
        self.elem.add.show()
      }
    }    

  }))



  bb.view.List = Backbone.View.extend(_.extend({    

    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.setElement('#list')
    
      self.items = items
      self.items.on('add',self.appenditem)
    },


    render: function() {
      var self = this

      self.$el.empty()

      self.items.each(function(item){
        self.appenditem(item)
      })
    },


    appenditem: function(item) {
      var self = this

      var itemview = new bb.view.Item({
        model: item
      })

      self.$el.append( itemview.$el.html() )      
      self.scroll()
    }

  },scrollContent))



  bb.view.Item = Backbone.View.extend(_.extend({    
    initialize: function() {
      var self = this
      _.bindAll(self)
      self.render()
    },

    render: function() {
      var self = this
      var html = self.tm.item( self.model.toJSON() )
      self.$el.append( html )      
    }

  },{
    tm: {
      item: _.template( $('#list').html() )
    }
  }))

}


app.init_browser = function() {
  if( browser.android ) {
    $("#main div[data-role='content']").css({
      bottom: 0
    })
  }
}


app.init = function() {
  console.log('start init')

  bb.init()

  app.init_browser()


  app.model.state = new bb.model.State()
  app.model.items = new bb.model.Items()

  app.view.head = new bb.view.Head(app.model.items)
  app.view.head.render()

  app.view.list = new bb.view.List(app.model.items)
  app.view.list.render()

  app.model.items.fetch( {
    success: function() {
      app.model.state.set({items:'loaded'})
      app.view.list.render()
    }
  })


  console.log('end init')
}


$(app.init)
