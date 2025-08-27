import { JobEntity } from './db/JobEntity';

export class Job {
  public id!: string;
  public positionName!: string;
  public companyName!: string;
  public techStack!: string[];
  public salary!: number;
  public location!: string;

  public static fromEntity(entity: JobEntity): Job {
    const job = new Job();
    job.id = entity.id;
    job.positionName = entity.position_name;
    job.companyName = entity.company_name;
    job.techStack = entity.tech_stack.split(',').map(tech => tech.trim());
    job.salary = entity.salary;
    job.location = entity.location;
    return job;
  }
}