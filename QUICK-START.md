# Quick Start Guide

## Installation

1. **Install TypeScript globally** (optional but recommended):
   ```bash
   npm install -g typescript
   ```

2. **Or install locally in this project**:
   ```bash
   cd TypeScript-Course
   npm install
   ```

3. **Install ts-node** (to run TypeScript files directly):
   ```bash
   npm install -g ts-node
   # or locally: npm install --save-dev ts-node
   ```

## Running the Lessons

### Option 1: Using ts-node (Recommended for Learning)
```bash
# Run a specific lesson
ts-node lesson-01-basic-types.ts
ts-node lesson-02-interfaces-types.ts
# ... etc
```

Or use the npm scripts:
```bash
npm run lesson-01
npm run lesson-02
# ... etc
```

### Option 2: Compile Then Run
```bash
# Compile all TypeScript files
npm run build
# or
tsc

# Then run the compiled JavaScript
node dist/lesson-01-basic-types.js
```

### Option 3: Watch Mode (Auto-compile on changes)
```bash
npm run watch
# This will watch for changes and recompile automatically
```

## Learning Path

1. **Start with Lesson 1** - Get familiar with basic types
2. **Work through sequentially** - Each lesson builds on the previous
3. **Experiment** - Modify the code, break things, see what TypeScript tells you
4. **Do the exercises** - At the end of each lesson
5. **Practice** - Try converting your JavaScript code to TypeScript

## Tips

- **Read error messages carefully** - TypeScript errors are usually very helpful
- **Don't use `any` as a crutch** - Try to understand the proper types
- **Let TypeScript infer types** - You don't always need explicit annotations
- **Use your IDE** - Hover over variables to see their types
- **Start strict** - The tsconfig.json uses strict mode (best practice)

## Common Commands

```bash
# Check TypeScript version
tsc --version

# Compile a specific file
tsc lesson-01-basic-types.ts

# Compile with watch mode
tsc --watch

# Type check without emitting files
tsc --noEmit
```

## Next Steps

After completing all lessons:
1. Try converting a small JavaScript project to TypeScript
2. Explore TypeScript with React, Vue, or your favorite framework
3. Read the official TypeScript Handbook: https://www.typescriptlang.org/docs/
4. Practice with real-world projects

Happy coding! 🎉

