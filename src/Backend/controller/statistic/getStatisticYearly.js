import StatisticRepository from '../../repository/statisticRepository.js';

export const getStatisticYearly = async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({
            success: false,
            message: "Missing year"
        });
    }

    try {
        // 🔥 init tháng hiện tại để tránh thiếu data nền
        await StatisticRepository.initMonthlyStatistic();

        const result = await StatisticRepository.getStatisticByYear(year);

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
