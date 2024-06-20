import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/state').subscribe((data: any) => {
      const width = 960;
      const height = 600;

      const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

      const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id((d: any) => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

      const nodes = data.resources.map((resource: any) => ({
        id: resource.name,
        type: resource.type,
        details: resource.instances[0].attributes
      }));

      const links: any[] = [];

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
          .on('start', (event: any, d: any) => this.dragstarted(event, d, simulation))
          .on('drag', (event: any, d: any) => this.dragged(event, d))
          .on('end', (event: any, d: any) => this.dragended(event, d, simulation)))
        .on('click', (event: any, d: any) => this.displayInfo(d));

      node.append('circle')
        .attr('r', 10)
        .attr('fill', 'steelblue');

      node.append('text')
        .attr('x', 15)
        .attr('y', 3)
        .text((d: any) => d.id);

      simulation
        .nodes(nodes)
        .on('tick', () => this.ticked(link, node));

      simulation.force('link')
        .links(links);
    });
  }

  ticked(link: any, node: any): void {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    node
      .attr('transform', (d: any) => `translate(d.x},${d.y})`);
  }

  dragstarted(event: any, d: any, simulation: any): void {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  dragended(event: any, d: any, simulation: any): void {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  displayInfo(d: any): void {
    const info = document.getElementById('node-info');
    if (info) {
      info.textContent = JSON.stringify(d.details, null, 2);
    }
  }
}