import Ember from 'ember';

export default Ember.Mixin.create({
    row: null, // the current row being edited
    pointer: null, // the square pointer
    sizer: null, // indicator for drag/paint area
    isDown: 0, // determines if the left mouse button is down
    x:0, y: 0,
    downX:0, upX:0, downY:0, upY:0,
    currentTile: null, // the tile to use for painting
    _self: this,

    Webcel: function(obj){
        var setup, _this = this;
        var isDown = 0;
        return this;
        //return this.setup(obj);
    },

    resize: function(e){
		$(this.sizer).css({left: this.downX > this.upX ? this.upX : this.downX, top: this.downY > this.upY ? this.upY : this.downY});
		$(this.sizer).css({width:Math.abs(this.upX - this.downX) + this.constants.DIM, height:Math.abs(this.upY - this.downY) + this.constants.DIM});
    },

    // select project for painting
    setTile: function(obj){
        this.currentTile = obj;
        /*
    	obj.parent().find("[data-status='selected']").removeAttr('data-status');
    	obj.attr("data-status", "selected");
    	selectedProject = obj;
        */
    },

    // get the area to paint over
    setPaintableArea: function(){
        var temp;
		if(this.downX > this.upX){
			temp = this.upX;
			this.upX = this.downX;
			this.downX = temp;
		}
		if(this.downY > this.upY){
			temp = this.upY;
			this.upY = this.downY;
			this.downY = temp;
		}
    },

    getTiles: function(){
        this.setPaintableArea();
		var addTiles = "";
		var empty = this.currentTile.hasClass('empty');
		var tileClass = this.currentTile.attr('class');

		for(var x = this.downX; x <= this.upX; x+=this.constants.DIM){
			for(var y = this.downY; y <= this.upY; y+=this.constants.DIM){
				var thisTile = $(this.row).find('.tiles [data-x="' + x +'"][data-y="' + y + '"]');
				var thisTileText = $(this.row).find('.text [data-x="' + x +'"][data-y="' + y + '"]');
				//var holidayTile = $(this.row).find('.holidayContainer [data-x="' + x +'"][data-y="' + y + '"]');
                var holidayTile = false;

				if(empty){ // remove tiles
					thisTile.remove();
					thisTileText.remove();
				}
				else{
					thisTile.remove();
					if(!holidayTile.length){ // tile does not exist, create new tile if not a holiday
						addTiles+='<span class="' + tileClass + '" data-scope="project" data-type="tile" data-x="' + x + '" data-y="' + y + '"';

						// add year indicator for vacation tracking
                        /*
                        this.constants.daily ?
							tileClass == "vacationCarryover" ?
							addTiles+=' data-year="' + (x < nextYear ? (calendarYear - 1) : calendarYear) + '"' :
							addTiles+=' data-year="' + (x < nextYear ? calendarYear : (calendarYear + 1)) + '"' : 0;
                            */

						addTiles+='></span>';
                        /*
						if(thisTileText.length){ // tile text exists, update text identifier
							thisTileText.attr('class', selectedProjectClass);
						}
                        */
					}
				}
			}
		}
		addTiles != "" ? $(this.row).find(".tiles")[0].innerHTML += addTiles : 0;
        /*
        */
		$(this.sizer).hide();
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
                    self.resize(e);
                    self.getTiles(e);
					self.isDown = 0;
                }
            }
        }

        $(this.row).bind('mousemove', movePointer);
        $(this.row).bind('mousedown', mouseDown);
        $(this.row).bind('mouseup', mouseUp);

        return this;
    },

    done: function(){
        $(this.row).unbind('mousemove');
        $(this.row).unbind('mousedown');
        $(this.row).unbind('mouseup');
        //this.constants.webcel = null;
    }
});
