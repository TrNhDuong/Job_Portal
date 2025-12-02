// ========= Nhập khẩu Hình ảnh và Icon =========
import InspireLogo from './InspireLogo.png';
import logo from './logo.png';
import search_icon from './search_icon.svg';
import menu_icon from './menu_icon.svg';
import location_icon from './location_icon.svg';
import location_icon_colored from './location_icon_colored.svg';
import users_icon from './users_icon.svg';
import dashboardIcon from './dashboardIcon.svg';
import dashboardIconColored from './dashboardIconColored.svg';
import react from './react.svg';

// Hình ảnh cho các danh mục công việc
import Bank from './bank.jpg';
import BDS from './bds.jpg';
import Service from './Service.jpg';
import CV from './CV.jpg';
import Designer from './Designer.jpg';
import HR from './HR.jpg';
import IT from './IT.jpg';
import LD from './LD.jpg';
import Logistic from './Logistic.jpg';
import Marketing from './marketing.jpg';
import Media from './Media.jpg';

// ========= Gom nhóm các tài sản (assets) =========
export const assets = {
    InspireLogo,
    logo,
    search_icon,
    menu_icon,
    location_icon,
    location_icon_colored,
    users_icon,
    dashboardIcon,
    dashboardIconColored,
    react,
    Bank,
    BDS,
    Service,
    CV,
    Designer,
    HR,
    IT,
    LD,
    Logistic,
    Marketing,
    Media
};

// ========= Dữ liệu cho trang web =========

// Các liên kết trên thanh điều hướng (menu)
export const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Job", path: "/jobs" },
    { name: "Tools", path: "/tools" },
    { name: "Career Advice", path: "/career-advice" },
];

// Danh sách các danh mục công việc (sử dụng hình ảnh đã nhập)
export const jobCategories = [
    { name: "Marketing", image: assets.Marketing },
    { name: "Business Dev", image: assets.BDS },
    { name: "Customer Service", image: assets.Service },
    { name: "Designer", image: assets.Designer },
    { name: "Human Resources", image: assets.HR },
    { name: "Information Technology", image: assets.IT },
    { name: "Learning & Dev", image: assets.LD },
    { name: "Logistics", image: assets.Logistic },
    { name: "Media & News", image: assets.Media },
    { name: "Banking", image: assets.Bank },
];

// Dữ liệu mẫu cho các công việc
export const dummyJobData = [
    {
        _id: "job001",
        title: "Senior React Developer",
        company: "Tech Solutions Inc.",
        location: "New York, NY",
        type: "Full-time",
        category: "Information Technology",
        description: "We are looking for an experienced React Developer to join our dynamic team. You will be responsible for building the 'client-side' of our web applications."
    },
    {
        _id: "job002",
        title: "Digital Marketing Manager",
        company: "Creative Minds Agency",
        location: "Los Angeles, CA",
        type: "Full-time",
        category: "Marketing",
        description: "Lead our marketing team to create and implement successful online marketing campaigns. Strong knowledge of SEO, SEM, and social media is required."
    },
    {
        _id: "job003",
        title: "UI/UX Designer",
        company: "Innovate Design Studio",
        location: "Chicago, IL",
        type: "Part-time",
        category: "Designer",
        description: "Seeking a creative UI/UX Designer to turn our software into easy-to-use products for our clients. Experience with Figma and Adobe XD is a plus."
    }
];