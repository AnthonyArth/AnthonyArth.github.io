let contentCPU = document.querySelector("#cpu");
let contentGPU = document.querySelector("#gpu");
let contentMotherboard = document.querySelector("#motherboard");
let buttonCPU = document.querySelector("#cpu-nav");
let buttonGPU = document.querySelector("#gpu-nav");
let buttonMotherboard = document.querySelector("#motherboard-nav");

buttonCPU.addEventListener("click", () => {
    if(!(buttonCPU.classList.contains("selected-button")))
    {
        //make the button selected
        buttonCPU.classList.add("selected-button");
        buttonGPU.classList = "button";
        buttonMotherboard.classList = "button";
    }
    //slide the content in
    if(!(contentCPU.classList.contains("slide-in")))
    {
        //make the button selected
        contentCPU.classList.add("slide-in");
        contentGPU.classList.remove("slide-in");
        contentMotherboard.classList.remove("slide-in");
    }
});

buttonGPU.addEventListener("click", () => {
    if(!(buttonGPU.classList.contains("selected-button")))
    {
        //make the button selected
        buttonCPU.classList = "button";
        buttonGPU.classList.add("selected-button");
        buttonMotherboard.classList = "button";
    }
    //slide the content in
    if(!(contentGPU.classList.contains("slide-in")))
    {
        //make the content selected
        contentGPU.classList.add("slide-in");
        contentCPU.classList.remove("slide-in");
        contentMotherboard.classList.remove("slide-in");
    }
});

buttonMotherboard.addEventListener("click", () => {
    if(!(buttonMotherboard.classList.contains("selected-button")))
    {
        //make the button selected
        buttonCPU.classList = "button";
        buttonGPU.classList = "button";
        buttonMotherboard.classList.add("selected-button");
    }
    //slide the content in
    if(!(contentMotherboard.classList.contains("slide-in")))
    {
        //make the content selected
        contentCPU.classList.remove("slide-in");
        contentGPU.classList.remove("slide-in");
        contentMotherboard.classList.add("slide-in");
    }
});