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

jobs.forEach(job => {
  job.salary = Math.round(job.salary / 1000) * 1000;
  job.location = randomLocation();
});

fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2));