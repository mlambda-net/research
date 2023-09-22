
export interface Exception {
    toString(): string;
}

export interface Disposable  {
    Dispose(): void;
}

export interface Observable<T> {
    subscribe(observer: Observer<T>): Disposable
}

export interface Observer<T> {
    onNext(value: T): void;
    onComplete(): void
    onFail(e: Exception): void
}

class lambda_disposable implements Disposable {
    private readonly _dispose: () => void;

    constructor(dispose: ()=> void) {
        this._dispose = dispose
    }

    Dispose() {
        this._dispose()
    }

}

export class Subject<T> implements  Observable<T> {
    private readonly _observers: Observer<T>[] ;

    constructor() {
        this._observers = [];
    }
    subscribe(observer: Observer<T>): Disposable {
        this._observers.push(observer);
        return new lambda_disposable(() => delete this._observers[this._observers.findIndex(c=> c == observer)])
    }

    public next(value: T): void {
        this._observers.forEach(o => o.onNext(value))
    }

    public complete(): void {
        this._observers.forEach(o =>  o.onComplete())
    }
    public fail(e: Exception) {
        this._observers.forEach(o => o.onFail(e))
    }
}

export class ReplyObserver<T> extends Subject<T> {

    private readonly  _buffer: T[];
    constructor() {
        super();
        this._buffer = []
    }

    subscribe(observer: Observer<T>): Disposable {
        this._buffer.forEach(observer.onNext)
        return super.subscribe(observer)
    }

    public next(value: T): void {
        this._buffer.push(value)
        super.next(value)
    }
}
