# FlowCanvas Animation Guide

## Understanding Edge Animations

FlowCanvas provides powerful animation features that allow you to create dynamic, visually appealing automation flows. The animation system is divided into two main components:

1. **Line Animations** - Animations applied to the edge lines themselves
2. **Dot Animations** - Moving dots that travel along the edges

These animation types can be used independently or combined for maximum impact. Each offers unique visual effects that can help communicate different types of flows, priorities, or states within your diagrams.

## Line Animation Types

When you select an edge, you can enable line animations and choose from several animation types:

| Type | Description | Best Used For |
|------|-------------|---------------|
| **Flow** | Creates a flowing motion along the edge direction | Data flow, sequential processes |
| **Pulse** | Pulsates the line thickness for a subtle breathing effect | Active connections, heartbeat |
| **Dash** | Animates dashed lines moving in the direction of flow | Step-by-step processes |
| **Rainbow** | Cycles through vibrant colors for emphasis | Highlighting important paths |
| **Laser** | Creates a laser beam effect with changing opacity | High-speed data transfer |
| **Glow** | Adds a pulsing glow effect around the edge | Important connections |
| **Wave** | Varies line thickness in a wave-like pattern | Signal transmission |

### Animation Controls

- **Animation Speed**: Controls how fast the animation plays (in seconds)
- **Reverse Direction**: Changes the direction of the animation flow
- **Line Style**: Works with animations (Solid, Dashed, Dotted)
- **Thickness**: Adjusts the line thickness

## Dot Animation

Dots add another dimension to your flow visualizations by creating the appearance of particles moving along the edges. They're perfect for representing data packets, messages, or units moving through a system.

### Dot Controls

- **Number of Dots**: Add multiple dots for higher traffic visualization
- **Dot Size**: Adjust the size of the dots
- **Dot Color**: Can match the edge color or be customized
- **Animation Speed**: Controls how fast dots move along the edge

### Special Dot Modes

- **Traffic Light Mode**: When the edge animation type is set to "traffic," dots will automatically use red, yellow, and green colors in sequence

## Best Practices

1. **Use animations purposefully**: Animations should enhance understanding, not distract from it.

2. **Indicate direction**: Use animation direction to show the flow of information.

3. **Highlight importance**: Use more vibrant or faster animations for critical paths.

4. **Color consistency**: Match animation colors to your overall color scheme.

5. **Performance considerations**: For complex diagrams with many edges, limit animations to the most important connections.

## Tips for Effective Animations

- **Combine line and dot animations** for a complete visualization of flow and movement
- **Adjust animation speed** based on the actual speed or priority of the process
- **Use color strategically** - bright colors draw attention
- **Reverse direction** when flows are bidirectional or represent a return path
- **For simple diagrams**, animate all edges to create a dynamic visualization
- **For complex diagrams**, only animate the most important paths to avoid visual overload

## Troubleshooting

If animations aren't working as expected:

1. Ensure the global animation toggle is enabled
2. Check that both line animations and dot animations are enabled for the specific edge
3. Try adjusting animation speed - very slow animations might appear static
4. Make sure your browser supports CSS animations
5. If using traffic light mode, note that dots will automatically use red, yellow, and green colors

## Animation Examples

- **Data Pipeline**: Use flow animation with dots to show data moving through processing stages
- **API Connections**: Use pulse or glow animations to show active connections
- **Error Paths**: Use red-colored dash animations to highlight error or exception paths
- **Bidirectional Communication**: Use the reverse direction option to show two-way communication 