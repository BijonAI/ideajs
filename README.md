# vue-string-compiler
The inbrowser compiler of Vue that could compile vue string to a component without any building tools.

## Usage

```shell
pnpm create vite my-project --template vue-ts
cd my-project
pnpm i
pnpm add vue-string-compiler
```

Add the plugin to your project:

```ts
import { createInbrowserCompiler } from 'vue-string-compiler'
import * as someModule from 'some-module'

app.use(createInbrowserCompiler({
  addition: {
    // There is your additional modules, please use his package name as key and the module as value, for example:
    'some-module': someModule
  }
}))
```

```vue
<script setup lang="ts">
import { precompile, compile } from 'vue-string-compiler'

const precomponent = precompile(`
<script setup>

</script>

<template>
  <div>Hello World</div>
</template>
`)
const component = compile(precomponent)
</script>
```

# Technical Report: Vue In-Browser Compiler Implementation and Limitations

## Overview
This report details the implementation principles and limitations of a Vue in-browser compiler, focusing on module handling and variable scope management.

## 1. Vue In-Browser Compiler Limitations

### 1.1 Compilation Environment
- Limited to browser environment, lacking Node.js module resolution capabilities
- Cannot directly use Node.js-style `require` statements
- No access to file system for module resolution

### 1.2 Module Management
- Cannot handle dynamic imports
- Limited to predefined module mappings
- No support for complex module resolution paths
- Cannot handle circular dependencies

### 1.3 Scope Management
- Difficulty in accurately tracking variable scopes in complex nested functions
- Limited ability to handle dynamic scope creation
- Challenges with hoisting behaviors

## 2. Module Import Processing Principles

### 2.1 Module Mapping Implementation
```typescript
const moduleMap = {
  'module-name': ModuleObject,
  // ... other mappings
}
```

### 2.2 Import Processing Steps
1. **Pattern Matching**: Identify require statements using regex
```typescript
const requirePattern = /(?:(?:var|const|let)\s+)?([$\w]+)\s*=\s*require\((["'])(.+?)\2\)/g
```

2. **Module Injection**:
- Map module names to actual implementations
- Inject modules into window object for global access
```typescript
for (const match of matches) {
  const varName = match[1]
  const moduleName = match[3]
  if (modules.hasOwnProperty(moduleName)) {
    (window as any)[varName] = modules[moduleName]
  }
}
```

3. **Cleanup**:
- Remove require statements after processing
- Maintain clean compiled output

## 3. Non-Top-Level Variable Handling

### 3.1 Variable Detection Strategy
1. **Function Scope Detection**:
```typescript
const functionPattern = /(?:function\s*\w*\s*\([^)]*\)|(?:\([^)]*\)|[^=])\s*=>|\w+\s*\([^)]*\))\s*{([^}]*)}|(?:\([^)]*\)|[^=])\s*=>\s*([^;,}]+)/g
```
- Matches regular functions
- Matches arrow functions
- Matches method shorthand syntax

2. **Variable Declaration Detection**:
```typescript
const varDeclarationPattern = /(?:var|let|const)\s+(\w+)\s*=|(\w+)\s*=(?!=)/g
```
- Captures variable declarations
- Captures assignments

### 3.2 Return Statement Cleanup Process
1. Collect all function-scoped variables
2. Filter return statement object properties
3. Remove properties matching function-scoped variables
```typescript
script = script.replace(
  /return\s*{([^}]+)}/g,
  (match, returnContent) => {
    const validReturns = returnContent
      .split(',')
      .map(item => item.trim())
      .filter(item => {
        const varName = item.split(':')[0].trim()
        return !functionScopedVars.has(varName)
      })
      .join(',')
    
    return `return {${validReturns}}`
  }
)
```

## 4. Technical Challenges and Solutions

### 4.1 Scope Resolution
**Challenge**: Accurately identifying variable scope in nested functions
**Solution**: Regex-based function body analysis with special handling for arrow functions

### 4.2 Module Resolution
**Challenge**: Handling module dependencies without Node.js environment
**Solution**: Predefined module mapping with global injection

### 4.3 Variable Cleanup
**Challenge**: Preventing undefined variable references
**Solution**: Proactive identification and removal of non-top-level variables

## 5. Future Improvements

### 5.1 Potential Enhancements
- Better handling of complex destructuring patterns
- Support for dynamic imports
- Improved scope analysis for complex nested functions
- Better handling of closure variables

### 5.2 Known Limitations to Address
- Limited support for complex module resolution
- Potential issues with minified code
- Edge cases in variable scope detection

## Conclusion
While the current implementation provides a working solution for in-browser Vue compilation, there are several areas where improvements could be made. The main trade-off is between compilation accuracy and implementation complexity, with the current approach favoring simplicity and reliability over handling every edge case.