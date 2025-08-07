# How to run

Run the following:
```sh
nvm use
npm i
npm run build
node dist/main.js
```

In order to run the environment variable `OPENAI_API_KEY` must be specified.

# Prompts

## Companies

```
Create a mocked list of IT companies. Follow the rules:
1. Create list of around 10 companies.
2. Each company should be defined by name, location in the US, technology stack.
3. As the location pick a big city in the US. Just city, nothing more.
4. Pick between 3 to 5 items as the technology stack from: NestJS, JavaScript, TypeScript, MongoDB, Redis, PostgreSQL, MySQL, AWS, DigitalCloud, Microservices.
5. Respond with JSON. Each company should have fields: name, location, tech_stack. tech_stack is comma-separated.
```

## Jobs

```
Create a list of jobs based on the previously generated companies. Follow the rules:
1. Create a list of 80 jobs.
2. Each job must be defined by position name, salary, technology stack, company name.
3. The company name must one of the genered earlier.
4. The salary is annual and in US dollars.
5. Pick the technology stack from the company technology stack. Don't use all of the entries.
6. Respond with JSON. Each job should have fields: position_name, company_name, tech_stack, salary. tech_stack is comma-separated.
```
