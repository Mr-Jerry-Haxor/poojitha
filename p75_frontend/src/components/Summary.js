import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function Summary() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChartData(response.data);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching summary data', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (chartData && chartRef.current) {
      const svg = d3.select(chartRef.current)
        .attr('width', 500)
        .attr('height', 300);

      const x = d3.scaleBand()
        .domain(chartData.labels)
        .range([0, 500])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(chartData.datasets[0].data)])
        .nice()
        .range([300, 0]);

      svg.append('g')
        .attr('transform', 'translate(0,300)')
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(chartData.datasets[0].data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(chartData.labels[i]))
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => 300 - y(d))
        .attr('fill', 'steelblue');
    }
  }, [chartData]);

  return (
    <div>
      <h2>Summary</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <svg ref={chartRef}></svg>
      <p>Explanation of the chart and its source.</p>
    </div>
  );
}

export default Summary;