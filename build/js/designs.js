// Select color input
// Select size input
const colorPicker = document.getElementById('colorPicker');
const pixelCanvas = document.getElementById('pixelCanvas');

let width = document.getElementById('inputWidth').value;
let height = document.getElementById('inputHeight').value;

// When size is submitted by the user, call makeGrid()
const makeGrid = () => {
    // Your code goes here!
    if (pixelCanvas.hasChildNodes()) {
        while (pixelCanvas.hasChildNodes()) {
            pixelCanvas.removeChild(pixelCanvas.lastChild);
        }
    }

    let tbody = '<tbody>';
    for (let row = 0; row < height; row++) {
        tbody += '<tr>';
        for (let col = 0; col < width; col++) {
            tbody += '<td></td>';
        }
        tbody += '</tr>';
    }
    tbody += '</tbody>';

    pixelCanvas.innerHTML = tbody;
};

document.getElementById('sizePicker').addEventListener('submit', event => {
    event.preventDefault();
    width = document.getElementById('inputWidth').value;
    height = document.getElementById('inputHeight').value;
    makeGrid();
});

let isMousePressed = false;
document.onmousedown = event => {
    isMousePressed = true;
    // capture the element under the mouse when pressed and act as
    // click handler
    dragHandler(event);
};
document.onmouseup = () => isMousePressed = false;

const dragHandler = event => {
    if (event.target.nodeName === 'TD' && isMousePressed) {
        event.target.style.background = colorPicker.value;
    }
};

pixelCanvas.onmouseover = dragHandler;
// pixelCanvas.onmouseout = dragHandler;

document.addEventListener('DOMContentLoaded', () => {
    const submitEvent = document.createEvent('Event');
    submitEvent.initEvent('submit', false, true);
    document.getElementById('sizePicker').dispatchEvent(submitEvent);
});