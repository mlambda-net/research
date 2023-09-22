import {Token} from "@MLambda/parser/abstract";

export class EndToken extends Token {
    public static readonly key: string = "eof"
    constructor() {
        super(EndToken.key, "");
    }
}

export class CharToken extends Token {
    public static readonly key: string = "char"
    constructor(value: string, rest: string) {
        super(CharToken.key, value, rest);
    }
}

export class AlphabetToken extends Token {
    public static readonly key: string = "aleph_bet"
    constructor(token: Token) {
        super(AlphabetToken.key, token);
    }
}

export class LiteralToken extends Token {
    public static readonly key: string = "literal"
    constructor(token: Token) {
        super(LiteralToken.key, token);
    }
}

export class DigitToken extends Token {
    public static readonly key: string = "digit"
    constructor(token: Token) {
        super(DigitToken.key, token);
    }
}

export class SpaceToken extends Token {
    public static readonly key: string = "white_space"
    constructor(token: Token) {
        super(SpaceToken.key, token);
    }
}