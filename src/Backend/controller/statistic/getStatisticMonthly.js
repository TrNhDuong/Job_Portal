import StatisticRepository from "../../repository/statisticRepository.js";

export const getStatisticMonthly = async (req, res) => {
    const { year, month } = req.body;

    const result = await StatisticRepository.getStatisticByMonth(year, month);

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