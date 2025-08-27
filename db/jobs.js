const fs = require('fs');

const content = fs.readFileSync('jobs.json', 'utf8');
const jobs = JSON.parse(content);

const locations = [
  'San Francisco',
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Miami',
  'Seattle',
  'Remote',
];
const randomLocation = () => {
  return locations[Math.floor(Math.random() * locations.length)];
};

let idSeq = 1;
const nextId = () => {
  const id = idSeq++;
  return id.toString().padStart(6, '0');
}

jobs.forEach(job => {
  job.id = nextId();
  job.salary = Math.round(job.salary / 1000) * 1000;
  job.location = randomLocation();
});

fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2));