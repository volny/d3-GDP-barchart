import './style.scss'
import { scaleLinear, scaleTime, timeParse, line, select, csv, extent, max, axisBottom, axisLeft, json } from 'd3'

const API_URL = 'https://gist.githubusercontent.com/d3noob/402dd382a51a4f6eea487f9a35566de0/raw/6369502941b44261f381399a24fb455cb4290be8/data.csv'

const FCC_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const
  margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

//const parseTime = timeParse("%d-%b-%y")
const parseTime = timeParse("%Y-%m-%d")

const
  x = scaleTime().range([0, width]),
  y = scaleLinear().range([height, 0])

//const valueline = line()
//  .x((row) => x(row.date))
//  .y((row) => y(row.close))

const valueline = line()
  .x((row) => x(row[0]))
  .y((row) => y(row[1]))

const svg = select('#app')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

json(FCC_URL, (error, response) => {
  if (error) throw error
  const data = response.data

  data.forEach((row) => {
    row[0] = parseTime(row[0])
    row[1] = +row[1]
  })

  x.domain(extent(data, (row) => row[0]))
  y.domain([0, max(data, (row) => row[1])])

  svg.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', valueline)

  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(x))

  svg.append('g')
    .call(axisLeft(y))

})

