import { CQuestion } from "./CQuestion";


export class CMultipleChoiceQuestion extends CQuestion{
    choices;
    #correctChoice;

    constructor(question, answer, choices){
        this.SetQuestion(question);
        this.SetAnswer(answer);

        //check if choices is an object(which includes array)
        if(typeof choices != "object")
        {
            //if not throw an error
            throw new Error("Cannot input choices as a non array");
        }

        this.#correctChoice = new Array;
        for(let i = 0; i < choices.length; ++i)
        {
            //check if choices is an array of strings
            if(typeof choices[i] != "string")
            {
                //if not throw an error
                throw new Error("choices cannot contain non string");
            }

            //check if answer is in choices
            if(answer === choices[i])
            {
                this.#correctChoice.push(choices[i]);
            }
        }

        //if answer is not in choices
        if(this.#correctChoice.length == 0)
        {
            //throw an error
            throw new Error("answer is not in list of choices");
        }

        this.choices = [...choices];
    }

    CheckWithCorrectChoice(input){
        for(let i = 0; i < this.#correctChoice.length; ++i)
        {
            if(input == this.#correctChoice[i])
            {
                return true;
            }
        }
        return false;
    }
}