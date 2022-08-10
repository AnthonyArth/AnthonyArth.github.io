export class CQuestion{
    #question;
    #answer;

    constructor(question, answer){
        //throw an error as we want this class to be abstract
        throw new Error("You cannot create an instance of Abstract class");  
    }

    GetQuestion(){
        return this.#question;
    }

    SetQuestion(question){
        //check if input is a string
        if(typeof question != "string")
        {
            throw new Error("You cannot input question as a non string");  
        }
        this.#question = question;
    }

    GetAnswer(){
        return this.#answer;
    }

    SetAnswer(answer){
        //check if input is a string
        if(typeof question != "string")
        {
            throw new Error("You cannot input answer as a non string");  
        }
        this.#answer = answer;
    }
}