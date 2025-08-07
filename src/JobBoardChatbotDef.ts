import { Log } from './Log';
import { CompanyEntity, DB, JobEntity } from './db';
import { ChatbotDef } from './ChatbotDef';
import { ChatbotUI } from './ChatbotUI';
import { Company } from './Company';
import { Job } from './Job';
import { OpenAiTool } from './OpenAIClient';
import { Match } from './Match';

export class JobBoardChatbotDef implements ChatbotDef {
  private companies: Company[] = [];
  private jobs: Job[] = [];

  public constructor() {``
    this.loadData();
  }

  private loadData(): void {
    this.companies =
      DB.loadJson<CompanyEntity>('db/companies.json')
      .map(Company.fromEntity);
    this.jobs =
      DB.loadJson<JobEntity>('db/jobs.json')
      .map(Job.fromEntity);
  }

  private listCompaniesTool(): OpenAiTool {
    type ListCompaniesArgs = {
      name?: string;
      location?: string;
      techStack?: string;
    };

    return {
      type: 'function',
      function: {
        name: 'list_companies',
        description: 'List companies with optional filters',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the company',
            },
            location: {
              type: 'string',
              description: 'The location of the company',
            },
            techStack: {
              type: 'string',
              description: 'The tech stack of the company, comma-separated list of technologies',
            },
          },
        },
      },
      func: async (args: ListCompaniesArgs): Promise<Company[]> => {
        Log.info(`[tool:list_companies] args: ${JSON.stringify(args)}`);
        const matchingCompanies = this.companies.filter(company => {
          return (
            Match.matchStrings(company.name, args.name) &&
            Match.matchStrings(company.location, args.location) &&
            Match.matchArrayWithStringArray(company.techStack, args.techStack)
          );
        });

        ChatbotUI.writeAssistantTable(
          ['Company', 'Location', 'Technologies'],
          matchingCompanies.map(company => [
            company.name,
            company.location,
            company.techStack.join(', '),
          ]),
        );
        return matchingCompanies;
      },
    }
  }

  private listJobsTool(): OpenAiTool {
    type ListJobsArgs = {
      companyName?: string;
      positionName?: string;
      location?: string;
      techStack?: string;
      minSalary?: number;
      maxSalary?: number;
    };

    return {
      type: 'function',
      function: {
        name: 'list_jobs',
        description: 'List jobs with optional filters',
        parameters: {
          type: 'object',
          properties: {
            companyName: {
              type: 'string',
              description: 'The name of the company',
            },
            positionName: {
              type: 'string',
              description: 'The position name of the job',
            },
            location: {
              type: 'string',
              description: 'The location of the job',
            },
            techStack: {
              type: 'string',
              description: 'The tech stack of the job, comma-separated list of technologies',
            },
            minSalary: {
              type: 'number',
              description: 'The minimum salary of the job',
            },
            maxSalary: {
              type: 'number',
              description: 'The maximum salary of the job',
            },
          },
        },
      },
      func: async (args: ListJobsArgs): Promise<Job[]> => {
        Log.info(`[tool:list_jobs] args: ${JSON.stringify(args)}`);
        const matchingJobs = this.jobs.filter(job => {
          return (
            Match.matchStrings(job.companyName, args.companyName) &&
            Match.matchArrayWithStringArray(job.techStack, args.techStack) &&
            Match.matchStrings(job.positionName, args.positionName) &&
            Match.matchStrings(job.location, args.location) &&
            Match.matchRange(job.salary, args.minSalary, args.maxSalary)
          );
        });

        ChatbotUI.writeAssistantTable(
          ['Company', 'Position', 'Technologies', 'Salary', 'Location'],
          matchingJobs.map(job => [
            job.companyName,
            job.positionName,
            job.techStack.join(', '),
            job.salary,
            job.location,
          ]),
        );
        return matchingJobs;
      },
    }
  }

  public getSystemPrompt(): string {
    return `
      You are a helpful assistant that can help with job searching. Strcitly follow the rules:
      - You can list companies.
      - Use the tool "list_companies" to list companies.
      - NEVER return companies in the response.
      - NEVER include companies in the response.
      - If the "list_companies" tool returns no results, you should say that you cannot find any companies.
      - You can list jobs.
      - Use the tool "list_jobs" to list jobs.
      - NEVER return jobs in the response.
      - NEVER include jobs in the response.
      - If the "list_jobs" tool returns no results, you should say that you cannot find any jobs.
      - You can reply only with answers related to the companies and jobs.
      - If the user asks about things not related to companies and jobs, politely decline and say you can only help with companies and jobs.
      - If the user enters a shortcut name of a US city. Replace it with the full name of the city. For example, user enters "SF", you should replace it with "San Francisco" or "NYC" or "NY", you should replace it with "New York City".
      - If the user wants to clear the filters, you should clear the filters and list the jobs again. Phrases such as "Clear filters", "Remove filters", "Let's start over", "Start over", "Reset filters", "Reset" should be interpreted as clearing the filters.
    `;
  }

  public getOpenAITools(): OpenAiTool[] {
    return [
      this.listCompaniesTool(),
      this.listJobsTool(),
    ];
  }
}