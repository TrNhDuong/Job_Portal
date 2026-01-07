import StatisticRepository from '../../repository/statisticRepository.js';

export const getStatisticMonthly = async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({
            success: false,
            message: "Missing year or month"
        });
    }

    try {
        // 🔥 đảm bảo statistic tháng hiện tại đã được init
        await StatisticRepository.initMonthlyStatistic();

        const result = await StatisticRepository.getStatisticByMonth(year, month);

        return res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
