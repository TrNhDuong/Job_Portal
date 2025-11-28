import { JobRepository } from "../../repository/jobRepository.js";
import { ApplicationRepository } from "../../repository/applicationRepository.js";

export const getAllApplicantsOfJob = async (req, res) => {
    const jobId = req.query.jobId;
    try {
        const job = await JobRepository.getJobPost(jobId);
        if (!job.success){
            return res.status(404).json({
                success: false,
                message: 'Job post not found'
            })
        }
        const applicationIdList = job.data.applicants;
        let applicationList = []
        for (const applicationId of applicationIdList){
            const applicationResult = await ApplicationRepository.getApplication(applicationId);
            if (applicationResult.success){
                applicationList.push(applicationResult.data);
            }
        }
        return res.status(200).json({
            success: true,
            data: applicationList
        })
    } catch ( err ){
        res.status(500).json({
            success: false,
            message: ``
        })
    }
}