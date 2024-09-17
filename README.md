# Cosmic Commotion

This visualization provides an interactive and engaging experience exploring the orbits of near-Earth comets. All the objects in the visualization are to-scale.

### Marks

1. **Lines**: Representing the orbits of comets around the sun.

2. **Points**: Depicting the comets themselves as they move along their orbits.

3. **Images**: Displaying the sun's position and adding a visual anchor for the orbits.

### Channels

1. **Position**: Used to illustrate the comets' movement along their orbits relative to the sun and other comets. This follows Kepler's 2nd Law and plots a combination of eccentricity (e), time period (TP), distance at perihelion (q) distance at aphelion (Q), and orbital period (P) all normalized and scaled down.

2. **Size**: Depending on the Minimum Orbit Intersection Distance (MOID).

### Interactions

1. **Mouseover**: Revealing detailed information about the comets in a tooltip.

2. **Click**: Dismissing the tooltip and reducing the opacity of comet paths when clicked.

### Category: Combinatorial Visualization

The "Cosmic Commotion: Charting Celestial Trajectories" visualization is combinatorial, integrating lines for comet orbits, circles for comets, and an image of the sun. Interactive tooltips display comet details when hovering, and real-time animation shows comets in motion for a dynamic experience.

### Instructions for Execution

1. On VSCode, install the Live Server extension [here](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

2. Clone and open the repository on VSCode on your local machine.

3. Click on Go Live at the bottom right to run the live server.
