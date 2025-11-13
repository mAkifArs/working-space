// ============================================
// LESSON 4: Classes and Object-Oriented Programming
// ============================================

// TypeScript adds type annotations and access modifiers to JavaScript classes

// ----------------------------
// 1. BASIC CLASS
// ----------------------------

class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

const person = new Person("Alice", 30);
console.log(person.greet());

// ----------------------------
// 2. ACCESS MODIFIERS
// ----------------------------

class BankAccount {
  public accountNumber: string; // Can be accessed anywhere
  private balance: number; // Only accessible within this class
  protected owner: string; // Accessible in this class and subclasses

  constructor(
    accountNumber: string,
    owner: string,
    initialBalance: number = 0
  ) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  public withdraw(amount: number): boolean {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      return true;
    }
    return false;
  }

  public getBalance(): number {
    return this.balance; // Can access private property from within class
  }
}

const account = new BankAccount("12345", "John", 1000);
account.deposit(500);
// account.balance = 10000; // Error! balance is private
console.log(account.getBalance()); // 1500

// ----------------------------
// 3. READONLY PROPERTIES
// ----------------------------

class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Can't modify readonly properties after initialization
  // move(dx: number, dy: number): void {
  //     this.x += dx; // Error!
  // }
}

const point = new Point(10, 20);
// point.x = 30; // Error! x is readonly

// ----------------------------
// 4. PARAMETER PROPERTIES (Shorthand)
// ----------------------------

// Instead of this:
class OldWay {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// You can write this:
class NewWay {
  constructor(private name: string, private age: number) {}

  getName(): string {
    return this.name; // Still accessible as this.name
  }
}

// ----------------------------
// 5. GETTERS AND SETTERS
// ----------------------------

class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature cannot be below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value: number) {
    this._celsius = ((value - 32) * 5) / 9;
  }
}

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit); // 77

temp.fahrenheit = 100;
console.log(temp.celsius); // ~37.78

// ----------------------------
// 6. INHERITANCE
// ----------------------------

class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, breed: string) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  bark(): void {
    console.log(`${this.name} (${this.breed}) says: Woof!`);
  }

  // Override parent method
  move(distance: number = 5): void {
    console.log(`${this.name} ran ${distance}m.`);
    super.move(distance); // Call parent method
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.bark();
dog.move(10);

// ----------------------------
// 7. ABSTRACT CLASSES
// ----------------------------

// Cannot be instantiated directly, must be extended
abstract class Shape {
  protected color: string;

  constructor(color: string) {
    this.color = color;
  }

  // Abstract method - must be implemented by subclasses
  abstract getArea(): number;

  // Concrete method - can be used by subclasses
  getColor(): string {
    return this.color;
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(color: string, width: number, height: number) {
    super(color);
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// const shape = new Shape("red"); // Error! Cannot instantiate abstract class
const circle = new Circle("blue", 5);
const rectangle = new Rectangle("green", 4, 6);

console.log(circle.getArea()); // ~78.54
console.log(rectangle.getArea()); // 24

// ----------------------------
// 8. STATIC MEMBERS
// ----------------------------

class MathUtils {
  static PI: number = 3.14159;

  static add(a: number, b: number): number {
    return a + b;
  }

  static max(...numbers: number[]): number {
    return Math.max(...numbers);
  }
}

// Access static members without instantiating
console.log(MathUtils.PI);
console.log(MathUtils.add(5, 3));
console.log(MathUtils.max(1, 5, 3, 9, 2));

// ----------------------------
// 9. IMPLEMENTING INTERFACES
// ----------------------------

interface Flyable {
  fly(): void;
  maxAltitude: number;
}

interface Swimmable {
  swim(): void;
  maxDepth: number;
}

class Duck implements Flyable, Swimmable {
  maxAltitude: number = 1000;
  maxDepth: number = 5;

  fly(): void {
    console.log("Duck is flying!");
  }

  swim(): void {
    console.log("Duck is swimming!");
  }
}

// ----------------------------
// 10. PRIVATE CONSTRUCTORS (Singleton Pattern)
// ----------------------------

class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  connect(): void {
    console.log("Connected to database");
  }
}

// const db = new DatabaseConnection(); // Error! Constructor is private
const db = DatabaseConnection.getInstance();
db.connect();

// ----------------------------
// 11. PRACTICAL EXAMPLE: API Client
// ----------------------------

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private buildHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(),
    });
    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// ----------------------------
// EXERCISES
// ----------------------------

// 1. Create a Vehicle class with make, model, and year. Add a method to get the age.
// 2. Create a Student class that extends a Person class with a studentId property.
// 3. Create an abstract Logger class with abstract log() method, and implement it in ConsoleLogger.
// 4. Create a Counter class with private count and static methods to create instances.

// Make this file a module to avoid global scope conflicts
export {};
