import {match } from "ts-pattern";
import {All, Any, Atom, Parser, Kleene, NotFound, Result, Token} from "@MLambda/parser/abstract";
import {Alphabet, Char, Digit, End, Space, WithSpaces} from "@MLambda/parser/basic";
import {DigitToken} from "@MLambda/parser/token";

export const DigitPlus = (): Parser =>
{
    return str => {
        const parse = WithSpaces(Digit());
        return match(parse(str))
            .with({kind: "error"}, r => r)
            .otherwise(t => new DigitToken(t as Token))
    }
}

export class DotToken extends Token {
    static readonly key: string = "dot"
    constructor(token: Token) {
        super(DotToken.key, token);
    }
}
export const Dot = (): Parser => str => new DotToken(Kleene(1, Char('.'))(str) as Token);

export class FloatToken extends Token {
    static readonly key: string = "float"
    constructor(token: Token) {
        super(FloatToken.key, token);
    }
}
export const Float = (): Parser => {
    return str => {
        const parse =  WithSpaces(All(Digit(), Dot(), Digit()));
        return match(parse(str))
            .with({kind: "error"}, r => r)
            .otherwise(t => new FloatToken(t as Token))
    }
}

export class NumberToken extends Token {
    static readonly key: string = "number"
    constructor(token: Token ) {
        super(NumberToken.key, token);
    }
}
export const Number  = (): Parser =>
    (str: string): Result => {
        const parser =  Any(Float(), DigitPlus())
        return match(parser(str))
            .with({kind: FloatToken.key}, t => new NumberToken(t as Token))
            .with({kind: DigitToken.key}, t => new NumberToken(t as Token))
            .otherwise(() => new NotFound(str))
    }

export class IdentifierToken extends Token {
    static readonly key: string = "identifier"
    constructor(token: Token) {
        super(IdentifierToken.key, token);
    }
}
export const Identifier = (): Parser =>
    (str: string): Result => {
        const parser =  WithSpaces(Alphabet())
        return match(parser(str))
            .with({kind: "error"}, r => r)
            .otherwise(t => new IdentifierToken(t as Token))
    }

export class RightParenthesesToken extends Token {
    static readonly key: string = "right_parentheses"
    constructor(token: Token) {
        super(RightParenthesesToken.key, token);
    }
}
export class LeftParenthesesToken extends Token {
    static readonly key: string = "right_parentheses"
    constructor(token: Token) {
        super(RightParenthesesToken.key, token);
    }
}
export const LParentheses = (): Parser =>
     (str: string): Result => {
        const parser = WithSpaces(Char("("))
        return match(parser(str))
            .with({kind: "error"}, r => r)
            .otherwise( t => new RightParenthesesToken(t as Token))
    }

export const RParentheses = (): Parser =>
     (str: string): Result => {
        const parser = WithSpaces(Char(")"))
        return match(parser(str))
            .with({kind: "error"}, r => r)
            .otherwise(t => new LeftParenthesesToken(t as Token))
    }

export class PlusToken extends Token {
    static readonly key: string = "plus"
    constructor(token: Token) {
        super(PlusToken.key, token);
    }
}
export class SubtractToken extends Token {
    static readonly key: string = "subtract"
    constructor(token: Token) {
        super(SubtractToken.key, token);
    }
}
export class TimesToken extends Token {
    static readonly key: string = "Times"
    constructor(token: Token) {
        super(TimesToken.key, token);
    }
}
export class DivisionToken extends Token {
    static readonly key: string = "division"
    constructor(token: Token) {
        super(DivisionToken.key, token);
    }
}
export class ExponentialToken extends Token {
    static readonly key: string = "Exponential"
    constructor(token: Token) {
        super(ExponentialToken.key, token);
    }
}
export const Operator = (): Parser => {
    let operators = "+-*/^".split("").map(Char)
    return str => {
        const parser = WithSpaces(...operators)
        return match(parser(str))
            .with({kind: "error"}, r => r)
            .with({kind: "+"}, t => new PlusToken(t as Token))
            .with({kind: "-"}, t => new SubtractToken(t as Token))
            .with({kind: "*"}, t => new TimesToken(t as Token))
            .with({kind: "/"}, t => new DivisionToken(t as Token))
            .with({kind: "^"}, t => new ExponentialToken(t as Token))
            .otherwise(t => new NotFound((t as Token).rest))
    }
}