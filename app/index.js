import './style.scss'
import { scaleLinear, scaleTime, timeParse, line, select, csv, extent, max, axisBottom, axisLeft } from 'd3'

const API_URL = 'https://gist.githubusercontent.com/d3noob/402dd382a51a4f6eea487f9a35566de0/raw/6369502941b44261f381399a24fb455cb4290be8/data.csv'

const
  margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

const parseTime = timeParse("%d-%b-%y")

const
  x = scaleTime().range([0, width]),
  y = scaleLinear().range([height, 0])

const valueline = line()
  .x((d) => x(d.date))
  .y((d) => y(d.close))

const svg = select('#app')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// GET DATA
csv(API_URL, (error, data) => {
  if (error) throw error

  data.forEach((row) => {
    row.date = parseTime(row.date)
    row.close = +row.close
  })

  // scale the range of the data ???
  x.domain(extent(data, (row) => row.date))
  y.domain([0, max(data, (row) => row.close)])

  // draw the path
  svg.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', valueline)

  // Add the Axes
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(x));
  svg.append('g')
    .call(axisLeft(y));
})


//function useData(text) {
//  const data = csvParse(text)
//  data.date = parseTime(data.date)
//  data.close = +data.close
//
//  // scale the range of the data ???
//  x.domain(extent(text, (d) => d.date))
//  y.domain([0, max(text, (d) => d.close)])
//
//  // draw the path
//  svg.append('path')
//    .data([text])
//    .attr('class', 'line')
//    .attr('d', valueline)
//
//  // Add the Axes
//  svg.append('g')
//    .attr('transform', `translate(0, ${height})`)
//    .call(axisBottom(x));
//  svg.append('g')
//    .call(axisLeft(y));
//
//}

//fetch( 'https://gist.githubusercontent.com/d3noob/402dd382a51a4f6eea487f9a35566de0/raw/6369502941b44261f381399a24fb455cb4290be8/data.csv')
//  .then((response) => response.text())
//  .then((text) => useData(text))
