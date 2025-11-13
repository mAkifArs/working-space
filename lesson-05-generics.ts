// ============================================
// LESSON 5: Generics
// ============================================

// Generics allow you to write reusable code that works with multiple types
// Think of them as "type variables"

// ----------------------------
// 1. BASIC GENERIC FUNCTION
// ----------------------------

// Without generics - we'd need separate functions or use 'any'
function identity<T>(arg: T): T {
  return arg;
}

// T is a type variable - it represents any type
const num = identity<number>(42); // T is number
const str = identity<string>("hello"); // T is string
const bool = identity<boolean>(true); // T is boolean

// TypeScript can infer the type:
const inferred = identity("world"); // T is inferred as string

// ----------------------------
// 2. GENERIC ARRAY FUNCTIONS
// ----------------------------

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

function getLastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const numbers = [1, 2, 3, 4];
const firstNum = getFirstElement(numbers); // Type: number | undefined

const strings = ["a", "b", "c"];
const lastStr = getLastElement(strings); // Type: string | undefined

// ----------------------------
// 3. MULTIPLE TYPE PARAMETERS
// ----------------------------

function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const numberStringPair = pair(42, "hello"); // [number, string]
const stringBooleanPair = pair("test", true); // [string, boolean]

// ----------------------------
// 4. GENERIC CONSTRAINTS
// ----------------------------

// Sometimes you want to limit what types can be used
interface HasLength {
  length: number;
}

// T must have a length property
function logLength<T extends HasLength>(item: T): void {
  console.log(`Length: ${item.length}`);
}

logLength("hello"); // Works - strings have length
logLength([1, 2, 3]); // Works - arrays have length
// logLength(42);          // Error! numbers don't have length

// ----------------------------
// 5. KEYOF CONSTRAINT
// ----------------------------

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: "John",
  age: 30,
  email: "john@example.com",
};

const name = getProperty(person, "name"); // Type: string
const age = getProperty(person, "age"); // Type: number
// const invalid = getProperty(person, "invalid"); // Error! "invalid" is not a key

// ----------------------------
// 6. GENERIC CLASSES
// ----------------------------

class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const numberBox = new Box<number>(42);
console.log(numberBox.getValue()); // 42

const stringBox = new Box<string>("hello");
console.log(stringBox.getValue()); // "hello"

// ----------------------------
// 7. GENERIC INTERFACES
// ----------------------------

interface Repository<T> {
  findById(id: number): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: number): boolean;
}

class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  findAll(): User[] {
    return [...this.users];
  }

  save(user: User): void {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  delete(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}

// ----------------------------
// 8. DEFAULT TYPE PARAMETERS
// ----------------------------

interface Cache<T = string> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

// Uses default type (string)
const stringCache: Cache = {
  get: (key) => undefined,
  set: (key, value) => {},
};

// Explicitly specify type
const numberCache: Cache<number> = {
  get: (key) => undefined,
  set: (key, value) => {},
};

// ----------------------------
// 9. CONDITIONAL TYPES IN GENERICS (Advanced Preview)
// ----------------------------

type NonNullable<T> = T extends null | undefined ? never : T;

function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value cannot be null or undefined");
  }
  return value as NonNullable<T>;
}

// ----------------------------
// 10. UTILITY TYPES WITH GENERICS
// ----------------------------

// Partial<T> - makes all properties optional
type PartialUser = Partial<User>;

// Required<T> - makes all properties required
type RequiredUser = Required<PartialUser>;

// Pick<T, K> - pick specific properties
type UserName = Pick<User, "name">;

// Omit<T, K> - omit specific properties
type UserWithoutEmail = Omit<User, "email">;

// Record<K, T> - creates an object type with keys of type K and values of type T
// This is a GENERIC utility type!
// Record<Keys, ValueType>

// Example 1: Simple Record
type UserRoles = Record<string, "admin" | "user" | "guest">;
// Creates: { [key: string]: "admin" | "user" | "guest" }
const roles: UserRoles = {
  user1: "admin",
  user2: "user",
  user3: "guest",
};

// Example 2: Record with specific keys
type StatusMap = Record<"pending" | "approved" | "rejected", boolean>;
// Creates: { pending: boolean; approved: boolean; rejected: boolean }
const status: StatusMap = {
  pending: true,
  approved: false,
  rejected: false,
};

// Example 3: Record with object values
type UserMap = Record<number, User>;
// Creates: { [key: number]: User }
const usersById: UserMap = {
  1: { id: 1, name: "Alice", email: "alice@example.com" },
  2: { id: 2, name: "Bob", email: "bob@example.com" },
};

// Example 4: Record as a generic function parameter
function createMap<T>(
  items: T[],
  keySelector: (item: T) => string
): Record<string, T> {
  const map: Record<string, T> = {};
  for (const item of items) {
    map[keySelector(item)] = item;
  }
  return map;
}

// Usage:
const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];
const userMap = createMap(users, (user) => user.email);
// Result: Record<string, User>
// userMap["alice@example.com"] → User object

// Example 5: Record vs object literal type
// Record<string, number> is equivalent to:
type Equivalent = { [key: string]: number };

// But Record is more concise and clear!

// ----------------------------
// 11. PRACTICAL EXAMPLE: API Response Wrapper
// ----------------------------

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

class ApiClient {
  async fetchData<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        success: true,
        data: data as T,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
      };
    }
  }
}

// Usage (in an async function):
async function example() {
  const client = new ApiClient();
  const userResponse = await client.fetchData<User>(
    "https://api.example.com/user/1"
  );
  if (userResponse.success && userResponse.data) {
    console.log(userResponse.data.name); // TypeScript knows this is a User
  }
}

// ----------------------------
// 12. GENERIC FUNCTION OVERLOADS
// ----------------------------

function process<T extends string>(value: T): string;
function process<T extends number>(value: T): number;
function process<T>(value: T): T {
  return value;
}

const strResult = process("hello"); // Type: string
const numResult = process(42); // Type: number

// ----------------------------
// 13. EXTRACTING FIRST ARGUMENT TYPE (FirstArg)
// ----------------------------

// Sometimes you want to extract the type of the first argument from a function
// This is useful for creating type-safe wrappers or reusing types

// Method 1: Using Parameters utility type
function greet(name: string, age: number): void {
  console.log(`Hello ${name}, you are ${age} years old`);
}

// Extract first parameter type using Parameters<T>[0]
type FirstArg1 = Parameters<typeof greet>[0]; // string

// Method 2: Create a reusable FirstArg utility type
type FirstArg<T extends (...args: any) => any> = Parameters<T>[0];

// Now you can use it easily:
type GreetFirstArg = FirstArg<typeof greet>; // string

// Practical Example 1: API Functions
async function fetchUser(
  userId: number,
  includeProfile: boolean
): Promise<User> {
  // Fetch user logic...
  return { id: userId, name: "", email: "" };
}

type UserIdType = FirstArg<typeof fetchUser>; // number

// Use the extracted type
function validateUserId(id: UserIdType): boolean {
  return typeof id === "number" && id > 0;
}

// Practical Example 2: Event Handlers
type ClickEvent = {
  clientX: number;
  clientY: number;
  preventDefault(): void;
};

function handleClick(event: ClickEvent, button: string): void {
  console.log(
    `Button ${button} clicked at (${event.clientX}, ${event.clientY})`
  );
}

type ClickEventType = FirstArg<typeof handleClick>; // ClickEvent

// Reuse the event type in another handler
function anotherClickHandler(event: ClickEventType): void {
  // TypeScript knows event is ClickEvent
  event.preventDefault();
  console.log(event.clientX, event.clientY);
}

// Practical Example 3: Form Handlers
function submitForm(
  formData: { email: string; password: string },
  options?: { validate: boolean }
): void {
  // Submit logic...
}

type FormDataType = FirstArg<typeof submitForm>;
// Result: { email: string; password: string }

// Use it to create a type-safe form builder
function createForm(data: FormDataType): void {
  // TypeScript ensures data matches the expected form structure
  submitForm(data);
}

// Practical Example 4: Callback Functions
function processItems<T>(
  items: T[],
  callback: (item: T, index: number) => void
): void {
  items.forEach(callback);
}

// Extract the callback's first parameter type
type CallbackFirstArg<T> = FirstArg<Parameters<typeof processItems<T>>[1]>;
// Breaking it down:
// 1. typeof processItems<T> = function with callback parameter
// 2. Parameters<...>[1] = the callback function type
// 3. FirstArg<...> = first parameter of the callback (T)

// Usage:
type StringCallbackArg = CallbackFirstArg<string>; // string
type NumberCallbackArg = CallbackFirstArg<number>; // number

// Practical Example 5: Generic Functions
// For generic functions, you can create a type alias for a specific instantiation
type StringIdentity = (value: string) => string;
type StringIdentityArg = FirstArg<StringIdentity>; // string

// Or extract from a wrapper function
function stringIdentity(value: string): string {
  return identity(value);
}
type StringIdentityArg2 = FirstArg<typeof stringIdentity>; // string

// ----------------------------
// EXERCISES
// ----------------------------

// 1. Create a generic Stack class with push, pop, and peek methods
// 2. Write a generic function that swaps two array elements
// 3. Create a generic function that filters an array based on a predicate
// 4. Write a generic function that creates a map from an array using a key selector

// Make this file a module to avoid global scope conflicts
export {};
