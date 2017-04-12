import Ember from 'ember';

export default Ember.Component.extend({
    tagName:"",

    getDetails: Ember.computed('assignment.stampCustomize', function(){
        const obj = this.get('assignment.stampCustomize')[0];
        this.set('stamp', obj);
        let details = Ember.$(this.get('stamp')).find('.details');

        if(!details.length){
            details = Ember.$(`<div class="details" data-date-fr="${this.get("getFromDay")}" data-date-to="${this.get("getToDay")}"></div>`);
            Ember.$(this.get('stamp')).append(details);
        }
        else {
            details.attr('data-date-fr', this.get('getFromDay'));
            details.attr('data-date-to', this.get('getToDay'));
        }

        return details.html();
    }).property('getFromDay', 'getToDay'),

    // before pasting into the div, make sure no styles generated by chrome get included
    sanitize: function(tag){
        Ember.$('*', Ember.$(tag)).each(function () {
            Ember.$(this).removeAttr('style');
            if(this.className==="Apple-converted-space" || this.tagName.match(/meta/gi)){
                Ember.$(this).remove();
            }
        });
        return tag;
    },

    /* checks if the contenteditable area is empty
     * if it is, ensure to stick in an empty div to get the proper styles for bullets
     */
    checkEmpty: function(flag){
        const contents = event.target.innerHTML.replace(/<!---->/gi, '').trim();
        if(!event.target.childNodes.length ||           // empty
            contents === '' ||                // blank textnode
            contents === "<br>" ||            // br inserted by chrome
            contents === "<div><br></div>"    // div inserted by code to create bullet style
        ){
            if(flag){ return true; } // return if it's empty w/o adding any item
            event.target.innerHTML = "";
            Ember.$(event.target).innerHTML="";
            Ember.$(event.target).append("<div><br></div>");
            return false;
        }
        if(flag) { return false; }
        return true;
    },

    actions: {
        keyup(){
            // if deleting, make sure the editable area is not empty: if it is, reinsert blank div
            if(event.keyCode === 46 || event.keyCode === 8){
                return this.checkEmpty();
            }
            else { // let whatever characters go through
                return true;
            }
        },

        updateDetails(){
            let details = Ember.$(this.get('stamp')).find('.details');

            // if the details are empty, clear out contents
            if(this.checkEmpty(true)){
                details.html('');
                return;
            }
            details.html(event.target.innerHTML.trim());
        },

        checkEmpty() {
            return this.checkEmpty();
        },

        paste(){
            let temp;
            let pasteTarget = Ember.$(event.target)[0].innerHTML;
             if (event.clipboardData && event.clipboardData.getData) {
                let paste = event.clipboardData.getData('text/html');
                temp = Ember.$('<div></div>').append(paste);
                temp = this.sanitize(temp);
             }

             // if pasting into an open div with no content, remove div so you don't end up nesting the pasted content into that bullet
             if(pasteTarget === ''){
                Ember.$(event.target).parent().remove();
             }

            document.execCommand("insertHTML", false, temp[0].innerHTML); // pasted the copied content
            document.execCommand("insertHTML", '<br>'); // add new line to force chrome to not merge existing bullets after pasting
            return false;
        }
    }
});