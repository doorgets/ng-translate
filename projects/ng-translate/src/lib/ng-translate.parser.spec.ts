import { DoorgetsParser } from './ng-translate.parser';


describe('DoorgetsParser', () => {
    let parser: DoorgetsParser;

    beforeEach(() => {
        parser = new DoorgetsParser();
    });

    it('should create an instance', () => {
        expect(parser).toBeTruthy();
    });


    // add test with doorgetsparser interpolate
    it('should return the same sentence if the sentence is not a string or a number', () => {
        const sentence = "How are you?";
        expect(parser.interpolate(sentence)).toEqual(sentence);

        const num = "Hello $0, my name is $1, i live in $2";
        expect(
            parser
                .interpolate(num, ['John Doe', "Mounir R'Quiba", "Paris"]))
                .toEqual("Hello John Doe, my name is Mounir R'Quiba, i live in Paris"
        );
    });

    
    // Add more test cases as needed

});