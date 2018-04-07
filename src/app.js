$(document).ready(function() {

    Card.init('firstCard', 'description', $('.container1'), true).render().bindEvent('dragstart', cb);
    Card.init('secondCard', 'awesome', $('.container1')).render();
});

function allowDrop(ev) {
    ev.preventDefault();
}

function cb(evt) {
    console.log(this, evt);
}


function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}