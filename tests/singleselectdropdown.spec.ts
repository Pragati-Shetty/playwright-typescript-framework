import{test,expect, Locator} from "@playwright/test";
test("Single select dropdown", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    //1) select option from the dropdown(4 ways)
     //await page.locator("#country").selectOption('India');//visible text
    //await page.locator("#country").selectOption({value: 'uk'}) //by using value attribute
    //await page.locator("#country").selectOption({label:'India'}); //by using label attribute
    //await page.locator("#country").selectOption({index:1}); //by using index
    
    //2) check number of options in the dropdown(count)
    const dropdownoptions:Locator=page.locator("#country option");
    await expect(dropdownoptions).toHaveCount(10);

    //3) check the options present in the dropdown
    const optionstext:string[] =(await dropdownoptions.allTextContents()).map(text=>text.trim());
    console.log(optionstext);
    expect(optionstext).toContain('Japan');
    for(const option of optionstext)
    {
        console.log(option);
    }

    await page.waitForTimeout(5000);



})