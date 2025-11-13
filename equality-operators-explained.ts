// ============================================
// == vs === : The Difference Explained
// ============================================

// ----------------------------
// QUICK ANSWER
// ----------------------------

// ==  (loose equality) - Converts types before comparing
// === (strict equality) - Compares types AND values (no conversion)

// ----------------------------
// 1. STRICT EQUALITY (===) - RECOMMENDED
// ----------------------------

// === checks BOTH type and value
// No type conversion happens

console.log(5 === 5);        // true ✅ (same type: number, same value: 5)
console.log(5 === "5");      // false ❌ (different types: number vs string)
console.log(true === 1);    // false ❌ (different types: boolean vs number)
console.log(null === undefined); // false ❌ (different types)

// ----------------------------
// 2. LOOSE EQUALITY (==) - AVOID IN TYPESCRIPT
// ----------------------------

// == converts types FIRST, then compares
// This can lead to unexpected results!

console.log(5 == 5);         // true ✅
console.log(5 == "5");      // true ⚠️ (string "5" converted to number 5)
console.log(true == 1);     // true ⚠️ (true converted to 1)
console.log(false == 0);    // true ⚠️ (false converted to 0)
console.log(null == undefined); // true ⚠️ (special case)
console.log("" == 0);       // true ⚠️ (empty string converted to 0)
console.log(" " == 0);      // true ⚠️ (space string converted to 0)

// ----------------------------
// 3. DANGEROUS EXAMPLES WITH ==
// ----------------------------

// These are all TRUE with ==, but probably not what you want!
console.log(0 == false);           // true ⚠️
console.log("" == false);         // true ⚠️
console.log([] == false);         // true ⚠️ (empty array)
console.log("0" == false);        // true ⚠️
console.log(null == false);        // false (but null == undefined is true!)

// With ===, these are all FALSE (safer!)
console.log(0 === false);         // false ✅
console.log("" === false);         // false ✅
console.log([] === false);         // false ✅
console.log("0" === false);        // false ✅
console.log(null === false);       // false ✅

// ----------------------------
// 4. REAL-WORLD BUG EXAMPLE
// ----------------------------

function checkAge(age: number | string) {
  // ❌ BAD: Using == can cause bugs
  if (age == 18) {
    console.log("You're 18!");
  }
  
  // If someone passes "18" (string), this will still be true!
  // checkAge("18") → true (unexpected!)
}

function checkAgeSafe(age: number | string) {
  // ✅ GOOD: Using === is safer
  if (age === 18) {
    console.log("You're 18!");
  }
  
  // If someone passes "18" (string), this will be false (expected!)
  // checkAgeSafe("18") → false ✅
}

// ----------------------------
// 5. TYPE CONVERSION RULES (for ==)
// ----------------------------

// When using ==, JavaScript converts types in this order:
// 1. If one is number, convert the other to number
// 2. If one is boolean, convert to number (true=1, false=0)
// 3. If one is string, try to convert to number
// 4. null and undefined are special (they equal each other)

// Examples:
"5" == 5;        // "5" → 5, then 5 == 5 → true
true == 1;       // true → 1, then 1 == 1 → true
false == 0;      // false → 0, then 0 == 0 → true
"" == 0;         // "" → 0, then 0 == 0 → true
" " == 0;       // " " → 0, then 0 == 0 → true

// ----------------------------
// 6. ARRAYS AND OBJECTS
// ----------------------------

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = arr1;

// Arrays/objects are compared by REFERENCE, not value
console.log(arr1 == arr2);   // false (different references)
console.log(arr1 === arr2);  // false (different references)
console.log(arr1 === arr3);  // true ✅ (same reference)

// ----------------------------
// 7. WHEN TO USE EACH
// ----------------------------

// ✅ ALWAYS USE === in TypeScript/JavaScript
// - More predictable
// - No hidden type conversions
// - Catches bugs early
// - TypeScript/ESLint will warn you about ==

// ❌ AVOID == (loose equality)
// - Can cause unexpected bugs
// - Harder to debug
// - Not type-safe

// ----------------------------
// 8. PRACTICAL EXAMPLES
// ----------------------------

// Example 1: User input
const userInput: string | number = "5";

// ❌ BAD
if (userInput == 5) {
  // This is true! But userInput is a string!
  console.log("This runs even though userInput is a string!");
}

// ✅ GOOD
if (userInput === 5) {
  // This is false, which is correct
  console.log("This doesn't run");
}

// Example 2: Checking for null/undefined
const value: string | null | undefined = null;

// Both work the same for null/undefined
console.log(value == null);   // true
console.log(value === null);  // true

// But === is more explicit
if (value === null || value === undefined) {
  // Clear what you're checking
}

// Or use nullish coalescing
const result = value ?? "default";

// ----------------------------
// 9. TYPESCRIPT/ESLINT RULES
// ----------------------------

// Most TypeScript projects use ESLint rule:
// "eqeqeq": ["error", "always"]
// This will ERROR if you use == instead of ===

// ----------------------------
// 10. SUMMARY TABLE
// ----------------------------

// Comparison          == (loose)    === (strict)
// 5 == 5              true ✅        true ✅
// 5 == "5"            true ⚠️        false ✅
// true == 1           true ⚠️        false ✅
// false == 0          true ⚠️        false ✅
// null == undefined   true ⚠️        false ✅
// "" == 0             true ⚠️        false ✅
// " " == 0            true ⚠️        false ✅
// [] == false         true ⚠️        false ✅

// ----------------------------
// GOLDEN RULE
// ----------------------------

// In TypeScript: ALWAYS use ===
// The only exception: checking for null OR undefined
// if (value == null) { } // This checks for both null AND undefined
// But even then, it's clearer to write:
// if (value === null || value === undefined) { }

export {};

