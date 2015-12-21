import Ember from 'ember';

export default Ember.Mixin.create({
    row: null, // the current row being edited
    pointer: null, // the square pointer
    sizer: null, // indicator for drag/paint area
    isDown: 0, // determines if the left mouse button is down
    x:0, y: 0,
    downX:0, upX:0, downY:0, upY:0,
    _self: this,

    Webcel: function(obj){
        var setup, _this = this;
        var isDown = 0;
        return this.setup(obj);
    },

    resize: function(e){
		$(this.sizer).css({left: this.downX > this.upX ? this.upX : this.downX, top: this.downY > this.upY ? this.upY : this.downY});
		$(this.sizer).css({width:Math.abs(this.upX - this.downX) + this.constants.DIM, height:Math.abs(this.upY - this.downY) + this.constants.DIM});
    },

    setup: function(obj){
        var movePointer, mouseDown, mouseUp;
        this.constants.webcel = this;
        this.row = $($(obj.context.parentNode).find('.row')[0]);
        this.pointer = $(this.row).find('.pointer')[0]
        this.sizer = $(this.row).find('.sizer')[0]
        this.maxY = this.constants.daily ? 0 : 45;
        var self = this;

        movePointer = function(e){
    		self.x = e.pageX - $(this).offset().left;
    		self.x = self.x - self.x%self.constants.DIM ;
    		self.y = e.pageY  - $(this).offset().top;
    		self.y = self.y - self.y%self.constants.DIM;
            self.y > self.maxY ? self.y = self.maxY : 0;
			$(self.pointer).css({left:self.x,top:self.y});

            if(self.isDown){
				self.upX = e.pageX  - $(this).offset().left;
				self.upX = self.upX - self.upX%self.constants.DIM;

				self.upY = e.pageY  - $(this).offset().top;
				self.upY = self.upY - self.upY%self.constants.DIM;
                self.upY > self.maxY ? self.upY = self.maxY : 0;

				self.resize(e);
				$(self.sizer).show();
			}
        }

		mouseDown = function(e){
			switch (e.which){
				case 1: { // left mouse button
                    if(!self.isDown){
						self.isDown = 1;
						self.downX = e.pageX - $(this).offset().left;
						self.upX = self.downX = self.downX - self.downX%self.constants.DIM;
						self.downY = e.pageY  - $(this).offset().top
						self.upY = self.downY = self.downY - self.downY%self.constants.DIM;

                        self.downY > self.maxY ? self.downY = self.maxY : 0;
                        /*
                        //self.resize(e);
						sizer.show();
                        */
                    }
                    break;
                }
            }//switch
        }//mouseDOwn


		mouseUp = function(e){
			switch (e.which){
				case 1: { // left mouse
					self.isDown = 0;
                    self.resize(e)
                }
            }
        }

        $(this.row).bind('mousemove', movePointer);
        $(this.row).bind('mousedown', mouseDown);
        $(this.row).bind('mouseup', mouseUp);

        return this;
    },

    done: function(){
        this.constants.webcel = null;
    }
});
