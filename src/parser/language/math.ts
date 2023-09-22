import {match} from "ts-pattern"
import {
    Any,
    Parser,
    Result,
    Token,
    Atom,
    NotFound, All, Lexer, Ast
} from "@MLambda/parser/abstract";

import {
    Number,
    Identifier,
    NumberToken,
    IdentifierToken,
    Operator,
    LParentheses, RParentheses
} from "@MLambda/parser/language/generic";


export class TermAst extends Atom {
    static readonly key: string = "term"
    constructor(token: Token ) {
        super(TermAst.key, token);
    }
}

export const Term = (): Parser =>
    (str: string): Result => {
        const parser = Any(Number(), Identifier())
        return match(parser(str))
            .with({kind: NumberToken.key}, t => new TermAst(t as Token))
            .with({kind: IdentifierToken.key}, t => new TermAst(t as Token))
            .otherwise(() => new NotFound(str))
    }


export class ExpressionToken extends Atom {
    static readonly key: string = "expr"
    constructor(token: Token ) {
        super(TermAst.key, token);
    }
}


export type Grammar = (str: string) => Ast

export const Expr = (): Grammar => {

    let tokens = Lexer(LParentheses(), RParentheses(), Operator(), Term())


    let grammar = Any( )


    (str: string): Ast => {
        const parser = Any(
            All(LParentheses(), Term(), RParentheses()),
            All(Term(), Operator(), Term()),
            Term()
        )

        return match(parser(str))
            .with({kind: "error"}, e => e)

            .otherwise(t => new ExpressionToken(t as Token))
    }

}