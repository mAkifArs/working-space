// ============================================
// LESSON 3: Functions and Advanced Function Types
// ============================================

// Functions in TypeScript can have type annotations for parameters and return values

// ----------------------------
// 1. BASIC FUNCTION TYPES
// ----------------------------

// Function with explicit types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => {
  return a * b;
};

// Shorthand arrow function
const divide = (a: number, b: number): number => a / b;

// ----------------------------
// 2. OPTIONAL PARAMETERS
// ----------------------------

function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

console.log(greet("John")); // "Hello, John!"
console.log(greet("Jane", "Dr.")); // "Hello, Dr. Jane!"

// Optional parameters must come after required ones
// function bad(a?: number, b: number): void {} // Error!

// ----------------------------
// 3. DEFAULT PARAMETERS
// ----------------------------

function createUser(
  name: string,
  age: number = 18, // Default value
  isActive: boolean = true
): { name: string; age: number; isActive: boolean } {
  return { name, age, isActive };
}

console.log(createUser("Alice")); // Uses defaults for age and isActive
console.log(createUser("Bob", 25)); // Uses default for isActive
console.log(createUser("Charlie", 30, false)); // All parameters provided

// ----------------------------
// 4. REST PARAMETERS
// ----------------------------

function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest parameter must be last
function processItems(item: string, ...items: string[]): void {
  console.log(`First: ${item}`);
  console.log(`Rest: ${items.join(", ")}`);
}

// ----------------------------
// 5. FUNCTION TYPES AS VALUES
// ----------------------------

// Define a type for a function
type MathOperation = (a: number, b: number) => number;

const subtract: MathOperation = (a, b) => a - b;
const power: MathOperation = (a, b) => Math.pow(a, b);

// Use it as a parameter
function calculate(a: number, b: number, operation: MathOperation): number {
  return operation(a, b);
}

console.log(calculate(10, 5, add)); // 15
console.log(calculate(10, 5, subtract)); // 5

// ----------------------------
// 6. FUNCTION OVERLOADS
// ----------------------------

// Multiple function signatures for different use cases
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "YES" : "NO";
  }
}

console.log(format("hello")); // "HELLO"
console.log(format(3.14159)); // "3.14"
console.log(format(true)); // "YES"

// ----------------------------
// 7. GENERIC FUNCTIONS (Preview - Full lesson later)
// ----------------------------

// Functions that work with multiple types
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");
// TypeScript can infer the type:
const inferred = identity("world"); // Type is string

// ----------------------------
// 8. ASYNC FUNCTIONS
// ----------------------------

// Promise<string> means: "A Promise that resolves to a string"
// The <> syntax is for GENERICS (type parameters)
// Promise<string> = Promise that contains a string when it resolves
// Promise<number> = Promise that contains a number when it resolves
// Think of it like: Promise<WHAT_TYPE_IS_INSIDE>

async function fetchData(url: string): Promise<string> {
  //                    ↑              ↑
  //                    |              |
  //              parameter type   return type
  //                                 Promise<string> = Promise that gives you a string
  const response = await fetch(url);
  return response.text(); // Returns string, so Promise<string> is correct
}

// When you use it:
// const data = await fetchData("url");
// TypeScript knows: data is a string ✅

// Or with error handling
async function fetchDataSafe(url: string): Promise<string | null> {
  //                    ↑              ↑
  //                    |              |
  //              parameter type   return type
  //                                 Promise<string | null> = Promise that gives you string OR null
  try {
    const response = await fetch(url);
    return response.text(); // Returns string
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null; // Returns null on error
  }
}

// When you use it:
// const data = await fetchDataSafe("url");
// TypeScript knows: data is string | null
// So you need to check: if (data !== null) { ... }

// ----------------------------
// 9. VOID AND NEVER RETURN TYPES
// ----------------------------

// Void: function doesn't return a value (or returns undefined)
function logMessage(message: string): void {
  console.log(message);
}

// Never: function never returns (throws error or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}

// ----------------------------
// 10. CALLBACK FUNCTIONS
// ----------------------------

type Callback = (error: Error | null, data?: string) => void;

function fetchWithCallback(url: string, callback: Callback): void {
  // Simulated async operation
  setTimeout(() => {
    if (url.startsWith("http")) {
      callback(null, "Data received");
    } else {
      callback(new Error("Invalid URL"));
    }
  }, 1000);
}

fetchWithCallback("https://api.example.com", (error, data) => {
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success:", data);
  }
});

// ----------------------------
// 11. HIGHER-ORDER FUNCTIONS
// ----------------------------

// Higher-order functions are functions that:
// 1. Take other functions as arguments, OR
// 2. Return functions as results

// ----------------------------
// STEP 1: Understanding the Transformer Type
// ----------------------------

// Transformer<T, U> is a TYPE for a function
// It means: "A function that takes a value of type T and returns a value of type U"
type Transformer<T, U> = (value: T) => U;
//        ↑      ↑    ↑
//        |      |    └─ Function that takes T, returns U
//        |      └────── Output type (what comes out)
//        └───────────── Input type (what goes in)

// Examples of Transformer functions:
// Transformer<number, number> = (value: number) => number
//   Example: (n) => n * 2  (takes number, returns number)

// Transformer<number, string> = (value: number) => string
//   Example: (n) => n.toString()  (takes number, returns string)

// Transformer<string, number> = (value: string) => number
//   Example: (str) => str.length  (takes string, returns number)

// ----------------------------
// STEP 2: Understanding mapArray Function
// ----------------------------

// mapArray is a GENERIC function (works with any types)
function mapArray<T, U>(arr: T[], transformer: Transformer<T, U>): U[] {
  //        ↑  ↑    ↑              ↑
  //        |  |    |              └─ A function that transforms T to U
  //        |  |    └──────────────── Input array of type T
  //        |  └───────────────────── Output type (array of U)
  //        └──────────────────────── Input type (array of T)

  return arr.map(transformer);
  // arr.map() calls the transformer function on each element
  // [1, 2, 3].map((n) => n * 2) = [2, 4, 6]
}

// What this means:
// - Takes an array of type T (e.g., number[])
// - Takes a function that converts T → U (e.g., number → string)
// - Returns an array of type U (e.g., string[])

// ----------------------------
// STEP 3: Breaking Down the Examples
// ----------------------------

const numbers = [1, 2, 3, 4];

// Example 1: Transform number → number
const doubled = mapArray(numbers, (n) => n * 2);
//         ↑              ↑         ↑
//         |              |         └─ Transformer function: (n: number) => number
//         |              └─────────── Input: number[] = [1, 2, 3, 4]
//         └────────────────────────── Output: number[] = [2, 4, 6, 8]

// Step by step:
// 1. mapArray receives: [1, 2, 3, 4] and (n) => n * 2
// 2. It calls arr.map((n) => n * 2)
// 3. For each number: 1*2=2, 2*2=4, 3*2=6, 4*2=8
// 4. Returns: [2, 4, 6, 8]

// Example 2: Transform number → string
const strings = mapArray(numbers, (n) => n.toString());
//         ↑              ↑         ↑
//         |              |         └─ Transformer: (n: number) => string
//         |              └─────────── Input: number[] = [1, 2, 3, 4]
//         └────────────────────────── Output: string[] = ["1", "2", "3", "4"]

// Step by step:
// 1. mapArray receives: [1, 2, 3, 4] and (n) => n.toString()
// 2. It calls arr.map((n) => n.toString())
// 3. For each number: 1→"1", 2→"2", 3→"3", 4→"4"
// 4. Returns: ["1", "2", "3", "4"]

// ----------------------------
// STEP 4: Visual Comparison
// ----------------------------

// Without mapArray (using array.map directly):
const doubled1 = [1, 2, 3, 4].map((n) => n * 2); // [2, 4, 6, 8]
const strings1 = [1, 2, 3, 4].map((n) => n.toString()); // ["1", "2", "3", "4"]

// With mapArray (our higher-order function):
const doubled2 = mapArray([1, 2, 3, 4], (n) => n * 2); // [2, 4, 6, 8]
const strings2 = mapArray([1, 2, 3, 4], (n) => n.toString()); // ["1", "2", "3", "4"]

// They do the same thing! mapArray is just a wrapper that adds type safety

// ----------------------------
// STEP 5: More Examples
// ----------------------------

// Transform string → number (get lengths)
const words = ["hello", "world", "typescript"];
const lengths = mapArray(words, (word) => word.length);
// lengths: number[] = [5, 5, 10]

// Transform number → boolean (check if even)
const isEven = mapArray([1, 2, 3, 4], (n) => n % 2 === 0);
// isEven: boolean[] = [false, true, false, true]

// Transform object → string (extract names)
interface Person {
  name: string;
  age: number;
}
const people: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
const names = mapArray(people, (person) => person.name);
// names: string[] = ["Alice", "Bob"]

// ----------------------------
// 12. PRACTICAL EXAMPLE: Event Handler
// ----------------------------

type EventHandler<T> = (event: T) => void;

interface ClickEvent {
  x: number;
  y: number;
  button: "left" | "right" | "middle";
}

class Button {
  private onClickHandler?: EventHandler<ClickEvent>;

  setOnClick(handler: EventHandler<ClickEvent>): void {
    this.onClickHandler = handler;
  }

  click(event: ClickEvent): void {
    if (this.onClickHandler) {
      this.onClickHandler(event);
    }
  }
}

const button = new Button();
button.setOnClick((event) => {
  console.log(
    `Clicked at (${event.x}, ${event.y}) with ${event.button} button`
  );
});

// ----------------------------
// EXERCISES
// ----------------------------

// 1. Write a function that takes an array of numbers and returns the average

function getAverage(numbers: number[]): number | null {
  // Check for empty array
  if (numbers.length === 0) {
    // Use === instead of == (strict equality is preferred in TypeScript)
    return null;
  }

  // Calculate average: sum all numbers, then divide by count
  const sum = numbers.reduce((total, num) => total + num, 0);
  const average = sum / numbers.length;
  return average;

  // Or more concise (one line):
  // return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// 2. Create a function type for a validator: (value: string) => boolean

// Step 1: Create the TYPE (this is what the exercise asks for)
type Validator = (value: string) => boolean;
//     ↑              ↑
//     |              └─ Function that takes string, returns boolean
//     └──────────────── Type name

// Step 2: Create a function that uses this type
const isEmail: Validator = (value: string): boolean => {
  return value.includes("@");
};

// Or a more complex validator
const isNotEmpty: Validator = (value: string): boolean => {
  return value.trim().length > 0;
};

// Your original example (simplified):
const isTrue: Validator = (value: string): boolean => {
  return value === "True";
  // No need for if/else - just return the comparison directly!
};

// 3. Write an overloaded function that formats dates (string or Date object)
function dateFormatter(value: Date): string;
function dateFormatter(value: string): string;
function dateFormatter(value: Date | string): string {
  // Issue 1: typeof Date returns "object", not Date
  // Use instanceof to check if it's a Date object
  if (value instanceof Date) {
    // Format the Date object to ISO string
    return value.toISOString();
  } else if (typeof value === "string") {
    // Issue 2: typeof returns a string, so use "string" (with quotes)
    // If it's already a string, convert it to Date first, then format
    return new Date(value).toISOString();
  }

  // Issue 3: Function must return in all code paths
  // This shouldn't happen due to the union type, but TypeScript requires it
  throw new Error("Invalid date value");
}

// Usage examples:
// dateFormatter(new Date()) → "2024-01-01T00:00:00.000Z"
// dateFormatter("2024-01-01") → "2024-01-01T00:00:00.000Z"

// 4. Create a generic function that returns the first element of an array
// Note: Arrays can be empty, so return type should be T | undefined
// (Similar to lesson-05-generics.ts example)

// ----------------------------
// BREAKING DOWN THE GENERIC SYNTAX
// ----------------------------

function getFirstElement<T>(array: T[]): T | undefined {
  //     ↑        ↑     ↑      ↑    ↑
  //     |        |     |      |    └─ Return type: T or undefined
  //     |        |     |      └────── Parameter type: array of T
  //     |        |     └───────────── Parameter name
  //     |        └─────────────────── Generic type parameter (type variable)
  //     └──────────────────────────── Function name

  return array[0]; // Returns undefined if array is empty
}

// ----------------------------
// STEP-BY-STEP EXPLANATION
// ----------------------------

// 1. <T> - This DECLARES a type variable
//    Think of T as a placeholder for "any type"
//    It's like saying: "This function works with ANY type, we'll call it T"

// 2. array: T[] - This USES the type variable
//    T[] means "an array of whatever type T is"
//    If T is number, then T[] is number[]
//    If T is string, then T[] is string[]

// 3. : T | undefined - This also USES the type variable
//    The return type is "whatever T is, OR undefined"
//    If T is number, return type is number | undefined
//    If T is string, return type is string | undefined

// ----------------------------
// HOW IT WORKS IN PRACTICE
// ----------------------------

// Example 1: With number array
const numbers = [1, 2, 3, 4];
const firstNum = getFirstElement(numbers);
// TypeScript sees: getFirstElement<number>([1, 2, 3, 4])
// T = number
// array: number[] ✅
// return: number | undefined ✅
// firstNum type: number | undefined

// Example 2: With string array
const words = ["hello", "world"];
const firstWord = getFirstElement(words);
// TypeScript sees: getFirstElement<string>(["hello", "world"])
// T = string
// array: string[] ✅
// return: string | undefined ✅
// firstWord type: string | undefined

// Example 3: TypeScript can INFER the type (you don't need to write <T>)
const mixed = [1, 2, 3];
const first = getFirstElement(mixed);
// TypeScript automatically infers: getFirstElement<number>
// You don't need to write: getFirstElement<number>(mixed)

// ----------------------------
// VISUAL ANALOGY
// ----------------------------

// Think of <T> as a "type template":
//
// function getFirstElement<T>(array: T[]): T | undefined
//                              ↑    ↑      ↑
//                              |    |      └─ Return: same type as input
//                              |    └──────── Input: array of that type
//                              └───────────── Declare: T is a type variable
//
// When you call it:
// getFirstElement([1, 2, 3])
// TypeScript fills in: T = number
// So it becomes: getFirstElement<number>(array: number[]): number | undefined

// ----------------------------
// WHY USE GENERICS?
// ----------------------------

// Without generics, you'd need separate functions:
/* function getFirstNumber(array: number[]): number | undefined {
  return array[0];
}
function getFirstString(array: string[]): string | undefined {
  return array[0];
} */
// ... one for each type! 😫

// With generics, ONE function works for ALL types:
/* function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
} */
// Works with numbers, strings, objects, anything! ✅

// ----------------------------
// THE RELATIONSHIP
// ----------------------------

// <T> declares: "T is a type variable"
// T[] uses: "array of type T"
// T | undefined uses: "type T or undefined"

// They're all connected! When you call the function:
// - TypeScript figures out what T is from the argument
// - Then uses that same T everywhere in the function signature
// - This ensures type safety: input and output types match!

// Alternative using array destructuring (more modern approach):
// const [first] = array;
// return first;
// Make this file a module to avoid global scope conflicts

export { getAverage, getFirstElement };
