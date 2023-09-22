import {Ast, Atom, Token, Tokens} from "@MLambda/parser/abstract";
import {match} from "ts-pattern"
import {DigitToken} from "@MLambda/parser/token";
import {
    IdentifierToken,
    LeftParenthesesToken,
    LParentheses,
    RightParenthesesToken, RParentheses
} from "@MLambda/parser/language/generic";



export type GrammarStatus =
    | {ast: Ast, tokens: Token[]}
    | {kind: string }

export type Grammar = (...token: Token[]) => GrammarStatus

export const Any = (...gs: Grammar[]): Grammar => {
    return (...ts: Token[]): GrammarStatus => {
        let backtracking = (...ps: Grammar[]): GrammarStatus => {
            if (ps.length == 0) {
                return new NotFound()
            }

            let [gh, ...gt] = gs;
            return match(gh(...ts))
                .with({kind: "error"}, _ => backtracking(...gt))
                .otherwise(t => t)
        }

        return backtracking(...gs)
    }
}

export const All = (...g: Grammar[]): Grammar => {
        const fix_point = (ts: Token[], ...gs: Grammar[]): GrammarStatus => {
            let [gh, ...gt] = gs;
            let [th, ...tt] = ts
            return match(gh(th))
                .with({kind: "error"}, t => t)
                .otherwise(t => {
                    return fix_point(tt, ...gt)
                })
        }

        return (...ts: Token[]) => fix_point(ts, ...g)
}

export const Kleene = (k:  string, ...g: Grammar[]): Grammar => {
   let k_factor = k == "*" ? -1 : Number(k)
    const fix_point = (n: number, ...ts: Token[]): GrammarStatus => {
        if (k_factor == -1 || n < k_factor) {
            return match(Any(...g)(...ts))
                .with({kind: "error"}, e => e)
                .with({kind: "eof"}, _ => [])
                .otherwise(r => {
                    let ast = r as Ast;
                    return  [ast, ...fix_point(n + 1, ast.rest)]
                })
        }
    }


    return (...ts: Token[]) =>  fix_point( 0, ...ts)
}


export class Expression extends  Ast {
    private _left: Expression;
    private _right: Expression;
    private _value: Token;

    constructor(value: Token, left: Expression, right: Expression) {
        super("expr");
        this._left = left;
        this._right = right;
        this._value = value;
    }
}

type Lexer = ( t: Token) => GrammarStatus;




export const Identifier =  Atom(IdentifierToken.key );
export const Number =  Atom(DigitToken.key);
export const LParent = Compount( LeftParenthesesToken.key,  )
export const RParent = Rule({value: ")"})


export const Expr = (...ts: Token[]): GrammarStatus => {

    let Grammar = Any(
        Atom(Identifier),
        Atom(Number),
        Compound(LParent, Expr, RParent))
    )


    match(Grammar(ts))
        .with({})


}