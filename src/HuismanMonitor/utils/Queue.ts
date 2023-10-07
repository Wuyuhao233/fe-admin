export class Queue {
  queue: any[] = [];
  constructor() {
    this.queue = [];
  }
  push(...args: any[]) {
    this.queue.push(...args);
  }
  shift() {
    return this.queue.shift();
  }
  get length() {
    return this.queue.length;
  }
}
