// ============================================
// LESSON 2: Interfaces and Type Aliases
// ============================================

// Interfaces define the shape of objects
// They're one of TypeScript's most powerful features!

// ----------------------------
// 1. BASIC INTERFACE
// ----------------------------

interface User {
  name: string;
  age: number;
  email: string;
}

// Now we can use this interface as a type:
const user: User = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
};

// TypeScript will error if we miss a property or use wrong types:
// const badUser: User = {
//     name: "Jane",
//     age: "25" // Error: age should be number
// };

// ----------------------------
// 2. OPTIONAL PROPERTIES
// ----------------------------

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string; // The ? makes it optional
  inStock?: boolean;
}

const product1: Product = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  // description and inStock are optional, so we can omit them
};

const product2: Product = {
  id: 2,
  name: "Mouse",
  price: 29.99,
  description: "Wireless mouse",
  inStock: true,
};

// ----------------------------
// 3. READONLY PROPERTIES
// ----------------------------

interface Config {
  readonly apiKey: string; // Can't be changed after initialization
  readonly baseUrl: string;
  timeout: number; // This can be changed
}

const config: Config = {
  apiKey: "abc123",
  baseUrl: "https://api.example.com",
  timeout: 5000,
};

// config.apiKey = "new-key"; // Error! Cannot assign to 'apiKey' because it is a read-only property
config.timeout = 10000; // This is fine

// ----------------------------
// 4. INTERFACE EXTENSION (Inheritance)
// ----------------------------

interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark: () => void;
}

interface Cat extends Animal {
  color: string;
  meow: () => void;
}

const myDog: Dog = {
  name: "Buddy",
  age: 3,
  breed: "Golden Retriever",
  bark: () => console.log("Woof!"),
};

// Multiple inheritance
interface BaseEmployee {
  id: number;
  name: string;
}

interface Manager {
  department: string;
}

interface ManagerEmployee extends BaseEmployee, Manager {
  teamSize: number;
}

const manager: ManagerEmployee = {
  id: 1,
  name: "Alice",
  department: "Engineering",
  teamSize: 5,
};

// ----------------------------
// 5. INTERFACES WITH METHODS
// ----------------------------

interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  },
};

// ----------------------------
// 6. INDEX SIGNATURES
// ----------------------------

// When you don't know all property names ahead of time
interface Dictionary {
  [key: string]: string; // Any string key maps to a string value
}

const colors: Dictionary = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  // Can add more dynamically
};

// Mixed known and unknown properties
interface FlexibleApiResponse {
  status: number;
  message: string;
  [key: string]: any; // Can have other properties of any type
}

// ----------------------------
// 7. TYPE ALIASES - Alternative to Interfaces
// ----------------------------

// Type aliases can do similar things to interfaces
type Point = {
  x: number;
  y: number;
};

type ID = string | number; // Can also create union types

type Status = "pending" | "approved" | "rejected"; // Literal types

// ----------------------------
// 8. INTERFACES vs TYPE ALIASES
// ----------------------------

// Interfaces can be extended and merged
interface Base {
  id: number;
}

interface Base {
  // This merges with the previous declaration!
  name: string;
}

// Type aliases cannot be merged
// type Base = { id: number; }
// type Base = { name: string; } // Error!

// Interfaces are better for object shapes that might be extended
// Type aliases are better for unions, intersections, and complex types

// ----------------------------
// 9. INTERSECTION TYPES (Type Aliases)
// ----------------------------

type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

// Intersection: combines both types
type PersonEmployee = Person & Employee;

const personEmployee: PersonEmployee = {
  name: "Bob",
  age: 35,
  employeeId: 123,
  department: "Sales",
};

// ----------------------------
// 10. PRACTICAL EXAMPLE: API Response
// ----------------------------

interface ApiUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  status: number;
  timestamp: number;
}

function fetchUser(id: number): Promise<ApiResponse<ApiUser>> {
  // Simulated API call
  return Promise.resolve({
    success: true,
    data: {
      id: id,
      username: "johndoe",
      email: "john@example.com",
      createdAt: "2024-01-01",
      profile: {
        avatar: "https://example.com/avatar.jpg",
        bio: "Software developer",
      },
    },
    status: 200,
    timestamp: Date.now(),
  });
}

// ----------------------------
// EXERCISES
// ----------------------------

// 1. Create an interface for a Book with title, author, pages, and optional isbn
interface Book {
  title: string;
  author: string;
  pages: number;
  isbn?: string;
}
// 2. Create an interface for a Car that extends a Vehicle interface
interface Vehicle {
  make: string;
  model: string;
  year: number;
}
interface Car extends Vehicle {
  color: string;
  doors: number;
}
const myCar: Car = {
  make: "Toyota",
  model: "Corolla",
  year: 2024,
  color: "Red",
  doors: 4,
};
// 3. Create a type alias for a callback function: (value: string) => void
const callbackFunction = (value: string): void => {
  console.log(value);
};
// 4. Create an interface with an index signature for a cache system
interface Cache {
  [key: string]: any;
}
const cache: Cache = {
  key1: "value1",
  key2: "value2",
  key3: "value3",
};
// Make this file a module to avoid global scope conflicts
export { myCar, callbackFunction, cache };
