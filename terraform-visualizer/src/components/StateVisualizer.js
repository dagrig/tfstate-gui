import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as d3 from 'd3';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const socket = io('http://localhost:5000');

const StateVisualizer = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    socket.on('stateUpdate', (newState) => {
      setState(newState);
    });

    return () => {
      socket.off('stateUpdate');
    };
  }, []);

  useEffect(() => {
    if (state) {
      renderGraph(state);
    }
  }, [state]);

  const renderGraph = (graph) => {
    const nodes = graph.resources.map(resource => ({
      id: resource.name,
      type: resource.type,
      details: resource
    }));

    const links = []; // Add logic here if you have relationships

    const svg = d3.select('svg');
    svg.selectAll('*').remove(); // Clear existing content

    const width = window.innerWidth;
    const height = window.innerHeight;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'link');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    node.append('circle')
      .attr('r', 10)
      .on('click', displayInfo);

    node.append('text')
      .attr('x', 15)
      .attr('y', 3)
      .text(d => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function displayInfo(event, d) {
      const nodeInfoDiv = document.getElementById('node-info');
      nodeInfoDiv.innerHTML = `
        <h3>${d.id}</h3>
        <p>Type: ${d.type}</p>
        <pre>${JSON.stringify(d.details, null, 2)}</pre>
      `;
      nodeInfoDiv.style.display = 'block';
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ position: 'absolute', top: 10, left: 10 }}>Logout</button>
      <svg width="100%" height="100vh"></svg>
      <div id="node-info"></div>
    </div>
  );
};

export default StateVisualizer;