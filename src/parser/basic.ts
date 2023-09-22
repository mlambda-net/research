import {match} from 'ts-pattern';
import {All, Any, Parser, Kleene, NotFound, Result, Token} from "@MLambda/parser/abstract";
import {AlphabetToken, CharToken, DigitToken, EndToken, LiteralToken, SpaceToken} from "@MLambda/parser/token";

export const Char = (c: string): Parser => {
    return (str: string): Result => {
        if(str == "" || typeof str == "undefined") {
            return new EndToken()
        }

        let [sh, ...st] = str
        if (c == sh) {
            return new CharToken(sh, st.join(""))
        }

        return new NotFound(str)
    }
}

export const End = (): Parser =>  (str: string): Result =>  (str == "") ?  new EndToken() : new NotFound(str)

export const Literal = (literal: string): Parser => {
    let chars = literal.split("").map(Char)
    return (str: string): Result =>
        match(All(...chars)(str))
            .with({kind: "error"}, e => e)
            .with({raw: ""}, t => new NotFound((t as Token).rest))
            .otherwise(( t => new LiteralToken( t as Token)))
}

export const Alphabet = (): Parser => {
    let alphabet = [
        [...Array(26)].map((_, i) => String.fromCharCode(i + 97)),
        [...Array(26)].map((_, i) => String.fromCharCode(i + 65))
    ]

    let chars = alphabet.flat().map(Char)
    return (str: string): Result =>
        match(Kleene('*', ...chars)(str))
            .with({kind: "error"}, p => p)
            .with({raw: ""}, t => new NotFound((t as Token).rest))
            .otherwise(t => new AlphabetToken(t as Token))
}

export const Digit = (): Parser => {
    let digits = "0123456789".split('')
    let chars = digits.map(Char)
    return (str: string): Result =>
        match(Kleene('*', ...chars)(str))
            .with({kind: "error"}, e => e)
            .with({raw: ""}, t => new NotFound((t as Token).rest))
            .otherwise(t => new DigitToken(t as Token))
}

export const Space = (): Parser => {
    let char = Char(" ");
    return (str: string): Result =>
        match(Kleene('*', char)(str))
            .with({kind: "error"}, e => e)
            .with({raw: ""}, _ => new NotFound(str))
            .otherwise(t => new SpaceToken( t as Token))
}

export const WithSpaces = (...c: Parser[]): Parser =>
    Any(
        All(Space(), ...c, Any(Space(), End())),
        All(Space(), ...c),
        All(...c, Any(Space(), End())),
        ...c)