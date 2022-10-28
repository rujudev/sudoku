const BOARD_LENGTH = 9 // 3x3 region
const TOTAL_BOARD_NUMBERS = BOARD_LENGTH * 9
const board = []
const container = document.getElementById('container')
const selectDifficult = document.getElementById('difficult-select')
let MAX_INITIAL_NUMBERS
let remainingAttemps = TOTAL_BOARD_NUMBERS - MAX_INITIAL_NUMBERS

const printBoard = () => {
    for (let x = 1; x <= BOARD_LENGTH; x++) {
        const childContainer = document.createElement('div')
        childContainer.classList.add('child-container')

        board[x - 1] = []

        for (let y = 1; y <= BOARD_LENGTH; y++) {
            const childItemContainer = document.createElement('div')
            childItemContainer.classList.add('child-item-container')
            childItemContainer.style = "display: flex; justify-content: center;"
            childItemContainer.id = `container_${x - 1}${y - 1}`

            const childItem = document.createElement('input')
            childItem.className = 'child-item'
            childItem.maxLength = 1
            childItem.onkeyup = (input) => checkInputValue(input, x - 1, y - 1)
            childItem.onkeydown = (input) => { if (input.code === 'Tab') input.preventDefault() }

            let style = ''
            if (y < BOARD_LENGTH) {
                if (y === 1) { // primera celda
                    style = 'border-right: 1.5px solid #8DB1AB;'
                } else if (y % 3 === 0) { // 3 casilla, mitad del borde derecho
                    style = 'border-right: 2px solid #264653; border-left: 1.5px solid #8DB1AB;'
                } else if ((y - 1) % 3 === 0) { // 4 casilla, mitad del borde izquierdo
                    style = 'border-right: 1.5px solid #8DB1AB; border-left: 2px solid #264653;'
                } else { // celda dentral de cada sección
                    style = 'border-right: 1.5px solid #8DB1AB; border-left: 1.5px solid #8DB1AB;'
                }
            } else {
                style = 'border-left: 1.5px solid #8DB1AB;'
            }

            if (x === BOARD_LENGTH) {
                style += ' border-bottom: none;'
            } else {
                if (x > 0 && x % 3 === 0) {
                    style += 'border-bottom: 4px solid #264653;'
                } else {
                    style += 'border-bottom: 1.5px solid #8DB1AB;'
                }
            }

            board[x - 1][y - 1] = childItem
            childItemContainer.style = style
            childItemContainer.append(childItem)
            childContainer.append(childItemContainer)
        }

        container.append(childContainer)
    }
}

const valueExistsInXAxis = (value, posY, posX = null) => {
    for (let x = 0; x < BOARD_LENGTH; x++) {
        const input = board[x][posY]
        
        if (posX === x) continue
        else if (Number(input.value) === Number(value)) return true
    }

    return false
}

const valueExistsInYAxis = (value, posX, posY = null) => {
    for (let y = 0; y < BOARD_LENGTH; y++) {
        const input = board[posX][y]
        
        if (posY === y) continue
        else if (Number(input.value) === Number(value)) return true
    }

    return false
}

const valueExistsInRegion = (value, posX, posY) => {
    const { initialX, initialY } = getFirstRegionCellPosition(posX, posY)

    for (let x = initialX; x < initialX + 3; x++) {
        for (let y = initialY; y < initialY + 3; y++) {
            const input = board[x][y]

            if (posX === x || posY === y) continue
            if (Number(input.value) === Number(value)) return true
        }
    }

    return false
}

const getFirstRegionCellPosition = (posX, posY) => {
    let initialX = 0;
    let initialY = 0;

    if (posX % 3 === 0 && posY % 3 === 0) { // primera fila, primera columna
        // console.log("primera fila, primera columna")
        initialX = posX; 
        initialY = posY;
    } else if (posX % 3 === 0 && (posY - 1) % 3 === 0) { // primera fila, columna central
        // console.log("primera fila, columna central")
        initialX = posX; 
        initialY = posY - 1;
    } else if (posX % 3 == 0 && (posY - 2) % 3 === 0) { // primera fila, ultima columna
        // console.log("primera fila, ultima columna")
        initialX = posX; 
        initialY = posY - 2;
    } else if ((posX - 1) % 3 === 0 && posY % 3 === 0) { // fila central, primera columna
        // console.log("fila central, primera columna")
        initialX = posX - 1; 
        initialY = posY;
    } else if ((posX - 1) % 3 === 0 && (posY - 1) % 3 === 0) { // fila central, columna central
        // console.log("fila central, columna central")
        initialX = posX - 1; 
        initialY = posY - 1;
    } else if ((posX - 1) % 3 == 0 && (posY - 2) % 3 === 0) { // fila central, ultima columna
        // console.log("fila central, ultima columna")
        initialX = posX - 1; 
        initialY = posY - 2;
    } else if ((posX - 2) % 3 === 0 && posY % 3 === 0) { // ultima fila, primera columna
        // console.log("ultima fila, primera columna")
        initialX = posX - 2; 
        initialY = posY;
    } else if ((posX - 2) % 3 === 0 && (posY - 1) % 3 === 0) { // ultima fila, columna central
        // console.log("ultima fila, columna central")
        initialX = posX - 2; 
        initialY = posY - 1;
    } else if ((posX - 2) % 3 == 0 && (posY - 2) % 3 === 0) { // ultima fila, ultima columna
        // console.log("ultima fila, ultima columna")
        initialX = posX - 2; 
        initialY = posY - 2;
    }

    initialX = initialX - 1 >= 0 || initialX - 2 >= 0 ? initialX : 0;
    initialY = initialY - 1 >= 0 || initialY - 2 >= 0 ? initialY : 0;

    return { initialX, initialY }
}

const generateRandomValues = () => {
    let childItemContainer = null
    let count = 0

    while (count < MAX_INITIAL_NUMBERS) {
        let posX = randomValue(0, 9)
        let posY = randomValue(0, 9)
        let value = randomValue(1, 9)
        
        if (!valueExistsInRegion(value, posX, posY) && !valueExistsInXAxis(value, posY) && !valueExistsInYAxis(value, posX)) {
            if (board[posX][posY].value === "") {
                board[posX][posY].value = value
                board[posX][posY].setAttribute('disabled', true)
                childItemContainer = document.getElementById(`container_${posX}${posY}`)
                childItemContainer.classList.add('disable-cell')
                
                count++
            }
        }
    }
}

const randomValue = (min, max) => {
    const minValue = Math.ceil(min)
    const maxValue = Math.floor(max)
    return Math.floor(Math.random() * (maxValue - minValue) + minValue)
}

const checkInputValue = (element, x, y) => {
    const code = element.code
    if (code === 'arrowLeft' || code === 'arrowUp' || code === 'arrowRight' || code === 'arrowDown') return
    
    const input = element.target
    const inputValue = input.value
    const childItemContainer = document.getElementById(`container_${x}${y}`)

    if (inputValue === "" || isNaN(Number(inputValue))) {
        childItemContainer.classList.remove('refuse-cell', 'accept-cell')
        return
    }

    if (valueExistsInRegion(inputValue, x, y) || valueExistsInXAxis(inputValue, y, x) || valueExistsInYAxis(inputValue, x, y)) {
        childItemContainer.classList.add('refuse-cell')
        return
    }

    childItemContainer.classList.add('accept-cell')
    remainingAttemps--

    remainingAttemps === 0 && finishGame()
}

const finishGame = () => {
    const childItemContainer = document.getElementsByClassName('child-item-container')

    for (let item of childItemContainer) item.children[0].setAttribute('disabled', true)
}

const initGame = () => {}

initGame()

document.addEventListener('DOMContentLoaded', function(e) {
    selectDifficult.value = "easy"
    MAX_INITIAL_NUMBERS = 38

    printBoard()
    generateRandomValues()
})

selectDifficult.addEventListener('change', function(e) {
    const container = document.getElementById('container')
    
    switch (e.target.value) {
        case "easy": MAX_INITIAL_NUMBERS = 38; break;
        case "medium": MAX_INITIAL_NUMBERS = 29; break;
        case "hard": MAX_INITIAL_NUMBERS =  25; break;
        case "expert": MAX_INITIAL_NUMBERS = 23; break;
    }

    container.innerHTML = ''
    printBoard()
    generateRandomValues()
})