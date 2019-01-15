import { IContext } from "./interfaces";

export default class Context implements IContext {

    private map: Map<string, any> = new Map();
    private deferStack = [];

    public get(key: string): any | undefined {
        return this.map.get(key);
    }

    public set(key: string, value: any): IContext {
        this.map.set(key, value);
        return this;
    }

    public delete(key: string): boolean {
        return this.map.delete(key);
    }

    public defer(fn: Function): void {
        this.deferStack.push(fn);
    }

    public async runDefer(): Promise<any> {
        while (this.deferStack.length !== 0) {
            await this.deferStack.pop()();
        }
    }
}