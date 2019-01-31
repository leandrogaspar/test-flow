module.exports = class Context {
  constructor() {
    this.map = new Map();
    this.deferStack = [];
  }

  /**
     * Returns the Context storage
     *
     * @remarks
     * The context have a Map storage that can be use for passing
     * anything between nodes.
     *
     * @param key The element key
     * @returns The specified element or undefined if not found
     */
  get storage() {
    return this.map;
  }

  /**
     * Defer a function to be executed after the flow is done
     *
     * @remarks
     * Deferred functions are called LIFO
     *
     * @param fn Function to be executed after the flow end
     * @returns The Context
     */
  defer(fn) {
    if (typeof fn !== 'function') {
      throw TypeError('You can only defer functions');
    }
    this.deferStack.push(fn);
    return this;
  }

  /**
     * From last to first, call the defered functions
     *
     * @remarks
     * Deferred functions are called LIFO
     *
     * @returns Promise that will be resolved after all the defer stack is executed and empty
     */
  async runDefer() {
    const results = [];
    while (this.deferStack.length !== 0) {
      results.push(this.deferStack.pop()());
    }
    await Promise.all(this.deferStack);
  }
};
