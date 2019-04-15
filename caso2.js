const fs = require('fs')

class Graph {
  constructor (verticesNumber) {
    this.verticesNumber = verticesNumber
    this.vertices = []
    this.adjacentList = new Map()
    this.colorDifference = 1
    this.finishCount = false
    this.sumiArray = []
    this.colorArray = []
  }

  addVertex (vertex) {
    this.vertices.push(vertex)
    this.adjacentList.set(vertex, [])
  }

  getVertex (vertexName) {
    for (let vertex of this.vertices) {
      if (vertex.name === vertexName) {
        return vertex
      }
    }
  }

  isInColorArray (color) {
    let colorFound = this.colorArray.find(function (element) {
      return element === color
    })
    return colorFound !== undefined
  }

  addEdge (vertex1, vertex2) {
    this.adjacentList.get(vertex1).push(vertex2)
    this.adjacentList.get(vertex2).push(vertex1)
  }

  printGraph () {
    let getKeys = this.adjacentList.keys()
    for (let i of getKeys) {
      let getValues = this.adjacentList.get(i)
      let conc = ''

      for (let j of getValues) {
        conc += j.name + ' '
      }
      console.log(i.name + ' -> ' + conc)
    }
  }

  sumi () {
    const outputArray = []
    for (let i in this.vertices) {
      let sumij
      let sumi = 0
      const node1 = this.vertices[i]
      for (let j in this.vertices) {
        const node2 = this.vertices[j]
        if (node1 === node2) {
          this.colorDifference = 1
          this.colorArray = []
        } else {
          this.colors(node1, node2)
        }
        sumij = this.colorDifference
        sumi += sumij
      }
      outputArray.push(sumi)
      console.log(`sumi {${node1.name}} = `, sumi)
    }
    return outputArray
  }

  colors (startingNode, finishingNode) {
    let visited = []
    for (let i = 0; i < this.verticesNumber; i++) {
      visited[this.vertices[i].name] = false
    }
    this.colorArray = []
    this.colorDifference = 1
    this.finishCount = false
    const startingColor = startingNode.color
    this.colorsUtil(startingNode, visited, startingColor, finishingNode)
  }

  colorsUtil (vert, visited, startingColor, finishingNode) {
    visited[vert.name] = true
    if (vert === finishingNode) {
      this.finishCount = true
      if (vert.color !== startingColor && !this.isInColorArray(vert.color)) {
        this.colorDifference++
        this.colorArray.push(vert.color)
      }
      return true
    }

    let getNeighbours = this.adjacentList.get(vert)

    for (let i = 0; i < getNeighbours.length && !this.finishCount; i++) {
      let getElem = getNeighbours[i]

      if (!visited[getElem.name]) {
        const esRama = this.colorsUtil(getElem, visited, startingColor, finishingNode)
        if (vert.color !== startingColor && !this.isInColorArray(vert.color) && esRama) {
          this.colorArray.push(vert.color)
          this.colorDifference++
        }
        if (esRama) return true
      }
    }
    return false
  }
}

const readFile = async (file) => {
  let lines = []
  const readFile = await fs.readFileSync(file, 'utf8')
  lines = readFile.split('\n')
  return lines
}

const caso2 = async () => {
  const lines = await readFile('input2.txt')
  const verticesNumber = parseInt(lines[0])
  let g = new Graph(verticesNumber)
  const colors = lines[1].split(' ')
  colors.forEach((color, index) => {
    const node = {
      name: `Node ${index + 1}`,
      color
    }
    g.addVertex(node)
  })
  const adjacentList = lines.slice(2)
  adjacentList.forEach(edge => {
    const edges = edge.split(' ')
    const node1 = g.getVertex(`Node ${edges[0]}`)
    const node2 = g.getVertex(`Node ${edges[1]}`)
    g.addEdge(node1, node2)
  })
  g.printGraph()
  const outputArray = g.sumi()
  writeFile('output2.txt', outputArray)
}

const writeFile = async (file, data) => {
  fs.writeFile(file, data, (err) => {
    if (err) console.log(err)
    console.log('Successfully Written to File.')
  })
}

caso2()
