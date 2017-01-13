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

    Webcel: function(){
        return this;
    },

    resize: function(){
        Ember.$(this.sizer).css({top: this.downY > this.upY ? this.upY : this.downY});
		Ember.$(this.sizer).css({height:Math.abs(this.upY - this.downY) + this.constants.DIM});

        // only resize if not over the un-editable area
        //if(this.upX >= this.constants.prevYear || this.get('router.currentRouteName') !== 'home'){
        if(this.upX >= 0 || this.get('router.currentRouteName') !== 'home'){
    		Ember.$(this.sizer).css({left: this.downX > this.upX ? this.upX : this.downX });
    		Ember.$(this.sizer).css({width:Math.abs(this.upX - this.downX) + this.constants.DIM});
        }
    },

    // set tile for painting
    setTile: function(obj){
        this.currentTile = obj;
    },

    // determines if we want to delete the painted tile or not
    deleteTile: function(bool){
        this.deleting = bool;
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
		var tileClass = "";
		var tileAssignment = this.currentTile.attr('data-assignment');
        var clone = Ember.$(this.row).clone(); // clone needed for removing tiles if applicable

		for(var x = this.downX; x <= this.upX; x+=this.constants.DIM){
            // permit tiles on anything after the previous year, on the home screen (editing resources)
            //if(x >= this.constants.prevYear || this.get('router.currentRouteName') !== 'home'){
            if(x >= 0 || this.get('router.currentRouteName') !== 'home'){
    			for(var y = this.downY; y <= this.upY; y+=this.constants.DIM){
    				var thisTile = Ember.$(clone).find('.tiles [data-x="' + x +'"][data-y="' + y + '"]');
    				thisTile.remove();
                    if(this.get('router.currentRouteName') === 'roadmap.index' && this.deleting){
        				var thisPhase = Ember.$(clone).find('.phases [data-x="' + x +'"][data-y="' + y + '"]');
        				thisPhase.remove();
                    }

    				if(!this.deleting){ // repaint area if delete tile not chosen
                        var holidayTile = this.constants.daily ? this.constants.holidayColumns.contains(x) : false;

    					if(!holidayTile){ // create tile if it is not a holiday column
                            var dataYear;
                            var stamp = (thisTile.length && thisTile.attr('data-stamp')) ? ' data-stamp="true"' : "";
                            var dataAssignment = ""; // the assignment tile ID if applicable

                            if(this.constants.daily){ // add year indicator for out of office tracking
                        		tileClass = this.currentTile.attr('class');
                                dataYear = tileClass === "vacationCarryover" ?
                                    (x < this.constants.nextYear ? (this.get('year') -1) : this.get('year')) :
                                    (x < this.constants.prevYear ? (this.get('year') -1) : x < this.constants.nextYear ? this.get('year') : (this.get('year') + 1));
                                tileClass = ' class="' + tileClass + '"';
                            } else {
                                dataYear = x < this.constants.nextYear ? this.get('year') : (this.get('year') + 1);
                                dataAssignment = ' data-assignment="' + tileAssignment + '"';
                            }
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

		addTiles = (Ember.$(clone).find(".tiles")[0].innerHTML.replace(/<!---->/g, '').trim() + addTiles).htmlSafe();

        addTiles = this.sortTiles(addTiles);

        this.data.set(this.constants.daily ? 'timeaway' : 'assignment', addTiles);
        if(this.constants.daily) { this.rowComponent.updateCounters(); }

		Ember.$(this.sizer).hide();
        this.downX = this.upX = 0;
    },//getTiles

    sortTiles: function(addTiles){
        if(this.constants.daily){
            var div = Ember.$('<div></div>').append(addTiles.string);
            div.find('span').sort(function(a, b) {
                return +a.getAttribute('data-x') - +b.getAttribute('data-x');
            }).appendTo(div);

            Ember.$(div[0].childNodes).each(function(index){
                const prev = Ember.$(div[0].childNodes)[index - 1];

                if(!(Ember.$(this).attr('class') === Ember.$(prev).attr('class') &&
                    Ember.$(this).attr('data-x') - Ember.$(prev).attr('data-x') <= 15)){
                    Ember.$(this).attr('data-stamp', true);
                } else {
                    Ember.$(this).removeAttr('data-stamp');
                }
            });
            addTiles = div[0].innerHTML.htmlSafe();
        }
        return addTiles;
    },

    setPhase: function(){
        // only create the phase stamp if a phase is selected
        if(this.data.get('stampPhase')){
            var clone = Ember.$(this.row).clone(); // clone needed for removing tiles if applicable
            var exists = Ember.$(clone).find('.phases [data-x="' + this.downX + '"][data-y="' + this.downY + '"]');

            // remove any existing phases so that they do not overlap
            if(exists.length){ Ember.$(exists)[0].remove(); }

            var stamp = "";
            var phase = 'data-phase="' + this.data.get('stampPhase') + '"';
    		stamp+=
                '<span data-type="tile" data-stamp="true"' + phase + ' data-x="' + this.downX + '" data-y="' + this.downY + '"></span>';

    		stamp = (Ember.$(clone).find(".phases")[0].innerHTML.replace(/<!---->/g, '').trim() + stamp).htmlSafe();
            this.data.set('phases', stamp);
        }
    },

    dragAssignmentHandle:function(){
        if(this.handle){
            var newWidth = this.get('rowComponent.assignment.originalWidth');

            if(this.handle === "left"){
                newWidth += this.downX - this.upX;
                if(newWidth >= this.get('rowComponent.assignment.minWidth')){ this.set('rowComponent.assignment.x', this.upX); }
            }
            else if(this.handle === "right"){
                newWidth += this.upX - this.downX;
            }

            newWidth = Math.max(this.get('rowComponent.assignment.minWidth'), newWidth); // minimum width
            if(this.get('rowComponent.assignment.x') + newWidth <= this.constants.calWidth){ // maximum width
                this.set('rowComponent.assignment.w', newWidth);
            }
        }
    },

    setup: function(params){
        var movePointer, mouseDown, mouseUp;
        this.constants.webcel = this;
        this.row = params.row;
        this.data = params.data;
        this.rowComponent = params.rowComponent;

        var self = this;
        setTimeout(function(){
            self.pointer = Ember.$(self.row).find('.pointer')[0];
            self.sizer = Ember.$(self.row).find('.sizer')[0];
        }, 0);
        this.maxY = this.constants.daily ? 0 : 45;

        movePointer = function(e){
    		self.x = e.pageX - Ember.$(this).offset().left;
    		self.x = self.x - self.x%self.constants.DIM;
    		self.y = e.pageY  - Ember.$(this).offset().top;
    		self.y = self.y - self.y%self.constants.DIM;

            self.y = self.y > self.maxY ? self.maxY : self.y;

            // only allow the pointer to move if it is not in the un-editable area
            //if(self.x >= self.constants.prevYear || self.get('router.currentRouteName') !== 'home'){ Ember.$(self.pointer).css({left:self.x}); }
            if(self.x >= 0 || self.get('router.currentRouteName') !== 'home'){ Ember.$(self.pointer).css({left:self.x}); }
            Ember.$(self.pointer).css({top:self.y});

            if(self.isDown){
				self.upX = e.pageX  - Ember.$(this).offset().left;
				self.upX = self.upX - self.upX%self.constants.DIM;

				self.upY = e.pageY  - Ember.$(this).offset().top;
				self.upY = self.upY - self.upY%self.constants.DIM;
                self.upY = self.upY > self.maxY ? self.maxY : self.upY;

                if(self.get('router.currentRouteName') === 'roadmap.index'){
                    self.dragAssignmentHandle();
                }
                else{
    				self.resize(e);
    				Ember.$(self.sizer).show();
                }
			}
        };

		mouseDown = function(e){
            // clicking on the stamp that you want to move around
            if(self.rowComponent.get('phaseAction').match(/shift|delete/)){
                const obj = Ember.$(e.target).closest(`[data-type="tile"]`);
                self.downX = self.upX = obj.attr('data-x');
                self.downY = self.upY = obj.attr('data-y');
            }
            else {
    			self.downX = e.pageX - Ember.$(this).offset().left;
                //if(self.downX < self.constants.prevYear && self.get('router.currentRouteName') === 'home'){ return; }
    			self.upX = self.downX = self.downX - self.downX%self.constants.DIM;
    			self.downY = e.pageY  - Ember.$(this).offset().top;
    			self.downY = self.downY - self.downY%self.constants.DIM;

                self.downY = self.downY > self.maxY ? self.maxY : self.downY;
                self.upY = self.downY;
            }

			switch (e.which){
				case 1: { // left mouse button
                    if(self.rowComponent.get('phaseAction') === 'shift'){ break; } // do not paint if the user wants to shift the phases around
                    if(self.get('router.currentRouteName') === 'roadmap.index'){
                        if(self.rowComponent.get('phaseAction') === 'stamp') { // stamp the roadmap with phases
                            self.setPhase(e); // stamps limited to phases of the project defined in the assignment-phases component
                        } else {
                            self.handle = Ember.$(e.target).hasClass('handle') ? Ember.$(e.target).hasClass('left') ? "left" : "right" : false;
                            self.downX = self.get('rowComponent.assignment.x');
                            if(self.handle === "right"){ self.downX += self.get('rowComponent.assignment.w') - self.constants.DIM; }
                            self.set('rowComponent.assignment.originalWidth', self.get('rowComponent.assignment.w'));
                        }
                    }
                    if(!self.isDown){ self.isDown = 1; }
                    break;
                }
				case 3: { // right click: stamp
                    if(!(self.constants.daily || self.get('router.currentRouteName') === 'roadmap.index')) {  // with auto-stamping outOfOffice codes, disable right-click stamp of these tiles
    					var thisTile = Ember.$(self.row).find('.tiles [data-x="' + self.downX +'"][data-y="' + self.downY + '"]');
                        if(thisTile.attr('data-stamp') === "true"){ thisTile.removeAttr('data-stamp'); }
                        else{ thisTile.attr('data-stamp', true); }

                		var addTiles = (Ember.$(self.row).find(".tiles")[0].innerHTML.replace(/<!---->/gi, '').trim()).htmlSafe();

                        self.data.set(self.constants.daily ? 'timeaway' : 'assignment', addTiles);
                    }
                    break;
                }
            }//switch
        };//mouseDOwn

		mouseUp = function(e){
			switch (e.which){
				case 1: { // left mouse
                    if(self.rowComponent.get('phaseAction') === 'shift'){
                        self.rowComponent.getPhaseShift(self.upX, self.upY);
                    }
                    else if(self.rowComponent.get('phaseAction') === 'delete'){
                        self.rowComponent.getPhaseDelete(self.upX, self.upY);
                    }
                    else{
                        if(self.get('router.currentRouteName') !== 'roadmap.index'){
                            self.resize(e);
                            self.getTiles(e);
                        }
                        self.isDown = 0;
                    }
                }
            }
        };// mouseUp

        Ember.$(this.row).bind('mousemove', movePointer);
        Ember.$(this.row).bind('mousedown', mouseDown).bind('contextmenu', function(e){e.preventDefault();});
        Ember.$(this.row).bind('mouseup', mouseUp);

        return this;
    },// setup

    done: function(){
        Ember.$(this.row).unbind('mousemove');
        Ember.$(this.row).unbind('mousedown');
        Ember.$(this.row).unbind('mouseup');
    }
});
