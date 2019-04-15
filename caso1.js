const fs = require('fs')

const readFile = async (file) => {
  let lines = []
  const readFile = await fs.readFileSync(file, 'utf8')
  lines = readFile.split('\n')
  return lines
}

const caso1 = async () => {
  const lines = await readFile('input.txt')
  const array = lines.slice(1)
  const medianArray = createMedianArray(array)
  console.log('finish', medianArray)
  writeFile('output.txt', medianArray)
}

const writeFile = async (file, data) => {
  fs.writeFile(file, data, (err) => {
    if (err) console.log(err)
    console.log('Successfully Written to File.')
  })
}

const createMedianArray = (array) => {
  const numberArray = []
  const outputArray = []
  for (let command of array) {
    let splitCommand = command.split(' ')
    if (splitCommand[0] === 'a') {
      addNumber(numberArray, outputArray, parseInt(splitCommand[1]))
    } else if (splitCommand[0] === 'r') {
      removeNumber(numberArray, outputArray, parseInt(splitCommand[1]))
    }
  }
  return outputArray
}

const addNumber = (array, outputArray, newNumber) => {
  if (array.length === 0) {
    array.push(newNumber)
    return outputArray.push(getMedian(array))
  }
  for (let i = 0; i < array.length; i++) {
    let number = array[i]
    if (i === array.length - 1 && newNumber > number) {
      array.push(newNumber)
      return outputArray.push(getMedian(array))
    } else if (newNumber <= number) {
      array.splice(i, 0, newNumber)
      return outputArray.push(getMedian(array))
    }
  }
}

const removeNumber = (array, outputArray, deleteNumber) => {
  if (array.length === 0) {
    return outputArray.push('Wrong!')
  }
  for (let i = 0; i < array.length; i++) {
    let number = array[i]
    if (i === array.length - 1 && deleteNumber !== number) {
      return outputArray.push('Wrong!')
    } else if (array.length === 1 && array[0] === number) {
      array.splice(0, 1)
      return outputArray.push('Wrong!')
    } else if (number === deleteNumber) {
      array.splice(i, 1)
      return outputArray.push(getMedian(array))
    }
  }
}

const getMedian = (array) => {
  return array.length % 2 === 1 ? array[parseInt(array.length / 2)]
    : (array[array.length / 2] + array[(array.length / 2) - 1]) / 2
}

caso1()
