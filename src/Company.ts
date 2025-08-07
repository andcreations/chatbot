import { CompanyEntity } from './db';

export class Company {
  public name!: string;
  public location!: string;
  public techStack!: string[];

  public static fromEntity(entity: CompanyEntity): Company {
    const company = new Company();
    company.name = entity.name;
    company.location = entity.location;
    company.techStack = entity.tech_stack.split(',').map(tech => tech.trim());
    return company;
  }
}