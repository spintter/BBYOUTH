# CLAUDE.md - Development Guide

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `next lint` - Run ESLint checks

## Code Style Guidelines
- **Components**: Use functional components with hooks, PascalCase naming
- **Imports**: React first, then libraries, then local imports
- **Naming**: camelCase for variables/functions, PascalCase for components, UPPERCASE for constants
- **File Structure**: Extend existing files before creating new ones
- **Animation**: Use Context API for animation state management
- **Error Handling**: Try/catch for async, fallback UI, explicit error states
- **Performance**: Employ useMemo/useCallback and React.memo for optimization
- **State**: Context API with reducers for global state
- **Three.js**: Place 3D-related logic in dedicated files, use assetLoader utility

## Accessibility
- Ensure animations respect reduced motion preferences
- Maintain keyboard navigation support
- Use semantic HTML where possible

## Notes
This project combines Next.js, Three.js for 3D graphics, and React.