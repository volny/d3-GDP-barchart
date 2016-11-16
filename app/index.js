import './style.scss'
import { scaleLinear, scaleTime, timeParse, line, select, json, extent, max, axisBottom, axisLeft, timeYear, timeFormat } from 'd3'

const FCC_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const
  margin = {top: 20, right: 20, bottom: 50, left: 90},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

const svg = select('#app')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

json(FCC_URL, (error, response) => {
  const data = response.data
  const parseTime = timeParse("%Y-%m-%d")
  const
    x = scaleTime().range([0, width]),
    y = scaleLinear().range([height, 0])
  const valueline = line()
   .x((row) => x(row[0]))
   .y((row) => y(row[1]))

  if (error) throw error

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
    .style('font', '15px Helvetica')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(x)
      .ticks(timeYear.every(5))
      .tickFormat(timeFormat("%Y"))
      )

  svg.append('text')
    .attr('x', width / 2)
    .attr('transform', `translate(0, ${height + margin.bottom})`)
    .style("text-anchor", "middle")
    .text('Date');

  svg.append('g')
    .style('font', '15px Helvetica')
    .call(axisLeft(y))

  svg.append('text')
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text('Gross Domestic Product')

  svg.append('text')
    .style('font-size', '20px')
    .attr('transform', `translate(${width / 2}, ${margin.top / 2})`)
    .attr('text-anchor', 'middle')
    .text('US Gross Domestic Product by Quarter')
})

