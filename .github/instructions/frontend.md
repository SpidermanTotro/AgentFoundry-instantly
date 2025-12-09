---
files:
  - "src/**/*.jsx"
  - "src/**/*.css"
  - "index.html"
  - "vite.config.js"
---

# Frontend Development Instructions

## React Component Guidelines

### Component Structure
- Use functional components with hooks exclusively
- Organize hooks in this order: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### Props and State Management
- Destructure props in function parameters: `function MyComponent({ prop1, prop2 }) {`
- Use meaningful, descriptive prop names
- Prefer controlled components over uncontrolled
- Keep state as close to where it's used as possible
- Lift state up only when necessary for sharing

### File Organization
- One component per file
- Component file: `ComponentName.jsx`
- Matching styles: `ComponentName.css` (if needed)
- Place in `src/components/` directory
- Group related components in subdirectories if complex

### Monaco Editor Integration
- Use `@monaco-editor/react` package
- Import as: `import Editor from '@monaco-editor/react'`
- Always specify language and theme props
- Handle editor mounting with `onMount` callback
- Use `useRef` to store editor instance

Example:
```javascript
import { useRef } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const editorRef = useRef(null);
  
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      theme="vs-dark"
      onMount={handleEditorDidMount}
    />
  );
}
```

### Styling Guidelines
- Use plain CSS, no CSS-in-JS or frameworks
- Use CSS modules for component-specific styles if needed
- Follow BEM naming convention for class names
- Keep global styles in `App.css`
- Use CSS variables for theme colors and common values

### Import Order
```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import Editor from '@monaco-editor/react';
import { FaIcon } from 'react-icons/fa';

// 3. Local components
import ChatPanel from './ChatPanel';
import StatusBar from './StatusBar';

// 4. Utilities and helpers
import { formatCode } from '../utils/formatters';

// 5. Styles
import './MyComponent.css';
```

### Event Handlers
- Prefix handler functions with `handle`: `handleClick`, `handleSubmit`, `handleChange`
- Use arrow functions for inline handlers: `onClick={() => handleClick(id)}`
- Prevent default for form submissions: `e.preventDefault()`

### API Communication
- Make API calls to backend at `http://localhost:3001/api/*`
- Use async/await with try-catch for error handling
- Show loading states during API calls
- Display user-friendly error messages

Example:
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function handleSubmit(code) {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### Performance Optimization
- Use `React.memo()` for expensive components that receive same props
- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback` when passing to child components
- Avoid inline object/array creation in JSX when possible

### Accessibility
- Use semantic HTML elements
- Add `aria-label` for icon buttons
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Use `alt` text for images

### Common Patterns

**Conditional Rendering:**
```javascript
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}
```

**List Rendering:**
```javascript
{items.map(item => (
  <ItemComponent key={item.id} item={item} />
))}
```

**Form Handling:**
```javascript
const [formData, setFormData] = useState({ name: '', email: '' });

function handleInputChange(e) {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
}
```

## Vite Configuration
- Keep configuration minimal
- Use React plugin: `@vitejs/plugin-react`
- Default dev server port: 5173
- Proxy API requests to backend during development if needed
