document.addEventListener('DOMContentLoaded', () => {

    const socket = io.connect();

    const brush = {
        isActive: false,
        isMoving: false,
        currentPosition: {relX: 0, relY: 0},
        previousPosition: null
    }

    const canvas = document.querySelector('#screen');
    const context = canvas.getContext('2d');
    context.lineWidth = 10;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight*0.75;
        socket.emit('resize');
    })

    const drawLine = (line) => {

        context.beginPath();
        context.moveTo(line.previousPosition.relX*canvas.width, line.previousPosition.relY*canvas.height);
        context.lineTo(line.currentPosition.relX*canvas.width, line.currentPosition.relY*canvas.height);
        context.stroke();
    }


    canvas.onmousedown = () => {
        brush.isActive = true;
    }

    canvas.onmouseup = () => {
        brush.isActive = false;
    }

    canvas.onmousemove = (event) => {
        brush.currentPosition.relX = event.clientX/canvas.width;
        brush.currentPosition.relY = event.clientY/canvas.height;
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

});