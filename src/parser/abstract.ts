import {match, P} from 'ts-pattern';



export interface Result {
    get kind(): string
    get value(): string
    get raw(): string
    bind(m: (r: Result) => Result): Result
}

export abstract class Ast implements Result {
    private readonly _kind: string;

    protected constructor(kind: string) {
        this._kind = kind;
    }

    bind(m: (r: Result) => Result): Result {
        return m(this);
    }

    get kind(): string {
        return this._kind;
    }

    abstract get value(): string;

    get raw(): string {
        return this.value
    }

}

export abstract class Token implements Result {

    private readonly _inner: string | Token | Token[];
    private readonly _rest: string;
    private readonly _kind: string;

    protected constructor(kind: string, inner: string | Token | Token[], rest?: string) {
        this._kind = kind;
        this._inner = inner;
        this._rest = (inner as Token)?.rest ?? rest ?? "";
    }

    get value(): string {
        return this.raw.trim()
    }

    get raw(): string {
        return (match(this._inner)
            .with(P.string, s => s)
            .with(P.array(), t => (t as Token[]).map(i => i.raw).join(""))
            .otherwise(t => (t as Token).raw));
    }

    get rest(): string {
        return this._rest
    }

    get inner() {
        return this._inner
    }

    bind(m: (r: Result) => Result): Result {
        return m(this)
    }

    get kind(): string {
        return this._kind;
    }
}

export abstract class Error implements Result {
    private readonly _error: string;
    private readonly _rest: string;

    protected constructor(err: string, rest: string) {
        this._rest = rest;
        this._error = err;
    }

    bind(_: (r: Result) => Result): Result {
        return this
    }

    get rest(): string {
        return this._rest
    }
    get error(): string {
        return this._error;
    }

    get kind(): string {
        return "error";
    }

    get value(): string {
        return this._error;
    }

    get raw(): string {
        return this.value
    }
}

export class Tokens extends Token {

    constructor(results?: Result[], rest?: string) {
        super("tokens", results?.map(r => r as Token) ?? [], rest)

    }

    add(t: Token) {

    }

    bind(m: (r: Result) => Result): Result {
        return m(this)
    }
}

export class Atom extends  Ast{
    private readonly _token: Token
    constructor(name: string, token: Token) {
        super(name);
        this._token = token;
    }

    get token(): Token {
        return this._token
    }

    get value(): string {
        return this._token.value;
    }
}

export class NotFound extends Error {
    constructor(rest: string) {
        super("not found", rest);
    }
}

export type Parser = (str: string) => Result;

export const Any = (...c: Parser[]): Parser => {
    return (str: string): Result => {
        let backtracking = (...ps: Parser[]): Result => {
            if (ps.length == 0) {
                return new NotFound(str)
            }
            let [ph, ...pt] = ps;
            return match(ph(str))
                .with({kind: "error"}, _ => backtracking(...pt))
                .otherwise(t => t)
        }

        return backtracking(...c)
    }
}

export const All = (...c: Parser[]): Parser => {
    let tokens: Token[] = []
    let value = ""
    const fix_point = (...c: Parser[]): Parser => {
        let [ch, ...ct] = c;
        if (ch != null) {
            return (str: string): Result =>
                match(ch(str))
                    .with({kind: "error"}, t => t)
                    .with({kind: "eof"}, _ => new Tokens( tokens, ""))
                    .otherwise(t => {
                        const token = t as Token
                        value += token.value
                        tokens.push(token)
                        return fix_point(...ct)(token.rest)
                    })
        }
        return rest => new Tokens( tokens, rest)
    }

    return fix_point(...c)
}

export const Kleene = (k: number | string, ...c: Parser[]): Parser => {
    let k_factor = match(k).with("*", _ => -1).otherwise(i => Number(i))

    let tokens: Token[] = []
    const fix_point = (n: number, str: string): Result => {
        if (k_factor == -1 || n < k_factor) {
            return match(Any(...c)(str))
                .with({kind: "error"}, _ => new Tokens( tokens, str))
                .with({kind: "eof"}, _ => new Tokens(tokens, ""))
                .otherwise(t => {
                    let token = t as Token
                    tokens.push(token)
                    return fix_point(n + 1, token.rest)
                })
        }
        return new Tokens(tokens, str)
    }
    return (str: string) => fix_point(0, str)
}


export const Lexer = (...c: Parser[]): Parser => Kleene("*", Any(...c))

/*
export class Lexical {
    private _subject: ReplyObserver<Token>;
    private _parser: parser;

    constructor(...cs: parser[]) {
        this._subject = new ReplyObserver()
        this._parser = Kleene("*", ...cs);
    }

    parser(str: string): void {
        match(this._parser(str))
            .with({kind: "error"}, e => this._subject.fail(e as Error))
            .with({kind: "eof"}, _ => this._subject.complete())
            .otherwise(t => this._subject.next(t as Token))
    }
}

export type LexicalType = Token | Token[] | Error;

export type Lexer = (str: string) => LexicalType;





const Parser = (...cs: parser[]):Lexer  => {

    let backtraking = (str: string, ...rs: parser[]): LexicalType => {
        if (str == "") {
            return new EndToken()
        }

        let [ch, ...ct] = rs

        return match(ch(str))
            .with({kind: "error"}, _ => backtraking(str, ...ct))
            .with({kind: "eof"}, _ => [])
            .otherwise(t => {
                let token = t as Token
                match(backtraking(token.rest, ...cs))
                    .with({kind: "error"}, t => t)
                    .with({kind: "eof"}, () => [])
                    .otherwise(ts => [t, ...ts as Token[]])
            })

    }

    return str => backtraking(str, ...cs)
}



*/

