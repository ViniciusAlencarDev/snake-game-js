const width = 800
const height = 800

const canvas = document.querySelector('canvas');
canvas.width = width
canvas.height = height
const ctx = canvas.getContext('2d')

game()

function game() {

    const TIMEOUT_INIT_VALUE = 100
    let size = 40

    let direction = [0, 0]
    let snake = [
        [0, 0]
    ]
    let score = 0
    let record = 0
    let timeinterval = null
    let timeoutMs = TIMEOUT_INIT_VALUE
    let positionFood = [0, 0]
    const w = width / size
    const h = height / size
    const color = '#fff'
    size = size % 2 === 0 ? size : size + 1;
    direction[Math.floor(Math.random() * 2)] = 1 * [-1, 1][Math.floor(Math.random() * 2)]

    init();

    function init() {
        x = (Math.floor(Math.random() * size)) * w
        y = (Math.floor(Math.random() * size)) * h;
        snake = [
            [x, y],
            [x, y],
        ]
        score = 0
        timeoutMs = TIMEOUT_INIT_VALUE

        randomFood();
        verifyRecord();

        clearInterval(timeinterval)
        timeinterval = setInterval(move, timeoutMs);
    }

    function randomFood() {
        let conflitSnake = false
        do {
            positionFood = [(Math.floor(Math.random() * size)) * w, (Math.floor(Math.random() * size)) * h]
            conflitSnake = snake.filter(cube => cube[0] == positionFood[0] && cube[1] == positionFood[1]).length > 0
        } while (conflitSnake)
    }

    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction[1] == 1)
                    snake = snake.reverse()
                direction = [0, -1]
                break;
            case 'ArrowRight':
                if (direction[0] == -1)
                    snake = snake.reverse()
                direction = [1, 0]
                break;
            case 'ArrowDown':
                if (direction[1] == -1)
                    snake = snake.reverse()
                direction = [0, 1]
                break;
            case 'ArrowLeft':
                if (direction[0] == 1)
                    snake = snake.reverse()
                direction = [-1, 0]
                break;
        }
    })

    function move() {
        const newCube = [snake[0][0] + w * direction[0], snake[0][1] + h * direction[1]]
        snake = [newCube, ...snake.slice(0, snake.length - 1)]

        if (snake[0][0] > ((size * w) - w))
            snake[0][0] = 0
        if (snake[0][1] > ((size * h) - h))
            snake[0][1] = 0;
        if (snake[0][0] < 0)
            snake[0][0] = ((size * w) - w)
        if (snake[0][1] < 0)
            snake[0][1] = ((size * h) - h)

        verifyEat();
        verifyGameover()
        draw()
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color
        snake.map(cube => {
            ctx.fillRect(cube[0], cube[1], w, h)
        })
        ctx.fillText(`Score: ${score}`, 10, 10, 100)
        ctx.fillText(`Record: ${record}`, 10, 20, 100)
        ctx.fillStyle = 'yellow'
        ctx.fillRect(positionFood[0], positionFood[1], w, h)
    }

    function verifyEat() {
        for (let i = 0; i < snake.length; i++) {
            const cube = snake[i]
            if (cube[0] === positionFood[0] && cube[1] === positionFood[1]) {
                randomFood();
                score += 1
                timeoutMs *= 0.99;
                clearInterval(timeinterval)
                timeinterval = setInterval(move, timeoutMs);
                let newCube = [snake[0][0] + w * direction[0], snake[0][1] + h * direction[1]]
                snake = [...snake, newCube]
                break;
            }
        }
    }

    function verifyGameover() {
        for (let i = 0; i < snake.length; i++) {
            const cube = snake[i];
            const cubeEqualLength = snake.filter(c => {
                return c[0] == cube[0] && c[1] == cube[1]
            }).length
            if (cubeEqualLength >= 2) {
                gameover()
                break;
            }
        }
    }

    function verifyRecord(score = 0) {
        record = window.localStorage.getItem('@snake_record')
        if (!record)
            record = 0;
        const isNewRecord = score > record;
        if (isNewRecord)
            window.localStorage.setItem('@snake_record', score)
        return isNewRecord
    }

    function gameover() {
        const isNewRecord = verifyRecord(score);
        alert(`Gameover!!!\nScore: ${score}!\n${isNewRecord ? 'New Record!!!' : ''}`)
        init()
    }

}
