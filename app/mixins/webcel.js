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
        $(this.sizer).css({top: this.downY > this.upY ? this.upY : this.downY});
		$(this.sizer).css({height:Math.abs(this.upY - this.downY) + this.constants.DIM});

        // only resize if not over the un-editable area
        if(this.upX >= this.constants.prevYear || this.get('router.currentRouteName') != 'home'){
    		$(this.sizer).css({left: this.downX > this.upX ? this.upX : this.downX });
    		$(this.sizer).css({width:Math.abs(this.upX - this.downX) + this.constants.DIM});
        }
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
		var tileClass = "";
		var tileAssignment = this.currentTile.attr('data-assignment');
        var clone = $(this.row).clone(); // clone needed for removing tiles if applicable

		for(var x = this.downX; x <= this.upX; x+=this.constants.DIM){
            // permit tiles on anything after the previous year, on the home screen (editing resources)
            if(x >= this.constants.prevYear || this.get('router.currentRouteName') != 'home'){
    			for(var y = this.downY; y <= this.upY; y+=this.constants.DIM){
    				var thisTile = $(clone).find('.tiles [data-x="' + x +'"][data-y="' + y + '"]');
    				thisTile.remove();
                    if(this.get('router.currentRouteName') === 'assignments.index' && empty) {
        				var thisPhase = $(clone).find('.phases [data-x="' + x +'"][data-y="' + y + '"]');
        				thisPhase.remove();
                    }

    				if(!empty){ // repaint area if delete tile not chosen
                        var holidayTile = this.constants.daily ? this.constants.holidayColumns.contains(x) : false;

    					if(!holidayTile){ // create tile if it is not a holiday column
                            var stamp = (thisTile.length && thisTile.attr('data-stamp')) ? ' data-stamp="true"' : "";
                            var dataAssignment = ""; // the assignment tile ID if applicable

                            if(this.constants.daily){ // add year indicator for out of office tracking
                        		tileClass = this.currentTile.attr('class');
                                var dataYear = tileClass == "vacationCarryover" ?
                                    (x < this.constants.nextYear ? (this.year - 1) : this.year) :
                                    (x < this.constants.nextYear ? this.year : (this.year + 1))
                                tileClass = ' class="' + tileClass + '"';
                            } else {
                                var dataYear = x < this.constants.nextYear ? this.year : (this.year + 1)
                                dataAssignment = ' data-assignment="' + tileAssignment + '"';
                            };
    						addTiles+=
                                '<span data-type="tile" data-x="' + x + '" data-y="' + y + '"' +
                                tileClass +
        						' data-year="' + dataYear + '"' +
                                dataAssignment + stamp + '></span>';
    					}// if !holidayTile
    				}//  non delete action
    			}// for y-axis
            }//if x is greater than prevYear
		}// for x-axis

		addTiles = ($(clone).find(".tiles")[0].innerHTML.replace(/<!---->/g, '').trim() + addTiles).htmlSafe();
		//phases = ($(clone).find(".phases")[0].innerHTML.replace(/<!---->/g, '').trim() + phases).htmlSafe();

        this.constants.daily ?
            this.data.set('timeaway', addTiles) :
            this.data.set('assignment', addTiles);

        // update the phaes in case they were shifted, deleted etc
        if(this.get('router.currentRouteName') === 'assignments.index') {
            this.data.set('phases', ($(clone).find('.phases')[0].innerHTML).htmlSafe());
        }

		$(this.sizer).hide();
        this.downX = this.upX = 0;
    },

    setPhase: function(){
        // only create the phase stamp if a phase is selected
        if(this.data.get('stampPhase')) {
            var clone = $(this.row).clone(); // clone needed for removing tiles if applicable
            var exists = $(clone).find('.phases [data-x="' + this.downX + '"][data-y="' + this.downY + '"]');

            // remove any existing phases so that they do not overlap
            if(exists.length){ $(exists)[0].remove(); }

            var stamp = "";
            var phase = 'data-phase="' + this.data.get('stampPhase') + '"';
    		stamp+=
                '<span data-type="tile" data-stamp="true"' + phase + ' data-x="' + this.downX + '" data-y="' + this.downY + '"' +
                '"></span>';

    		stamp = ($(clone).find(".phases")[0].innerHTML.replace(/<!---->/g, '').trim() + stamp).htmlSafe();
            this.data.set('phases', stamp);
        }
    },

    //setup: function(obj, emData){
    setup: function(params){
        var movePointer, mouseDown, mouseUp;
        this.constants.webcel = this;
        this.row = params.row;
        this.data = params.data;
        this.rowComponent = params.rowComponent;

        var self = this;
        setTimeout(function(){
            self.pointer = $(self.row).find('.pointer')[0];
            self.sizer = $(self.row).find('.sizer')[0];
        }, 0)
        this.maxY = this.constants.daily ? 0 : 45;
        var self = this;

        movePointer = function(e){
    		self.x = e.pageX - $(this).offset().left;
    		self.x = self.x - self.x%self.constants.DIM ;
    		self.y = e.pageY  - $(this).offset().top;
    		self.y = self.y - self.y%self.constants.DIM;
            self.y > self.maxY ? self.y = self.maxY : 0;

            // only allow the pointer to move if it is not in the un-editable area
            if(self.x >= self.constants.prevYear || self.get('router.currentRouteName') != 'home'){ $(self.pointer).css({left:self.x}); }
            $(self.pointer).css({top:self.y});

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
            if(self.rowComponent.get('shiftPhase')) return; // do not paint if the user wants to shift the phases around
			self.downX = e.pageX - $(this).offset().left;
            if(self.downX < self.constants.prevYear && self.get('router.currentRouteName') === 'home') return;
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

                    // stamps limited to phases of the project defined in the assignment-phases component
                    if(self.get('router.currentRouteName') === 'assignments.index') {
                        //console.log(self.data.get('stampPhase'))
                        self.setPhase(e);
                    }
                    // stamps  the short name of the project on the project tile
                    else {
    					var thisTile = $(self.row).find('.tiles [data-x="' + self.downX +'"][data-y="' + self.downY + '"]');
                        if(thisTile.attr('data-stamp') == "true"){ thisTile.removeAttr('data-stamp') }
                        else{ thisTile.attr('data-stamp', true) }


                		var addTiles = ($(self.row).find(".tiles")[0].innerHTML.replace(/<!---->/gi, '').trim()).htmlSafe();
                        self.constants.daily ?
                            self.data.set('timeaway', addTiles) :
                            self.data.set('assignment', addTiles);
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
