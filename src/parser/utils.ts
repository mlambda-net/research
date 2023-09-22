//debug(All(Space(), Alphabet(), Any(Space(), End())), str, "aa")
// debug(parser, str)
export function debug( parser: any, str: string, label?:string) {
    console.debug( `${label}: [${str}]  ->  [${parser(str).value}]`)
}