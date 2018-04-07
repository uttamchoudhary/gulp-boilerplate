var Card = (function() {

    function Card(title, description, parent, draggable) {
        this.title = title;
        this.description = description;
        this.parent = parent;
        this.html = null;
        this.draggable = draggable || false;
        this.generateTemplate();
    }

    Card.prototype.generateTemplate = function() {
        this.html = `<div id="${this.title}" class="card-wrapper" draggable="${this.draggable}">
                        <h1>${this.title}</h1>
                        <p>${this.description}</p>
                    </div>`;
        this.DOMContext = createElementFromHTML(this.html);
        return this;
    }

    Card.prototype.render = function() {
        this.parent.append(this.DOMContext);
        return this;
    }

    Card.prototype.bindEvent = function(evt, cb) {
        $(document).off(evt).on(evt, '#' + this.title, (ev) => {
            ev.originalEvent.dataTransfer.setData("text", this.title);
            if (cb) {
                cb.call(this, ev);
            }
        });
        return this;
    }


    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    function init(title, des, contanier, draggable) {
        return new Card(title, des, contanier, draggable);
    }
    return {
        init: init
    }
}());