import { useEffect, useRef, useMemo } from "react";
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from "d3-sankey";

interface SankeyData {
  nodes: { name: string; color?: string }[];
  links: { source: number; target: number; value: number }[];
}

interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

export const SankeyChart = ({ data, width = 350, height = 400 }: SankeyChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const sankeyGenerator = sankey<{ name: string; color?: string }, { source: number; target: number; value: number }>()
      .nodeWidth(15)
      .nodePadding(20)
      .extent([[20, 20], [width - 20, height - 20]]);

    return sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    });
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const linkPath = sankeyLinkHorizontal();
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Create links group
    const linksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linksGroup.setAttribute("class", "links");
    
    // Draw links
    links.forEach((link) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const d = linkPath(link as any);
      if (d) {
        path.setAttribute("d", d);
        path.setAttribute("stroke", (link.target as any).color || "#94a3b8");
        path.setAttribute("stroke-width", String(Math.max(1, (link as any).width || 0)));
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.4");
      }
      linksGroup.appendChild(path);
    });
    
    svg.appendChild(linksGroup);
    
    // Create nodes group
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodesGroup.setAttribute("class", "nodes");
    
    // Draw nodes
    nodes.forEach((node) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String((node as any).x0 || 0));
      rect.setAttribute("y", String((node as any).y0 || 0));
      rect.setAttribute("width", String(((node as any).x1 || 0) - ((node as any).x0 || 0)));
      rect.setAttribute("height", String(((node as any).y1 || 0) - ((node as any).y0 || 0)));
      rect.setAttribute("fill", node.color || "#3b82f6");
      rect.setAttribute("rx", "2");
      nodesGroup.appendChild(rect);
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const x = ((node as any).x0 || 0) < width / 2 ? ((node as any).x1 || 0) + 6 : ((node as any).x0 || 0) - 6;
      const y = (((node as any).y0 || 0) + ((node as any).y1 || 0)) / 2;
      text.setAttribute("x", String(x));
      text.setAttribute("y", String(y));
      text.setAttribute("dy", "0.35em");
      text.setAttribute("text-anchor", ((node as any).x0 || 0) < width / 2 ? "start" : "end");
      text.setAttribute("font-size", "12");
      text.setAttribute("fill", "currentColor");
      text.textContent = node.name;
      nodesGroup.appendChild(text);
    });
    
    svg.appendChild(nodesGroup);
  }, [nodes, links, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible"
    />
  );
};
