# FlowCanvas Edge Animation Guide

## Overview

FlowCanvas offers powerful edge animation features to help you create engaging and informative automation flow diagrams. This guide explains how to use both line animations and dot animations to enhance your visualizations.

## Animation Controls

Edge animations in FlowCanvas are divided into two main categories:

1. **Line Animations** - Animate the edge line itself with effects like flow, pulse, and glow
2. **Dot Animations** - Add animated dots that travel along the edge path

Each animation type can be enabled independently, giving you complete control over your edge visualization.

## Line Animation

Line animations apply visual effects to the edge path itself.

### Available Line Animation Types

| Type | Description |
|------|-------------|
| Flow | A subtle animation that flows along the path direction |
| Pulse | The line thickness pulsates for a breathing effect |
| Dash | Animated dashed lines moving in the specified direction |
| Rainbow | The line color cycles through a rainbow spectrum |
| Laser | Creates a laser beam effect with opacity and glow variations |
| Glow | The line emits a pulsing glow effect |
| Wave | The line thickness varies in a wave-like pattern |

### Line Animation Settings

- **Animation Type** - Choose from the available animation types
- **Animation Speed** - Control how fast the animation plays (in seconds)
- **Reverse Direction** - Reverse the flow direction of the animation

## Dot Animation

Dot animations add small circles that move along or remain stationary on the edge path.

### Dot Animation Settings

- **Dot Size** - Control the size of the dots (in pixels)
- **Number of Dots** - Specify how many dots appear on the edge
- **Dot Color** - Customize the color of the dots (can differ from the edge color)
- **Animation Speed** - Control how fast the dots animate (in seconds)

### Special Dot Effects

- **Traffic Light Dots** - Dots cycle through red, yellow, and green colors
- When using the "dots" animation type, dots remain fixed in position but pulse

## Tips for Creating Effective Animations

1. **Keep it subtle** - Use animations to enhance understanding, not distract from it
2. **Match the animation to the data flow** - Use directional animations to show the direction of data or process flow
3. **Use color effectively** - Choose colors that stand out against your background but match your overall design
4. **Vary animation speeds** - Faster animations can indicate higher priority or faster processes
5. **Combine dot and line animations** - For critical paths, combine both animation types to draw attention

## Animation Performance

Animation performance depends on the complexity of your diagram:

- **Browser Support** - All animations use standard CSS animations supported by modern browsers
- **Number of Animated Edges** - More animated edges require more processing power
- **Animation Types** - Simpler animations (like Flow) perform better than complex ones (like Rainbow)
- **Dot Count** - Having many dots can impact performance on complex diagrams

For optimal performance in large diagrams, consider:
- Animating only the most important edges
- Using simpler animation types
- Reducing the number of dots on edges

## Creating Custom Animation Presets

If you frequently use specific animation settings, consider saving them as presets. You can:

1. Configure an edge with your desired animation settings
2. Duplicate that edge when creating new connections
3. Create a "template" diagram with your preferred animation styles

## Troubleshooting

If animations aren't working as expected:

1. **Check browser compatibility** - Ensure you're using a modern browser with CSS animation support
2. **Verify animation toggles** - Make sure both global animations and edge-specific animations are enabled
3. **Check for conflicts** - Some animation types may conflict with certain edge styles
4. **Performance issues** - If animations are slow, try reducing the number of animated edges or dots

## Example Use Cases

- **Data Flow** - Use flow animations to show how data moves through a system
- **Critical Path** - Highlight the critical path with glow or rainbow animations
- **Status Indicators** - Use traffic light dots to indicate status of different connections
- **Processing Speed** - Vary animation speeds to show processing time differences
- **Bidirectional Communication** - Use bidirectional edges with reverse animations to show two-way communication 