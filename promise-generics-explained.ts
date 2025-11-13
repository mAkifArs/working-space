// ============================================
// Understanding Promise<string> and the <> Syntax
// ============================================

// ----------------------------
// 1. WHAT IS <> IN TYPESCRIPT?
// ----------------------------

// The <> syntax is for GENERICS (we'll learn more in Lesson 5)
// It's like a "type variable" - you fill in the type

// Promise<string> means: "A Promise that will resolve to a string"
// Promise<number> means: "A Promise that will resolve to a number"
// Promise<User> means: "A Promise that will resolve to a User object"

// Think of it like a box with a label:
// Promise<string> = A box labeled "string" - you know what's inside!

// ----------------------------
// 2. BREAKING DOWN Promise<string>
// ----------------------------

async function fetchData(url: string): Promise<string> {
  //                    ↑              ↑
  //                    |              |
  //              parameter type   return type
  //                                 (Promise that resolves to string)
  
  const response = await fetch(url);
  return response.text(); // This returns a string, so Promise<string> is correct
}

// What this means:
// - The function returns a Promise
// - When the Promise resolves (finishes), it will give you a string
// - TypeScript knows the result will be a string, not a number or object

// ----------------------------
// 3. HOW TO USE IT
// ----------------------------

// When you call the function:
const result = await fetchData("https://api.example.com");
// TypeScript knows: result is a string ✅

// You can use string methods:
const upper = result.toUpperCase(); // ✅ Works! TypeScript knows it's a string
// const num = result * 2; // ❌ Error! Can't multiply a string

// ----------------------------
// 4. COMPARING DIFFERENT PROMISE TYPES
// ----------------------------

// Promise<string> - resolves to a string
async function getText(): Promise<string> {
  return "Hello";
}

// Promise<number> - resolves to a number
async function getNumber(): Promise<number> {
  return 42;
}

// Promise<User> - resolves to a User object
interface User {
  id: number;
  name: string;
}

async function getUser(): Promise<User> {
  return { id: 1, name: "John" };
}

// Promise<string | null> - resolves to either string OR null
async function fetchDataSafe(url: string): Promise<string | null> {
  //                    ↑
  //                    |
  //              Can return string OR null
  try {
    const response = await fetch(url);
    return response.text(); // Returns string
  } catch (error) {
    return null; // Returns null on error
  }
}

// ----------------------------
// 5. WHY USE Promise<string> INSTEAD OF JUST Promise?
// ----------------------------

// ❌ Without the type:
async function badFetch(url: string): Promise {
  // TypeScript doesn't know what the Promise will give you!
  return fetch(url).then(r => r.text());
}

const result1 = await badFetch("url");
// result1 type is: any (TypeScript doesn't know what it is!)

// ✅ With the type:
async function goodFetch(url: string): Promise<string> {
  // TypeScript knows it will be a string!
  return fetch(url).then(r => r.text());
}

const result2 = await goodFetch("url");
// result2 type is: string ✅
// Now you can use .toUpperCase(), .split(), etc.

// ----------------------------
// 6. REAL-WORLD EXAMPLE
// ----------------------------

// Fetching JSON data
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json(); // TypeScript knows this is User
  return user;
}

// Using it:
const user = await fetchUser(1);
console.log(user.name); // ✅ TypeScript knows user has a 'name' property
console.log(user.email); // ✅ TypeScript knows user has an 'email' property
// console.log(user.invalid); // ❌ Error! Property doesn't exist

// ----------------------------
// 7. ERROR HANDLING WITH Promise<string | null>
// ----------------------------

async function fetchDataSafe(url: string): Promise<string | null> {
  // Return type: Promise<string | null>
  // This means: "A Promise that resolves to either a string OR null"
  
  try {
    const response = await fetch(url);
    return response.text(); // Returns string
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null; // Returns null on error
  }
}

// When using it, you need to check for null:
const data = await fetchDataSafe("https://api.example.com");

if (data !== null) {
  // TypeScript knows: data is string here ✅
  console.log(data.toUpperCase()); // Works!
} else {
  // TypeScript knows: data is null here
  console.log("Failed to fetch data");
}

// ----------------------------
// 8. VISUAL EXPLANATION
// ----------------------------

// Promise<string> is like a labeled box:
//
// ┌─────────────────┐
// │   Promise       │
// │                 │
// │  Contains:      │
// │  ┌───────────┐ │
// │  │  string   │ │  ← This is what the <> tells you
// │  └───────────┘ │
// └─────────────────┘
//
// When the Promise resolves, you get the string inside!

// ----------------------------
// 9. COMMON PATTERNS
// ----------------------------

// Pattern 1: Simple type
Promise<string>        // Resolves to string
Promise<number>        // Resolves to number
Promise<boolean>       // Resolves to boolean

// Pattern 2: Union types (one of several types)
Promise<string | null>           // String OR null
Promise<User | undefined>        // User OR undefined
Promise<string | number>         // String OR number

// Pattern 3: Object types
Promise<User>                     // Resolves to User object
Promise<{ data: User[] }>         // Resolves to object with data array

// Pattern 4: Array types
Promise<string[]>                 // Resolves to array of strings
Promise<User[]>                   // Resolves to array of User objects

// ----------------------------
// 10. PRACTICAL COMPARISON
// ----------------------------

// Without Promise<string>:
async function fetch1(url: string) {
  // TypeScript doesn't know return type!
  return fetch(url).then(r => r.text());
}
const result1 = await fetch1("url");
// result1 type: Promise<string> (but TypeScript doesn't know it's a string!)

// With Promise<string>:
async function fetch2(url: string): Promise<string> {
  // TypeScript knows it returns a string!
  return fetch(url).then(r => r.text());
}
const result2 = await fetch2("url");
// result2 type: string ✅ (TypeScript knows!)

// ----------------------------
// SUMMARY
// ----------------------------

// Promise<string> means:
// 1. It's a Promise (async operation)
// 2. When it finishes, it will give you a string
// 3. The <> tells TypeScript what type is inside the Promise

// Benefits:
// - TypeScript knows what you'll get
// - Autocomplete works
// - Type checking prevents errors
// - Better code documentation

export {};

