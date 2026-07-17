import{test,expect, Locator} from "@playwright/test";
test("Multi select dropdown", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    //1) select option from the dropdown(4 ways)
    //await page.locator("#colors").selectOption(['Red','Blue', 'Green']); //using visible text
    //await page.locator("#colors").selectOption(['red','blue', 'white']); //using value
    //await page.locator("#colors").selectOption([{label:'Red'},{label:'Blue'}, {label:'Yellow'}]); //using label
    //await page.locator("#colors").selectOption([{index:0},{index:2}, {index:4}]);

    //2) check number of options in the dropdown(count)
    const dropdownoptions:Locator=page.locator("#colors option");
        await expect(dropdownoptions).toHaveCount(7);
    

    //3) check the options present in the dropdown
    const optionstext:string[] =(await dropdownoptions.allTextContents()).map(text=>text.trim());
    console.log(optionstext);
    expect(optionstext).toContain('Green');
  
    for(const option of optionstext)
    {
        console.log(option);
    }


    await page.waitForTimeout(5000);
    })