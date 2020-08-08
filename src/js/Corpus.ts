export class Corpus {
    static EMPTY: Corpus = {
        c_id: 0,
        name: "",
        description: ""
    };

    c_id: number;
    name: string;
    description: string;
}