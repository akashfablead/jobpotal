export const filterJobs = (jobs, query) => {
    if (!query || !query.type) return jobs;

    return jobs.filter(job => {
        switch (query.type) {
            case 'salary':
                return job.salary >= query.min && job.salary <= query.max;
            case 'location':
                return job.location === query.value;
            case 'industry':
                return job.industry === query.value;
            default:
                return true;
        }
    });
};