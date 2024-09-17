var x = (window.innerWidth || document.documentElement.clientWidth) - 50;
var y = (window.innerHeight || document.documentElement.clientHeight) - 50;
var svg;
var comets = [];
var currentTime = 0; 
let currentComet = null;

document.addEventListener('DOMContentLoaded', function () {
    loadData();
    addSun();
    startAnimation();
});

function loadData() {
    return d3.csv("data/near-earth-comets.csv")
        .then(function (data) {
            processDataset(data);
        })
        .catch(function (error) {
            console.error('Failed to load data:', error);
        });
}

function processDataset(dataset) {
    dataset.forEach((row) => {
        drawOrbit(row);
    });
}

function addSun() {
  const container = document.getElementById('svg-container');
  svg = d3.select(container)
      .append('svg')
      .attr('width', x)
      .attr('height', y);

  if (comets.length > 0) {
      const { semiMajorAxis, semiMinorAxis, centerX, centerY, comet } = comets[0];
      const e = parseFloat(comet.e);

      const focus_distance = e * semiMajorAxis;
      const sun_x = centerX + focus_distance;
      const sun_y = centerY;
      svg.append('image')
        .attr('href', 'images/sun.png')
        .attr('x', sun_x - sunRadius / 2)
        .attr('y', sun_y - sunRadius / 2)
        .attr('width', sunRadius)
        .attr('height', sunRadius);
  } 
}

function drawOrbit(comet) {
  const q = parseFloat(comet.q);
  const Q = parseFloat(comet.Q);
  const e = parseFloat(comet.e);
  const moid = parseFloat(comet.MOID);
  const scalingFactor = 20;

  if (isNaN(q) || isNaN(Q) || isNaN(e) || isNaN(moid)) {
      console.error('Invalid data in comet parameters:', comet);
      return;
  }

  const semiMajorAxis = scalingFactor * (q + Q) / 2;
  const semiMinorAxis = scalingFactor * Math.sqrt(semiMajorAxis * q * Q * (1 - e ** 2));

  const centerX = x / 2;
  const centerY = y / 2;

  const angles = d3.range(0, 2 * Math.PI, 0.01);
  const orbitPath = d3.line()
      .x((angle) => centerX + semiMajorAxis * Math.cos(angle))
      .y((angle) => centerY + semiMinorAxis * Math.sin(angle));

  const pathElement = svg.append('path')
      .attr('d', orbitPath(angles))
      .style('fill', 'none')
      .style('stroke', 'grey')
      .style('stroke-width', 0.5)
      .style('opacity', 0);

  const cometElement = svg.append('circle')
      .attr('r', moid * scalingFactor)
      .attr('opacity', 0.6)
      .attr('fill', '#FDD692')
      .attr('cx', centerX + semiMajorAxis * Math.cos(0))
      .attr('cy', centerY + semiMinorAxis * Math.sin(0));

  cometElement.on('mouseover', function(event) {

      pathElement.style('opacity', 1);

      const tooltip = document.getElementById('tooltip');
      tooltip.innerHTML = `
          <strong>Name:</strong> ${comet.Object_name}<br>
          <strong>Orbital Period:</strong> ${comet.P} years<br>
          <strong>Eccentricity:</strong> ${comet.e}
      `;

      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;

      tooltip.style.display = 'block';

      currentComet = { comet, element: cometElement, path: pathElement, tooltip: tooltip };
  });

  cometElement.on('mouseleave', function(event) {
      pathElement
        .transition().duration(2000)
        .style('opacity', 0);
      if (currentComet && currentComet.comet === comet) {
          const tooltip = currentComet.tooltip;
          document.addEventListener('mousemove', moveTooltip);
      }
  });

  comets.push({
      comet: comet,
      element: cometElement,
      pathElement: pathElement,
      semiMajorAxis: semiMajorAxis,
      semiMinorAxis: semiMinorAxis,
      centerX: centerX,
      centerY: centerY
  });
}

function moveTooltip(event) {
  if (currentComet) {
      const cometX = parseFloat(currentComet.element.attr('cx'));
      const cometY = parseFloat(currentComet.element.attr('cy'));
      
      const tooltip = currentComet.tooltip;
      
      d3.select(tooltip).transition()
          .duration(0)
          .style('left', `${cometX}px`)
          .style('top', `${cometY - 10}px`);
  }
}

document.addEventListener('click', function() {
  if (currentComet) {

      currentComet.tooltip.style.display = 'none';
      currentComet.path.style('opacity', 0);
      document.removeEventListener('mousemove', moveTooltip);
      currentComet = null;
  }
});


function startAnimation() {
    d3.interval(updateComets, 10);
}

function updateComets() {
    comets.forEach(({ comet, element, semiMajorAxis, semiMinorAxis, centerX, centerY }) => {
        const t = currentTime / 365.25;
        
        const meanAnomaly = (2 * Math.PI / comet.P) * t;

        let eccentricAnomaly = meanAnomaly;
        let delta = 1;
        const tolerance = 1e-6;
        const maxIterations = 1000;
        let iterations = 0;

        while (Math.abs(delta) > tolerance && iterations < maxIterations) {
            delta = eccentricAnomaly - comet.e * Math.sin(eccentricAnomaly) - meanAnomaly;
            eccentricAnomaly -= delta / (1 - comet.e * Math.cos(eccentricAnomaly));
            iterations++;
        }

        const trueAnomaly = 2 * Math.atan2(
            Math.sqrt(1 + comet.e) * Math.sin(eccentricAnomaly / 2),
            Math.sqrt(1 - comet.e) * Math.cos(eccentricAnomaly / 2)
        );

        const cometX = semiMajorAxis * Math.cos(trueAnomaly);
        const cometY = semiMinorAxis * Math.sin(trueAnomaly);

        element.attr('cx', centerX + cometX)
               .attr('cy', centerY + cometY);
    });

    currentTime += 1;
}



