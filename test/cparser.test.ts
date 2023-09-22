import {Alphabet, Char, Digit, Literal, Space} from "../src/parser/basic";
import {AlphabetToken, CharToken, DigitToken, LiteralToken, SpaceToken} from "@MLambda/parser/token";
import {Any, Parser, Error, Result, Lexer} from "../src/parser/abstract";
import {isMatching} from "ts-pattern"
import {Identifier} from "../src/parser/language/generic";

const  check = (result: Result,  expected: any) :void => {
    let match = isMatching(expected);
    expect(match(result)).toBe(true)
}


describe("parser", ()=> {

    it("char should parser the char", () => {
        const parse = Char("a");
        check(parse("abc"), {kind: CharToken.key, rest: "bc", value: "a"});
        check(parse("bbc"), {kind: 'error', error: 'not found'});
    })

    it("either should be true when some parser are true", () => {
        const aOrb = Any(Char('a'), Char("b"));
        check(aOrb("aa"), {kind: CharToken.key, value: "a", rest: "a"});
        check(aOrb("ba"), {kind: CharToken.key, value: "b", rest: "a"});
        check(aOrb("cb"), {kind: "error", error: 'not found'});
    })

    it("literal should be tested", () => {
        let parse = Literal("let");
        check(parse("let x = 20"), {kind: LiteralToken.key, value: 'let', rest: ' x = 20'});
        check(parse("zet x = 20"), {kind: 'error', error: 'not found'});
    })

    it("digit token should be parse", () => {
        let parse = Digit();
        check(parse("1234 aaa"), {kind: DigitToken.key, value: '1234', rest: ' aaa'});
        check(parse("3.14 aaa"), {kind: DigitToken.key, value: '3', rest: '.14 aaa'});
        check(parse(".3.14 aaa"), {kind: 'error', error: "not found", rest: '.3.14 aaa'});
    })

    it("white space should be parse", () => {
        let parse = Space();
        check(parse("    1234 aaa"), {kind: SpaceToken.key, value: '', rest: '1234 aaa'});
        check(parse("  3.14 aaa"), {kind: SpaceToken.key, value: '', rest: '3.14 aaa'});
        check(parse(".3.14 aaa"), {  rest: '.3.14 aaa'});
    })

    it("alphabet should be parse", () => {
        let parse = Alphabet();
        check(parse("aaa"), {kind: AlphabetToken.key, value: 'aaa', rest: ''});
        check(parse("aaa  "), {kind: AlphabetToken.key, value: 'aaa', rest: '  '});
        check(parse("AA"), {kind:AlphabetToken.key, value:'AA',  rest: ''});
        check(parse("AsZs"), {kind:AlphabetToken.key,  value:"AsZs", rest: ''});
        check(parse("3.14 aaa"), {kind: "error", rest: '3.14 aaa'});
        check(parse(" a"), {kind: "error", rest: ' a'});
    })

    it("lexer should be generated", () => {
        let parse = Lexer(Space(), Literal("let"), Alphabet(), Digit() );
        let x = parse("let some 2");
        console.log(x)
    })

})