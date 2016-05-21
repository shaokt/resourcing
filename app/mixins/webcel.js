import Ember from 'ember';
import CalendarWidget from '../components/calendar-widget';

export default Ember.Mixin.create(CalendarWidget, {
    row: null, // the current row being edited
    pointer: null, // the square pointer
    sizer: null, // indicator for drag/paint area
    isDown: 0, // determines if the left mouse button is down
    x:0, y: 0,
    downX:0, upX:0, downY:0, upY:0,
    currentTile: null, // the tile to use for painting
    _self: this,

    Webcel: function(obj, emData){
        var setup, _this = this;
        var isDown = 0;
        return this;
    },

    resize: function(e){
		$(this.sizer).css({left: this.downX > this.upX ? this.upX : this.downX, top: this.downY > this.upY ? this.upY : this.downY});
		$(this.sizer).css({width:Math.abs(this.upX - this.downX) + this.constants.DIM, height:Math.abs(this.upY - this.downY) + this.constants.DIM});
    },

    // set tile for painting
    setTile: function(obj){
        this.currentTile = obj;
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
		var tileAssignment = this.currentTile.attr('data-assignment');
        var clone = $(this.row).clone(); // clone needed for removing tiles if applicable

		for(var x = this.downX; x <= this.upX; x+=this.constants.DIM){
			for(var y = this.downY; y <= this.upY; y+=this.constants.DIM){
				var thisTile = $(clone).find('.tiles [data-x="' + x +'"][data-y="' + y + '"]');
                var holidayTile = this.constants.holidayColumns.contains(x);

				if(empty){ // remove tiles
					thisTile.remove();
				}
				else{
                    var stamp = "";
                    if(thisTile.length && thisTile.attr('data-stamp')){
                        stamp = ' data-stamp="true"';
                    }
                    thisTile.remove();
					if(!holidayTile){ // create tile if it is not a holiday column
                        if(x > this.constants.prevYear){ // only permit tiles on anything after the previous year
    						addTiles+='<span data-type="tile" data-x="' + x + '" data-y="' + y + '"';

    						// add year indicator for out of office tracking
                            if(this.constants.daily){
                                addTiles+='class="' + tileClass + '"';
                                tileClass == "vacationCarryover" ?
        							addTiles+=' data-year="' + (x < this.constants.nextYear ? (this.year - 1) : this.year) + '"' :
        							addTiles+=' data-year="' + (x < this.constants.nextYear ? this.year : (this.year + 1)) + '"'
                            } else {
                                addTiles+=' data-assignment="' + tileAssignment + '"';
                               addTiles+=' data-year="' + (x < this.constants.nextYear ? this.year : (this.year + 1)) + '"'

                            };

    						addTiles+= stamp + '></span>';
                        }
					}
				}
			}
		}


		addTiles = ($(clone).find(".tiles")[0].innerHTML.replace(/<!---->/g, '').trim() + addTiles).htmlSafe();

        this.constants.daily ?
            this.data.set('timeaway', addTiles) :
            this.data.set('assignment', addTiles);

		$(this.sizer).hide();
    },

    //setup: function(obj, emData){
    setup: function(params){
        var movePointer, mouseDown, mouseUp;
        this.constants.webcel = this;
        this.row = params.row;
        this.data = params.data;

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
			self.downX = e.pageX - $(this).offset().left;
			self.upX = self.downX = self.downX - self.downX%self.constants.DIM;
			self.downY = e.pageY  - $(this).offset().top
			self.downY = self.downY - self.downY%self.constants.DIM;

            self.downY > self.maxY ? self.downY = self.maxY : 0;
            self.upY = self.downY;

			switch (e.which){
				case 1: { // left mouse button
                    if(!self.isDown){
            			self.isDown = 1;
                        /*
                        //self.resize(e);
						sizer.show();
                        */
                    }
                    break;
                }
				case 3: { // right click: stamp
					var thisTile = $(self.row).find('.tiles [data-x="' + self.downX +'"][data-y="' + self.downY + '"]');
                    if(thisTile.attr('data-stamp') == "true"){ thisTile.removeAttr('data-stamp') }
                    else{ thisTile.attr('data-stamp', true) }


            		var addTiles = ($(self.row).find(".tiles")[0].innerHTML.replace(/<!---->/gi, '').trim()).htmlSafe();
                    self.constants.daily ?
                        self.data.set('timeaway', addTiles) :
                        self.data.set('assignment', addTiles);
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
        $(this.row).bind('mousedown', mouseDown).bind('contextmenu', function(e){e.preventDefault();});
        $(this.row).bind('mouseup', mouseUp);

        return this;
    },

    done: function(){
        $(this.row).unbind('mousemove');
        $(this.row).unbind('mousedown');
        $(this.row).unbind('mouseup');
    }
});
