import {isMatching} from "ts-pattern"
import {Kleene, Lexer, Result} from "../src/parser/abstract";
import {Expr, Term, TermAst} from "../src/parser/language/math";
import {DigitPlus, LParentheses, Number, Operator, RParentheses} from "../src/parser/language/generic";
import {debug} from "../src/parser/utils";

const  check = (result: Result,  expected: any) :void => {
    let match = isMatching(expected);
    expect(match(result)).toBe(true)
}

describe("ast", ()=> {
    it("term ast should be parser", () => {
        const parser = Term();

        check(parser("100"), {kind: TermAst.key, value: "100"});
        check(parser("100 + 200"), {kind: TermAst.key, value: "100"});
        check(parser("100.2"), {kind: TermAst.key, value: "100.2"});

        check(parser("varx"), {kind: TermAst.key, value: "varx"});
        check(parser("varx   "), {kind: TermAst.key, value: "varx"});
        check(parser(" varx "), {kind: TermAst.key, value: "varx"});

    });

    it("a lexer should parse a set of tokens", () => {
        let parser = Lexer(Term(), Operator(), LParentheses(), RParentheses())

        check(parser("2"), {inner: [{value: "2"}]})
    })

    it("expression ast should be parsed", () => {
        const parser = Kleene('*', Expr())
        let x = parser("2 + 2")
        debug(parser, "2 + 2", "plus")


        //check(parser("2 + 2"), {kind:"expr"})


    });

    it("aaa", () => {
        debug(DigitPlus(), "100  +2", "aa")
    })

})

