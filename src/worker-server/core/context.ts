export class Context {

    private map: Map<string, any> = new Map();
    private deferStack = [];

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
    public get storage(): Map<string, any> {
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
    public defer(fn: () => any): Context {
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
    public async runDefer(): Promise<any> {
        while (this.deferStack.length !== 0) {
            await this.deferStack.pop()();
        }
    }
}