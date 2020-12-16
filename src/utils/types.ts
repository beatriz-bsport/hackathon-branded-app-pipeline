export type MaterialStyle<S> = {
    classes: Record<keyof S, string>
}

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
