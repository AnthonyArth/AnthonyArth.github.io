let quizBody = document.querySelector("#quiz-body");

let temp
if(localStorage.length > 0)
{
    let dataArray; //this will contain data from one of the local storage nodes
    let score; //this will contain the score from one of the local storage nodes
    for(let i = 0; i < localStorage.length; ++i)
    {
        //init the dataArray
            dataArray = localStorage.getItem("ans" + i);
            dataArray = dataArray.split(",");

            //create the score-box
            temp = document.createElement("div");
            temp.classList.add("flexbox","flex-row", "score-box")
            quizBody.appendChild(temp);

            //create the score-box-number
            let node = document.createElement("div");
            node.classList.add("score-box-number", "flexbox", "flex-center");
            node.innerHTML = i + 1;
            temp.appendChild(node);

            //calculate score
            score = 0;
            for(let x = 0; x < dataArray.length - 1; ++x)
            {
                score += parseInt(dataArray[x]);
            }

            //create the score-box-content
            node = document.createElement("div");
            node.classList.add("score-box-content");
            node.innerHTML = "Name: " + dataArray[dataArray.length - 1] + " Score: " + score;
            temp.appendChild(node);
    }
}
else
{
    //create the a h1 that says NA
    temp = document.createElement("h1");
    temp.innerHTML = "NA";
    quizBody.appendChild(temp);
}

document.querySelector("#quiz-body .button").addEventListener("click", () => {
    if(localStorage.length > 0)
    {
        let scoreBoxes = quizBody.querySelectorAll(".score-box");

        //delete the scoreBoxes
        for(let i = 0; i < scoreBoxes.length; ++i)
        {
            scoreBoxes[i].parentNode.removeChild(scoreBoxes[i]);
        }
        temp = document.createElement("h1");
        temp.innerHTML = "NA";
        quizBody.appendChild(temp);
        localStorage.clear();
    }
});