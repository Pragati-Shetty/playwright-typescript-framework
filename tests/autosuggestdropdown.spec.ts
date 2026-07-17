import{test,expect,Locator} from "@playwright/test"
test("Autosuggest dropdown", async({page})=>{
    await page.goto("https://www.flipkart.com/");
    await page.locator("input[name='q']").fill("smart");//search text
    await page.waitForTimeout(5000);
    //Get all the suggested options-->Ctrl+shift+p-->emulate focused page
    const options:Locator=page.locator("ul>li");
    const count= await options.count();
    console.log("number of suggested options:",count); //8 but not fixed might change anytime
    
    //printing all the suggested options in the console
    console.log("5th option:",options.nth(5).innerText());
    console.log("Printing all the autosuggestions.....");
    for(let i=0;i<count;i++)
    {
       console.log(await options.nth(i).innerText());
       console.log(await options.nth(i).textContent());
    }
    //select/click on the smartphone option
     for(let i=0;i<count;i++)
    {
       const text =await options.nth(i).innerText();
       if(text==='smartphone')
       {
        options.nth(i).click();
        break;
       }
    }
})