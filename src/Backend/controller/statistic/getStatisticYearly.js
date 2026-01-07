import StatisticRepository from "../../repository/statisticRepository.js";

export const getStatisticYearly = async (req, res) => {
    const { year } = req.body;

    const result = await StatisticRepository.getStatisticByYear(year);

    if (result.success){
        res.status(200).json({
            success: true,
            data: result.data
        })
    } else {
        res.status(403).json({
            success: false,
            message: 'Failed to load statistic yearly'
        })
    }
}