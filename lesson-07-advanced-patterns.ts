// ============================================
// LESSON 7: Advanced Patterns
// ============================================
// This is the "crazy stuff" - advanced TypeScript patterns!

// ----------------------------
// 1. CONDITIONAL TYPES
// ----------------------------

// Conditional types let you choose types based on conditions
// Syntax: T extends U ? X : Y

type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<string>; // false

// More useful example
type NonNullable<T> = T extends null | undefined ? never : T;

type Test3 = NonNullable<string | null>; // string
type Test4 = NonNullable<string | undefined>; // string

// ----------------------------
// 2. INFERRED TYPES IN CONDITIONALS
// ----------------------------

// Use 'infer' to extract types from other types
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type Element1 = ArrayElementType<string[]>; // string
type Element2 = ArrayElementType<number[]>; // number
type Element3 = ArrayElementType<string>; // never

// Extract return type from function
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Return1 = FunctionReturnType<() => string>; // string
type Return2 = FunctionReturnType<(x: number) => boolean>; // boolean

// Extract function parameters
type FunctionParameters<T> = T extends (...args: infer P) => any ? P : never;

type Params1 = FunctionParameters<(a: string, b: number) => void>; // [string, number]

// ----------------------------
// 3. MAPPED TYPES
// ----------------------------

// Transform each property in a type

// Make all properties optional
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  name: string;
  age: number;
  email: string;
}

type OptionalUser = Optional<User>;
type NullableUser = Nullable<User>;

// ----------------------------
// 4. TEMPLATE LITERAL TYPES (Advanced)
// ----------------------------

// Create types from string templates
type EventName = "click" | "hover" | "focus";
type ElementType = "button" | "input" | "div";

type EventHandlerName = `on${Capitalize<EventName>}`;
// Result: "onClick" | "onHover" | "onFocus"

// More complex example
type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;

type UserGetter = GetterName<"name" | "age">; // "getName" | "getAge"
type UserSetter = SetterName<"name" | "age">; // "setName" | "setAge"

// ----------------------------
// 5. RECURSIVE TYPES
// ----------------------------

// Types that reference themselves

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const json: JsonValue = {
  name: "John",
  age: 30,
  tags: ["developer", "typescript"],
  metadata: {
    created: "2024-01-01",
    nested: {
      deep: true,
    },
  },
};

// Tree structure
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

const tree: TreeNode<string> = {
  value: "root",
  children: [
    { value: "child1" },
    {
      value: "child2",
      children: [{ value: "grandchild1" }],
    },
  ],
};

// ----------------------------
// 6. DISTRIBUTIVE CONDITIONAL TYPES
// ----------------------------

// When you use conditional types with union types, they distribute

type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// Result: string[] | number[] (not (string | number)[])

// To prevent distribution, wrap in square brackets
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type StrOrNumArr = ToArrayNonDist<string | number>;
// Result: (string | number)[]

// ----------------------------
// 7. BRANDED TYPES (Nominal Typing)
// ----------------------------

// TypeScript uses structural typing, but sometimes you want nominal typing

type UserId = number & { readonly brand: unique symbol };
type ProductId = number & { readonly brand: unique symbol };

function createUserId(id: number): UserId {
  return id as UserId;
}

function createProductId(id: number): ProductId {
  return id as ProductId;
}

const userId = createUserId(123);
const productId = createProductId(123);

// userId === productId; // Type error! Even though both are 123

// ----------------------------
// 8. TYPE-LEVEL PROGRAMMING
// ----------------------------

// You can do computation at the type level!

// Add two number literal types
type Add<A extends number, B extends number> = A extends 0
  ? B
  : A extends 1
  ? B extends 0
    ? 1
    : B extends 1
    ? 2
    : never
  : never; // Simplified version

// More practical: String manipulation
type Trim<S extends string> = S extends ` ${infer Rest}` | `${infer Rest} `
  ? Trim<Rest>
  : S;

type Trimmed = Trim<"  hello  ">; // "hello"

// ----------------------------
// 9. UTILITY TYPE COMBINATIONS
// ----------------------------

// Combine multiple utility types for powerful transformations

interface ApiResponse {
  data: {
    users: User[];
    total: number;
  };
  status: number;
  message: string;
}

// Extract just the data shape, make it partial
type PartialApiData = Partial<Pick<ApiResponse, "data">["data"]>;

// Create a type that makes all nested properties optional
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type PartialApiResponse = DeepPartial<ApiResponse>;

// ----------------------------
// 10. CONST ASSERTIONS
// ----------------------------

// Make values readonly and infer literal types

const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;

// config.apiUrl = "new"; // Error! Readonly
// Type of config.apiUrl is "https://api.example.com" (not string)

// Extract types from const objects
type Config = typeof config;
type ApiUrl = typeof config.apiUrl; // "https://api.example.com"

// ----------------------------
// 11. SATISFIES OPERATOR (TypeScript 4.9+)
// ----------------------------

// Ensures a value matches a type without widening the type

const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
} satisfies {
  colors: Record<string, string>;
  spacing: Record<string, string>;
};

// theme.colors.primary is still the literal "#007bff", not just string

// ----------------------------
// 12. PRACTICAL EXAMPLE: Type-Safe Event System
// ----------------------------

type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string };
  load: { url: string };
};

type EventName = keyof EventMap;
type EventHandler<T extends EventName> = (event: EventMap[T]) => void;

class EventEmitter {
  private handlers: Map<EventName, Set<EventHandler<any>>> = new Map();

  on<T extends EventName>(event: T, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  emit<T extends EventName>(event: T, data: EventMap[T]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

const emitter = new EventEmitter();

emitter.on("click", (event) => {
  console.log(event.x, event.y); // TypeScript knows event has x and y
});

emitter.on("keypress", (event) => {
  console.log(event.key); // TypeScript knows event has key
});

emitter.emit("click", { x: 10, y: 20 });
emitter.emit("keypress", { key: "Enter" });

// ----------------------------
// EXERCISES (Challenge yourself!)
// ----------------------------

// 1. Create a type that extracts all function property names from an interface
// 2. Write a conditional type that checks if a type is a promise
// 3. Create a mapped type that makes all properties of a type have getter/setter names
// 4. Build a type-safe builder pattern using generics and conditional types

// Make this file a module to avoid global scope conflicts
export {};
