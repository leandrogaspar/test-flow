// TODO DOC
export interface INodeMap {
    /**
     * Get a specified node function from it's name
     * 
     * @param name The function name
     * @returns The specified function
     */
    getNode(name: string): Function;
}

// TODO DOC
export interface IContext {
    /**
     * Returns a specified element from the context
     * 
     * @param key The element key
     * @returns The specified element or undefined if not found
     */
    get(key: string): any | undefined;

    /**
     * Adds or updates an element with a specified key and value to the context
     * 
     * @param key The element key
     * @param value The element to be added or updated
     * @returns The Context
     */
    set(key: string, value: any): IContext;

    /**
     * Remove a specified element from the context
     * 
     * @param key The element key
     * @returns true if the element was removed, false if the element does not exists
     */
    delete(key: string): boolean;

    /**
     * Defer a function to be executed after the flow is done
     * 
     * @remarks
     * Defered functions are called LIFO
     * 
     * @param fn Function to be executed after the flow end
     */
    defer(fn: Function): void;

    /**
     * From last to first, call the defered functions
     * 
     * @remarks
     * Defered functions are called LIFO
     * 
     * @returns Promise that will be resolved after all the defer stack is executed and empty
     */
    runDefer(): Promise<any>;
}
