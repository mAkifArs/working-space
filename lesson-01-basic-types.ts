// ============================================
// LESSON 1: Basic Types and Type Annotations
// ============================================

// In JavaScript, you'd write:
// let name = "John";
// let age = 30;
// let isActive = true;

// In TypeScript, you can be explicit about types:

// ----------------------------
// 1. PRIMITIVE TYPES
// ----------------------------

// String
let userName: string = "John";
let greeting: string = `Hello, ${userName}!`; // Template literals work too

// Number (includes integers, floats, Infinity, NaN)
let age: number = 30;
let price: number = 19.99;
let infinity: number = Infinity;

// Boolean
let isActive: boolean = true;
let isComplete: boolean = false;

// ----------------------------
// 2. TYPE INFERENCE
// ----------------------------

// TypeScript is smart! You don't always need to write types:
let inferredString = "Hello"; // TypeScript knows this is a string
let inferredNumber = 42; // TypeScript knows this is a number
let inferredBoolean = true; // TypeScript knows this is a boolean

// Try uncommenting this - TypeScript will error!
// inferredString = 123; // Error: Type 'number' is not assignable to type 'string'

// ----------------------------
// 3. ARRAYS
// ----------------------------

// Array of strings
let fruits: string[] = ["apple", "banana", "orange"];
// Alternative syntax:
let numbers: Array<number> = [1, 2, 3, 4, 5];

// Mixed arrays? Use union types (we'll learn more later)
let mixed: (string | number)[] = ["hello", 42, "world", 100];

// ----------------------------
// 4. TUPLES
// ----------------------------

// Tuples are arrays with fixed length and specific types at each position
let person: [string, number] = ["John", 30];
// person = [30, "John"]; // Error! Wrong order

let coordinates: [number, number] = [10.5, 20.3];
let rgb: [number, number, number] = [255, 128, 0];

// Optional tuple elements (using ?)
let optionalTuple: [string, number?] = ["hello"]; // number is optional
let optionalTuple2: [string, number?] = ["hello", 42];

// ----------------------------
// 5. ANY - The Escape Hatch (Use Sparingly!)
// ----------------------------

// 'any' disables type checking - use only when necessary
let anything: any = "hello";
anything = 42;
anything = true;
anything = { foo: "bar" };

// This is usually a code smell - try to avoid 'any'

// ----------------------------
// 6. UNKNOWN - Safer than 'any'
// ----------------------------

// 'unknown' is like 'any' but safer - you must check before using
let userInput: unknown = getUserInput(); // Assume this function exists

// This won't work without type checking:
// let str: string = userInput; // Error!

// You need to narrow it first:
if (typeof userInput === "string") {
  let str: string = userInput; // Now it's safe!
}

// ----------------------------
// 7. VOID - For Functions That Return Nothing
// ----------------------------

function logMessage(message: string): void {
  console.log(message);
  // No return statement, or return; is fine
}

// ----------------------------
// 8. NEVER - For Functions That Never Return
// ----------------------------

// Functions that throw errors
function throwError(message: string): never {
  throw new Error(message);
}

// Functions with infinite loops
function infiniteLoop(): never {
  while (true) {
    // This never returns
  }
}

// ----------------------------
// 9. NULL AND UNDEFINED
// ----------------------------

// In TypeScript, null and undefined are their own types
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// But they're also subtypes of other types (with strictNullChecks)
let maybeString: string | null = null;
let maybeNumber: number | undefined = undefined;

// ----------------------------
// 10. PRACTICAL EXAMPLE
// ----------------------------

function calculateTotal(items: number[], tax: number): number {
  const subtotal = items.reduce((sum, item) => sum + item, 0);
  return subtotal + subtotal * tax;
}

const prices: number[] = [10, 20, 30];
const total: number = calculateTotal(prices, 0.1);
console.log(`Total: $${total}`);

// ----------------------------
// EXERCISES (Try these!)
// ----------------------------

// 1. Create a variable for a user's email (string)
let email: string = "";
// 2. Create an array of user IDs (numbers)
let userIds: number[] = [1, 2, 3, 4, 5]; // Using regular numbers for user IDs
// Note: If you want Infinity or NaN, use: [1, 2, Infinity, NaN] (capital I)
// 3. Create a tuple for a 2D point [x, y]
let pointOfElement: [number, number] = [1, 2];
// 4. Write a function that takes a name (string) and returns a greeting (string)
const greetUser = (userName: string): string => {
  return `Hello, ${userName}!`;
};

// Helper function for unknown example
function getUserInput(): unknown {
  return "some input";
}

// Make this file a module to avoid global scope conflicts
export {};
