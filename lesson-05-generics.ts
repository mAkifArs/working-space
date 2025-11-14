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
// IMPORTANT: Omit does NOT make properties optional or nullable!
// It only removes the specified properties. Remaining properties keep their original required/optional status.
type UserWithoutEmail = Omit<User, "email">;
// Result: { id: number; name: string } - both id and name are still REQUIRED

// Example demonstrating that Omit preserves required/optional status:
interface UserWithOptional {
  id: number;
  name: string;
  email: string;
  age?: number; // optional property
}

type UserWithoutEmail2 = Omit<UserWithOptional, "email">;
// Result: { id: number; name: string; age?: number }
// - id and name remain REQUIRED
// - age remains OPTIONAL (was optional before, still optional after)

// Record<K, T> - creates an object type with keys of type K and values of type T
// This is a GENERIC utility type!
// Record<Keys, ValueType>

// Example 1: Simple Record
type UserRoles = Record<string, "admin" | "user" | "guest">;
// Creates: { [key: string]: "admin" | "user" | "guest" }
// NOTE: The keys (user1, user2, user3) are NOT defined in the type!
// Record<string, ...> means ANY string can be a key.
// I just chose "user1", "user2", "user3" as example keys - you could use ANY strings!
const roles: UserRoles = {
  user1: "admin", // "user1" is just an example - could be "alice", "bob", etc.
  user2: "user", // "user2" is just an example - could be "charlie", "diana", etc.
  user3: "guest", // "user3" is just an example - could be "eve", "frank", etc.
};
// You could also write:
// const roles2: UserRoles = {
//   alice: "admin",
//   bob: "user",
//   charlie: "guest",
// };

// Example 2: Record with specific keys
// CONTRAST: Here the keys ARE defined in the type!
// Record<"pending" | "approved" | "rejected", ...> means ONLY these 3 keys are allowed
type StatusMap = Record<"pending" | "approved" | "rejected", boolean>;
// Creates: { pending: boolean; approved: boolean; rejected: boolean }
const status: StatusMap = {
  pending: true, // ✅ "pending" is defined in the type
  approved: false, // ✅ "approved" is defined in the type
  rejected: false, // ✅ "rejected" is defined in the type
  // invalid: true, // ❌ Error! "invalid" is NOT in the type
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
// WHAT IS A HASH MAP?
// ----------------------------

// A hash map (also called hash table or dictionary) is a data structure that stores
// key-value pairs and allows fast lookup, insertion, and deletion.

// HOW IT WORKS:
// 1. Takes a key (like "alice@example.com")
// 2. Runs it through a "hash function" that converts it to a number (hash code)
// 3. Uses that number to find the right "bucket" (storage location) in an array
// 4. Stores the value in that bucket

// EXAMPLE:
// Key: "alice@example.com"
//   → Hash function → Hash code: 42
//   → Array index: 42 % arraySize
//   → Store value at that index

// PERFORMANCE:
// - Lookup: O(1) average case (very fast!)
// - Insert: O(1) average case
// - Delete: O(1) average case
// Much faster than searching through an array O(n)!

// IN JAVASCRIPT/TYPESCRIPT:
// JavaScript objects and Map are implementations of hash maps!

// 1. Plain Objects (hash map under the hood)
const userMap1: Record<string, User> = {
  "alice@example.com": { id: 1, name: "Alice", email: "alice@example.com" },
  "bob@example.com": { id: 2, name: "Bob", email: "bob@example.com" },
};
// Fast lookup: userMap1["alice@example.com"] → O(1)

// 2. Map (explicit hash map, better for dynamic keys)
const userMap2 = new Map<string, User>();
userMap2.set("alice@example.com", {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
});
userMap2.set("bob@example.com", {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
});
// Fast lookup: userMap2.get("alice@example.com") → O(1)

// WHEN TO USE:
// - When you need fast lookups by key
// - When you have key-value pairs
// - When you need to avoid duplicate keys
// - Perfect for: user databases, caches, counting occurrences, etc.

// COMPARISON: Array vs Hash Map
const usersArray = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];
// Finding user by email: O(n) - must check every element
const alice = usersArray.find((u) => u.email === "alice@example.com");

const usersHashMap: Record<string, User> = {
  "alice@example.com": { id: 1, name: "Alice", email: "alice@example.com" },
  "bob@example.com": { id: 2, name: "Bob", email: "bob@example.com" },
};
// Finding user by email: O(1) - direct lookup!
const alice2 = usersHashMap["alice@example.com"];

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

// Option 2: Without curly braces (implicit return - more concise)
function remover<T>(arr: T[]): T[] {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
// 2. Write a generic function that swaps two array elements

// BEST PRACTICE: Non-mutating version (returns new array - safer, more functional)
function swapArrayElements<T>(arr: T[], index1: number, index2: number): T[] {
  // Input validation
  if (
    index1 < 0 ||
    index1 >= arr.length ||
    index2 < 0 ||
    index2 >= arr.length
  ) {
    throw new Error("Index out of bounds");
  }
  if (index1 === index2) {
    return [...arr]; // Return copy if same index (no swap needed)
  }

  // Create a copy to avoid mutating original array
  const result = [...arr];
  // Swap using destructuring (clean and readable)
  [result[index1], result[index2]] = [result[index2], result[index1]];
  return result;
}

console.log(swapArrayElements([1, 2, 3, 4, 5, 6], 1, 2));
// Alternative: Mutating version (modifies original array - use when you need in-place modification)
function swapArrayElementsInPlace<T>(
  arr: T[],
  index1: number,
  index2: number
): void {
  if (
    index1 < 0 ||
    index1 >= arr.length ||
    index2 < 0 ||
    index2 >= arr.length
  ) {
    throw new Error("Index out of bounds");
  }
  if (index1 === index2) return; // No swap needed

  // Traditional temp variable approach (also valid)
  const temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}

// BEST PRACTICES:
// 1. ✅ Use camelCase for function names (swapArrayElements, not ArraySwapper)
// 2. ✅ Prefer non-mutating (returns new array) - safer and more functional
// 3. ✅ Validate inputs (check bounds, handle edge cases)
// 4. ✅ Use destructuring for swapping (modern, clean)
// 5. ✅ Handle edge cases (same index, out of bounds)
// 6. ✅ Use separate parameters (index1, index2) instead of tuple - clearer API
// 3. Create a generic function that filters an array based on a predicate

// WHAT IS A PREDICATE?
// A predicate is a function that takes an element and returns a boolean (true/false)
// It "predicates" (asserts) whether something is true about that element
// Examples:
//   - (n: number) => n > 5        → "Is this number greater than 5?"
//   - (s: string) => s.length > 3 → "Is this string longer than 3 characters?"
//   - (user: User) => user.age >= 18 → "Is this user an adult?"

// Generic filter function using a predicate
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

// Usage examples:
const numbersToFilter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = filterArray(numbersToFilter, (n) => n % 2 === 0); // Predicate: "Is it even?"
// Result: [2, 4, 6, 8, 10]

const stringsToFilter = ["hello", "hi", "world", "a", "test"];
const longStrings = filterArray(stringsToFilter, (s) => s.length > 3); // Predicate: "Is it longer than 3?"
// Result: ["hello", "world", "test"]

// With custom types:
interface Person {
  name: string;
  age: number;
}
const people: Person[] = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 30 },
];
const adults = filterArray(people, (person) => person.age >= 18); // Predicate: "Is person an adult?"
// Result: [{ name: "Alice", age: 25 }, { name: "Charlie", age: 30 }]

// NOTE: JavaScript's built-in Array.filter() already does this!
// But creating your own generic version helps you understand the concept.

// 4. Write a generic function that creates a map from an array using a key selector

// ✅ CORRECT VERSION: Function name should be different from parameter name
function arrayToMap<T>(
  items: T[],
  keySelector: (item: T) => string
): Record<string, T> {
  const map: Record<string, T> = {};
  for (const item of items) {
    map[keySelector(item)] = item;
  }
  return map;
}

// Usage example:
// const users = [{ id: 1, name: "Alice", email: "alice@example.com" }];
// const userMap = arrayToMap(users, (user) => user.email);
// Result: { "alice@example.com": { id: 1, name: "Alice", email: "alice@example.com" } }

// NOTE: Your logic was correct! The only issue was the naming conflict.
// The function name `keySelector` conflicted with the parameter name `keySelector`.
// Best practice: Use descriptive function names like `arrayToMap`, `createMap`, or `mapByKey`

// Make this file a module to avoid global scope conflicts
export {};
