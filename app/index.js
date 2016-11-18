import './style.scss'
import { scaleLinear, scaleTime, timeParse, line, select, json, extent, max, axisBottom, axisLeft, timeYear, timeFormat, event } from 'd3'

const FCC_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const
  margin = {top: 40, right: 20, bottom: 50, left: 90},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

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
    row[0] = timeParse('%Y-%m-%d')(row[0])
    row[1] = +row[1]
  })

  // TOOLTIP
  const tooltip = select('#app').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  // SCALES
  const
    x = scaleTime().range([0, width]),
    y = scaleLinear().range([height, 0])
  // d3.extent returns the min and max val in arr
  x.domain(extent(data, (row) => row[0]))
  y.domain([0, max(data, (row) => row[1])])

// LINEGRAPH
//   const valueline = line()
//    .x((row) => x(row[0]))
//    .y((row) => y(row[1]))
//  svg.append('path')
//    .data([data])
//    .attr('class', 'line')
//    .attr('d', valueline)


//  SCATTERPLOT
//  svg.selectAll("dot")
//    .data(data)
//    .enter().append("circle")
//    .attr('r', 1)
//    .attr('cx', (row) => x(row[0]))
//    .attr('cy', (row) => y(row[1]))

//  BARCHART
  svg.selectAll(".bar")
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (row) => x(row[0]))
    .attr('width', (row) => width - x(row[0]))
    .attr('y', (row) => y(row[1]))
    .attr('height', (row) => height - y(row[1]))
    .on('mouseover', (row) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9)
      tooltip.html(`<strong>Quarter:</strong>
          <span> ${timeFormat('%B %Y')(row[0])}</span>
          </br>
          <strong>GDP:</strong>
          <span> ${row[1]}</span>`)
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY - 28}px`)
    })
    .on('mouseout', (row) => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

  // AXIS AND ANNOTATION
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
    .text('GDP (Billions of Dollars)')

  svg.append('text')
    .style('font-size', '20px')
    .attr('transform', `translate(${width / 2}, ${margin.top / 2})`)
    .attr('text-anchor', 'middle')
    .text('US Gross Domestic Product by Quarter')
})

