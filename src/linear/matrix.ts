/*
interface Maps<T> {

}


class One implements Maps<number> {

}

class  Zero implements Maps<number> {

}

class Fn implements Maps<number> {

}

class  Cos extends  Fn {

}




class Matrix {

}

let rotation = [
    [One, Zero, Zero],
    [Zero, Cos, Mult(-1)  | Sin ],
    [Zero, Sin, Cos]

]


 */


export abstract class Tensor {
    protected readonly value: any;
    protected readonly rank: number;
    protected readonly dimension: number[];

    protected constructor(value: any, rank: number, dimension: number[]) {
        this.value = value;
        this.rank = rank
        this.dimension = dimension;
    }

    Rank(): number {
        return this.rank;
    }

    Dimension(): number[] {
        return this.dimension;
    }

    abstract Addition(other: Tensor): Tensor;

    abstract Product(other: Tensor): Tensor;

}


export class ErrorTensor extends Tensor {

    private error: string

    constructor(error: string) {
        super(0, 0, [0]);
        this.error = error;
    }

    Addition(other: Tensor): Tensor {
        return this;
    }

    Product(other: Tensor): Tensor {
        return this;
    }
}


export class Nullable extends Tensor {

    private static instance = new Nullable()

    private constructor() {
        super(0, 0, [0]);
    }

    static Instance() {
        return this.instance
    }

    Addition(other: Tensor): Tensor {
        return this;
    }

    Product(other: Tensor): Tensor {
        return this;
    }
}

export class Scalar extends Tensor {
    constructor(value: number) {
        super(value, 0, [0]);
    }

    GetValue(): number {
        return this.value;
    }

    Addition(other: Tensor): Tensor {
        switch (other.Rank()) {
            case 0:
                return new Scalar(this.value + (other as Scalar).value)
            default:
                return new ErrorTensor("there is invalid this kind of the operation");
        }
    }

    Product(other: Tensor): Tensor {
        switch (other.Rank()) {
            case 0:
                return new Scalar(this.value * (other as Scalar).value)
            case 1:
                return this.vector_product(other);
            case 2:
                return this.matrix_product(other);
        }

        return Nullable.Instance();
    }

    private matrix_product(other: Tensor) {
        let matrix = other as Matrix;
        let dim = other.Dimension();
        let res: number[][] = [];
        for (let i: number = 0; i < dim[0]; i++) {

            let temp: number[] = []
            for (let j: number = 0; j < dim[1]; j++) {
                temp.push(this.value * matrix.GetValue(i, j))
            }
            res.push(temp)

        }
        return new Matrix(res)
    }

    private vector_product(other: Tensor) {
        let vector = other as Vector;
        let result = []
        for (let i: number = 0; i < vector.Dimension()[0]; i++) {
            result.push(this.value + vector.GetValue(i))
        }
        return new Vector(result);
    }
}

export class Vector extends Tensor {
    constructor(value: number[]) {
        super(value, 1, [value.length])
    }

    GetValue(pos: number): number {
        return this.value[pos];
    }

    Addition(other: Tensor): Tensor {

    }

    Product(other: Tensor): Tensor {
        switch (other.Rank()) {
            case 0:
                return this.scalar_product(other);
            case 1:
                let vector = other as Vector;
                return new Vector(this.vector_product(this.value, vector.value))

        }
        return Nullable.Instance()
    }

    private vector_product(a: number [], b: number[]): number[] {
        let result: number[] = [];
        if (a.length >= b.length) {
            for (let i: number = 0; i < this.dimension[0]; i++) {
                result.push(a[i] * b[i] ?? 1)
            }
            return result
        }
        return this.vector_product(b, a)
    }

    private scalar_product(other: Tensor) {
        let scalar = other as Scalar;
        let vector: number[] = [];
        for (let i: number = 0; i < this.dimension[0]; i++) {
            vector.push(this.value[i] as number * scalar.GetValue())
        }
        return new Vector(vector);
    }
}

export class Matrix extends Tensor {
    constructor(value: number[][]) {
        super(value, 2, [value.length, value[0].length])
    }

    GetValue(i: number, j: number): number {
        return 0;
    }
}


function Sum(a: Tensor, b: Tensor): Tensor {
    return a.Addition(b);
}

function Multiply(a: Tensor, b: Tensor) {

}


export class LinearTransformations {

    RotateX(angle: number): Tensor {
        return new Matrix([
            [1, 0, 0],
            [0, Math.cos(angle), Math.sin(angle) * -1],
            [0, Math.sin(angle), Math.cos(angle)]
        ])
    }

    RotateY(angle: number): Tensor {
        return new Matrix([
            [1, 0, 0],
            [0, Math.cos(angle), Math.sin(angle) * -1],
            [0, Math.sin(angle), Math.cos(angle)]
        ])
    }
}