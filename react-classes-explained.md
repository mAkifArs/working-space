# Classes in React & TypeScript: When and Why?

## TL;DR: Classes are still needed for Error Boundaries, but functional components are preferred for everything else.

---

## 1. **Error Boundaries (Still Require Classes!)**

React Error Boundaries **must** be class components. There's no hook equivalent yet:

```typescript
// ❌ This doesn't exist - Error Boundaries MUST be classes
function ErrorBoundary() {
  // No hook for componentDidCatch
}

// ✅ This is the ONLY way to create Error Boundaries
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

**Why?** React doesn't have hooks for `componentDidCatch` or `getDerivedStateFromError` yet.

---

## 2. **Legacy Codebases**

Many companies still have class-based React code:

```typescript
// Old code you might encounter
class UserProfile extends React.Component<Props, State> {
  componentDidMount() {
    // Fetch user data
  }

  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

**You need to understand classes to:**

- Maintain existing codebases
- Refactor class components to functional components
- Work with older libraries

---

## 3. **TypeScript Classes Outside React**

Classes are **heavily used** outside React! Understanding them is crucial:

### Backend/Node.js

```typescript
// Express.js controllers
class UserController {
  async getUser(req: Request, res: Response) {
    // Handle request
  }
}

// Database models
class User {
  constructor(public id: number, public name: string, public email: string) {}

  save() {
    // Save to database
  }
}
```

### Game Development

```typescript
class Player {
  private health: number = 100;

  takeDamage(amount: number) {
    this.health -= amount;
  }
}
```

### State Management Libraries

```typescript
// MobX uses classes
class TodoStore {
  @observable todos: Todo[] = [];

  @action addTodo(todo: Todo) {
    this.todos.push(todo);
  }
}
```

---

## 4. **Modern React: Functional Components Win**

For 99% of React code, use functional components:

```typescript
// ✅ Modern way (preferred)
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ❌ Old way (avoid for new code)
class UserProfile extends React.Component<{ userId: number }> {
  state = { user: null };

  componentDidMount() {
    fetchUser(this.props.userId).then((user) => {
      this.setState({ user });
    });
  }

  render() {
    return <div>{this.state.user?.name}</div>;
  }
}
```

**Why functional components?**

- Simpler syntax
- Better performance (usually)
- Easier to test
- Hooks are more powerful
- Less boilerplate

---

## 5. **When You Might Still Use Classes**

### Complex State Logic

```typescript
// Sometimes classes help organize complex logic
class FormValidator {
  private rules: ValidationRule[] = [];

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
  }

  validate(data: FormData): ValidationResult {
    // Complex validation logic
  }
}

// Use in functional component
function MyForm() {
  const validator = useMemo(() => new FormValidator(), []);
  // Use validator...
}
```

### Third-Party Libraries

Some libraries require class instances:

```typescript
// Some animation libraries
const animation = new Animation(config);
```

---

## 6. **TypeScript Classes vs React Classes**

**Important distinction:**

- **TypeScript classes** = Used everywhere (backend, utilities, models)
- **React class components** = Mostly legacy, except Error Boundaries

```typescript
// ✅ TypeScript class (used everywhere)
class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(endpoint: string): Promise<T> {
    // API logic
  }
}

// ✅ Use in functional component
function MyComponent() {
  const api = useMemo(() => new ApiClient("https://api.com"), []);
  // Use api...
}

// ❌ React class component (mostly avoid)
class MyComponent extends React.Component {
  // Old way
}
```

---

## 7. **Real-World Example: Error Boundary**

Here's a practical use case you'll encounter:

```typescript
// ErrorBoundary.tsx (MUST be a class)
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Use it in your app
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <MyApp />
    </ErrorBoundary>
  );
}
```

---

## Summary

| Use Case                 | Class Needed? | Why                               |
| ------------------------ | ------------- | --------------------------------- |
| **Error Boundaries**     | ✅ **YES**    | No hook alternative exists        |
| **New React Components** | ❌ No         | Use functional components + hooks |
| **Backend/Node.js**      | ✅ Yes        | Classes are standard              |
| **TypeScript Utilities** | ✅ Yes        | Classes organize code well        |
| **Legacy Code**          | ⚠️ Maybe      | Need to understand to maintain    |

---

## Key Takeaways

1. **For React components**: Use functional components (except Error Boundaries)
2. **For TypeScript/Backend**: Classes are very common and useful
3. **Error Boundaries**: Still require class components (React limitation)
4. **Understanding classes**: Still important for:
   - Working with legacy code
   - Backend development
   - TypeScript in general
   - Understanding OOP concepts

**Bottom line**: Learn classes because they're used everywhere in TypeScript/JavaScript, but in React, prefer functional components with hooks!
