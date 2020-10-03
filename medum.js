const puppeteer = require('puppeteer');
(async () => {
  let resultObj = {}
  let returnedResponse;
  let browser
    try {
        browser = await puppeteer.launch({
            headless:false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--disable-features=site-per-process',
                '--window-position=0,0',
                '--disable-extensions',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X   10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0    Safari/537.36"'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 800 });
        await page.goto('https://www.amazon.in/s?k=keyboard&tag=amdot-21&ref=nb_sb_noss',{waitUntil: 'load', timeout: 30000});
        await page.waitForSelector('#search > div.s-desktop-width-max')
        
        returnedResponse = await page.evaluate(()=>{
            let elementArray = [];
            let dataArray = [];
            if(document.querySelectorAll('#search > div.s-desktop-width-max.s-desktop-content.sg-row > div.sg-col-20-of-24.sg-col-28-of-32.sg-col-16-of-20.sg-col.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div').length > 0){
                let xyz = document.querySelectorAll('#search > div.s-desktop-width-max.s-desktop-content.sg-row> div.sg-col-20-of-24.sg-col-28-of-32.sg-col-16-of-20.sg-col.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28> div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div')
                for(let divI = 3; divI<xyz.length-4;divI++){
                    elementArray.push(xyz[divI])
                }
                let promise = new Promise((resolve,reject) =>{
                    setTimeout(()=>{
                        for(let text = 0; text < elementArray.length; text++){
                            dataArray.push({
                                "ProductName":elementArray[text].querySelector('div > span > div > div > div  h2 > a > span').innerText,
                                "productURL": elementArray[text].querySelector('div > span > div > div > div  h2 > a ').href,
                                "productImg" : elementArray[text].querySelector('div > span > div > div  span > a > div > img ').src,
                                "price": elementArray[text].querySelector('div > span > div > div span.a-price-whole')?elementArray[text].querySelector('div > span > div > div span.a-price-whole').innerText.trim().replace(/\,/,""):'0',
                                "strike": elementArray[text].querySelector('div > span > div > div span.a-price.a-text-price .a-offscreen')?elementArray[text].querySelector('div > span > div > div span.a-price.a-text-price .a-offscreen').innerText.trim().substr(1,9).replace(/\,/,""):'0',
                                "rating": elementArray[text].querySelector('div > span > div > div a > i ')?elementArray[text].querySelector('div > span > div > div a > i').innerText:"",
                                "offer" :elementArray[text].querySelector('div > span > div > div > div.a-section.a-spacing-micro.s-grid-status-badge-container > a .a-badge .a-badge-text')?elementArray[text].querySelector('div > span > div > div > div.a-section.a-spacing-micro.s-grid-status-badge-container > a .a-badge .a-badge-text').innerText:''
                        })
                            resolve(dataArray)
                        }
                    },4000)
                })
                return promise;
            }else if(document.querySelectorAll('#search > div.s-desktop-width-max.s-opposite-dir > div > div.sg-col-20-of-24.s-matching-dir.sg-col-28-of-32.sg-col-16-of-20.sg-col.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div').length > 0){
                let xyz = document.querySelectorAll('#search > div.s-desktop-width-max.s-opposite-dir > div > div.sg-col-20-of-24.s-matching-dir.sg-col-28-of-32.sg-col-16-of-20.sg-col.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div')
                for(let divI = 2; divI<xyz.length-4;divI++){
                    elementArray.push(xyz[divI])
                }
                let promise = new Promise((resolve,reject) =>{
                    setTimeout(()=>{
                        for(let text = 0; text < elementArray.length; text++){
                            dataArray.push({
                                "ProductName":elementArray[text].querySelector('div > span > div > div > div  h2 > a > span').innerText,
                                "productURL": elementArray[text].querySelector('div > span > div > div > div  h2 > a ').href+'&tag=amdot-21&language=en_IN',
                                "productImg" : elementArray[text].querySelector('div > span > div > div  span > a > div > img ').src,
                                "price": elementArray[text].querySelector('div > span > div > div span.a-price-whole')?elementArray[text].querySelector('div > span > div > div span.a-price-whole').innerText.trim().replace(/\,/,""):'0',
                                "strike": elementArray[text].querySelector('div > span > div > div span.a-price.a-text-price .a-offscreen')?elementArray[text].querySelector('div > span > div > div span.a-price.a-text-price .a-offscreen').innerText.trim().replace(/\,/,"").substr(1,9):'0',
                                "rating": elementArray[text].querySelector('div > span > div > div a > i ')?elementArray[text].querySelector('div > span > div > div a > i').innerText:"",
                                "offer" :elementArray[text].querySelector('div.a-section div.a-section span')?elementArray[text].querySelector('div.a-section div.a-section span').innerText:''
                            })
                            resolve(dataArray)
                        }
                    },4000)
                })
                return promise;
            }
        })
        resultObj.product = returnedResponse
        console.log(resultObj.product)
        await browser.close();
    }
    catch(e){
      console.log('Amazon scrap error-> ',e);
      await browser.close();   
    }
})();