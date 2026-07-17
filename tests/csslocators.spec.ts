/*
CSS(cascading style sheets)
html+js+css

2types of css locators:
1. absolute css locator
2. relative css locators

tag with id   tag#id(tag is optional) #id
tag with class tag.class (tag is optional) .class
tag with any other attribute tag[attribute=value] (tag is optional) [attribute=value]
tag with class and attribute tag.class[attribute=value] (tag is optional) .class[attribute=value]

page.locator(css/xpath)
*/

import{test, expect, Locator} from "@playwright/test"
test("Verify CSS Locator", async({page})=> {
    await page.goto("https://demowebshop.tricentis.com/");
    
    
    
 //tag#id
    
    const searchbox:Locator=page.locator("input#small-searchterms");
    await expect (searchbox).toBeVisible();
    await searchbox.fill("T-shirts");


//tag with class tag.class (tag is optional) .class
    
    const searchelement:Locator= page.locator("input.search-box-button");
    await expect(searchelement).toBeVisible();
    await searchelement.click();


 //tag[attriute]
    
    const searchattri:Locator= page.locator("input[name=q]");
    await searchattri.fill("T-shirt");
    
//tag.class[attribute=value]
   await page.locator(".search-box-text[value='Search store']").fill("T-shirt");
await page.waitForTimeout(5000);

})
