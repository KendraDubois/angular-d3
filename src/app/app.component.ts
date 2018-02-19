import {Component, NgModule, OnInit, AfterViewInit, OnDestroy} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {miserables} from './miserables'

import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{
  //Name of app/title
  name:string;
  svg;
  color;
  simulation;
  link;
  node;
  //Label beside circle node
  label;
  constructor() {
    this.name = 'Angular2'
  }
  
  ngOnInit(){
    
  }
  
  ngAfterViewInit(){
    this.svg = d3.select("svg");
    
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");

    //Grab random colours for circles
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    
    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d: any) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
    
    this.render(miserables);
  }
  
  ticked() {
    this.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

        this.label
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        }); 
  }

  
  //Render the graph
  render(graph){
    this.link = this.svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    //Colour of links
    .attr('stroke','grey')
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    this.node = this.svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    //Add circle to graph
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", (d)=> { return this.color(d.group); })
      //On mouseover do these things
    .on("mouseover", (d)=>{
      // alert(this.node)
      console.log(this.node);
      //id!!
      console.log(d.id);
      
    })
    .on("click", (d)=> {
        //alert("You clicked: " + d.id);
        showDetails(d.id);
    })
      .call(d3.drag()
          .on("start", (d)=>{return this.dragstarted(d)})
          .on("drag", (d)=>{return this.dragged(d)})
          .on("end", (d)=>{return this.dragended(d)}));

    //Show node title on hover
    this.node.append("title")
      .text(function(d) { console.log(d.id); return d.id; });

      //Adding labels to nodes
      this.label = this.svg.append("g")
        .attr("class", "label")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("dx", 6)
        .attr("dy", ".35em")
        .style("font-size", 10)
        .on("click", (d)=> {
          //Add switch cursor functionality here
         // alert("You clicked: " + d.id);
          let number = 0;
          console.log(number);
          number = add(3,4); 
          console.log(number);
          showDetails(d.id);
      })
        .text(function(d) {
            return d.id
        });

    this.simulation
      .nodes(graph.nodes)
      .on("tick", ()=>{return this.ticked()});

    this.simulation.force("link")
      .links(graph.links);  
  }
  
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  ngOnDestroy(){
    
  }
}

function add(x, y) {
  return x + y;
}

function showDetails(nodeId: any){
  alert("Inside showDetails...You clicked: " + nodeId);
}