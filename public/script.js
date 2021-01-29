document.addEventListener('DOMContentLoaded', () => {

    const socket = io.connect();

    const brush = {
        isActive: false,
        isMoving: false,
        currentPosition: {x: 0, y: 0},
        previousPosition: null
    }

    const canvas = document.querySelector('#screen');
    const context = canvas.getContext('2d');
    context.lineWidth = 7;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const drawLine = (line) => {

        context.beginPath();
        context.moveTo(line.previousPosition.x, line.previousPosition.y);
        context.lineTo(line.currentPosition.x, line.currentPosition.y);
        context.stroke();
    }


    canvas.onmousedown = () => {
        brush.isActive = true;
    }

    canvas.onmouseup = () => {
        brush.isActive = false;
    }

    canvas.onmousemove = (event) => {
        brush.currentPosition.x = event.clientX;
        brush.currentPosition.y = event.clientY;
        brush.isMoving = true;
    }

    socket.on('draw', (line) => {
        drawLine(line);
    });

    const cicle = () => {
        if(brush.isActive && brush.isMoving && brush.previousPosition){
            socket.emit('draw', {
                currentPosition: (brush.currentPosition),
                previousPosition: (brush.previousPosition)
            });
            brush.isMoving = false;
        } 
        brush.previousPosition = {...brush.currentPosition}
    
        setTimeout(cicle, 10);
    }

    const clearButton = document.getElementById("clear-button");

    clearButton.addEventListener('click', () => {
        socket.emit('clear');
    });

    socket.on('clear', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    cicle();    

})