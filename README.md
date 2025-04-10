# FlowCanvas

FlowCanvas is a web-based tool for creating visual automation flows. Users can design node-based workflows by connecting different service nodes (WhatsApp, Email, ChatGPT, etc.) to create visual representations of their automation processes.

## Features

### Canvas Management
- Responsive canvas with pan and zoom functionality
- Customizable canvas grid and background
- Minimap navigation
- Node selection and manipulation

### Node System
- Pre-defined node types with customizable styling
- Node color customization
- Node duplication and deletion
- Text labels and emoji icons
- Four connection handles per node (top, right, bottom, left)

### Connection System
- Customizable connection styles
- Connection animations
- Connection labels
- Directional flow indicators

### Animation Features
- Animated dots traveling along connection paths with:
  - Customizable dot size and color
  - Adjustable animation speed
  - Seamless looping
- Node glow/pulse animations with:
  - Customizable glow color
  - Adjustable intensity
  - Smooth pulse effect

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Canvas**: ReactFlow for node-based diagrams
- **State Management**: Zustand
- **Styling**: Tailwind CSS, ShadCN UI
- **Animations**: Framer Motion
- **Database**: Convex

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser
5. Login with username: `admin` and password: `admin`

## Usage

### Animation Controls

#### Edge Animations

1. Select an edge by clicking on it
2. In the properties panel (right sidebar), go to the "Edge" tab
3. Toggle "Show Animated Dot" to enable the flowing dot animation
4. Customize the dot with the following options:
   - Dot Size: Adjust the size of the animated dot
   - Dot Color: Change the color of the dot
   - Animation Speed: Control how fast the dot travels along the path

#### Node Glow Effect

1. Select a node by clicking on it
2. In the properties panel, go to the "Node" tab
3. Scroll down to the "Glow Effect" section
4. Toggle "Enable Glow" to activate the pulsing glow effect
5. Customize the glow with:
   - Glow Color: Change the color of the glow effect
   - Intensity: Adjust how strong the glow appears

## License

MIT
