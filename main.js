#!/usr/bin/env node

const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const prompts = require("prompts");

//ask about email and password
const response = (async function(){
    const questions = [
        {
            type: 'text',
            name: 'email',
            message: 'Enter your email'
        },
        {
            type: 'password',
            name: 'secret',
            message: 'Tell me a secret'
        },
        
    ];

    const answers = await prompts(questions);
    //setTimeout(() => { return answers; }, 20000);
    //console.log(answers);
    return "test";//Object.assign({}, answers);
})();

async function main(response) {
  const { EXTRACT_URL, FIRSTNAME: firstname, LASTNAME: lastname, DEBUG } = process.env;
  const headless = typeof DEBUG === "undefined" || DEBUG == false;
  const outputs = ["01-page.png", "02-page.png", "03-page.png"];
  const screenshots = [...outputs];
  
  console.log(response);
  // create temporary email - add todays date
  //const add = new Date().toJSON().slice(0,10).replace(/-/g,'');
  const email = "test@mail.ru"; //response.email;
  //var pos = email.indexOf("@");
  const tempemail = email; //.slice(0, pos) + "+" + add + email.slice(pos);
  const password = "12345678"; //response.secret;

  // open browser
  const browser = await puppeteer.launch({ headless });

  // open page
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(EXTRACT_URL);

  // enter query string
  await page.type("#signupFormStep1 > div:nth-child(1) > input", tempemail);
  await page.type("div.flex:nth-child(2) > input:nth-child(1)", password);
  await page.screenshot({ path: screenshots.shift() });

  // do the query
  await page.click(".btn-primary");

  // enter query string
  await page.type("div.bs-solid:nth-child(1) > input:nth-child(1)", firstname);
  await page.type(".ml-2 > input:nth-child(1)", lastname);
  await page.select(".appearance-0", "Developer"); //Job title
  await page.screenshot({ path: screenshots.shift() });

  // do the query
  //await page.click(".btn-primary");
  await page.screenshot({ path: screenshots.shift() });

  // cleanup & steps screenshots
  browser.close();
  console.log(chalk.blue("\nSee screenshots: "), outputs);
}

// load .env variables, console.log(process.env);
const envConfigurationResult = dotenv.config();
if (envConfigurationResult.error) throw envConfigurationResult.error;

// ask about email and password
//const response = getParameters();

main(response);
