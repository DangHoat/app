import async from "../components/Async";

import {
    Layout as LayoutIcon,
    Sliders as SlidersIcon,
    Users as UsersIcon,
} from "react-feather";

// Auth
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ResetPassword from "../pages/auth/ResetPassword";
import Page404 from "../pages/auth/Page404";
import Page500 from "../pages/auth/Page500";
import SignUpSuccessfully from "../pages/auth/ActiveUser";
import CreateNewPassword from "../pages/auth/CreateNewPassWord";

// Project
import Project from "../pages/project/Project"

// Pages
import Profile from "../pages/profile/Profile";
import Pricing from "../pages/pages/Pricing";
import Clients from "../pages/pages/Clients";
import Work from "../pages/work/Work";
import Wiki from "../pages/wiki/Wiki";
import Storage from "../pages/storage/Storage";
import Report from "../pages/report/Report"
import Admin from "../pages/admin/Admin";
import Timeline from "../pages/timeline/Timeline.js"
import WorkDetail from "../pages/work/work-detail/WorkDetail";
import WorkDeTailActivities from "../pages/work/work-detail/CardLeft/Activities";
import WorkDeTailComment from "../pages/work/work-detail/CardLeft/Comment";
import Task from "../pages/task/Task";
import Epic from "../pages/epic/Epic"
import Issue from "../pages/issue/Issue"

import Root from "../pages/root/root";
import Term from "../pages/term/Term";
import Discover from "../pages/discover/Discover";

// Dashboards
const Default = async(() => import("../pages/dashboards"));

const dashboardWithoutSidebarRoutes = {
    path: "/dashboard",
    name: "Dashboard",
    header: "Main",
    icon: SlidersIcon,
    containsHome: true,
    children: [
        {
            path: "/dashboard",
            name: "Default",
            component: Default
        },
        {
            path: "/project",
            name: "List Project Page",
            component: Project
        },
        {
            path: "/profile",
            name: "Profile",
            component: Profile
        },
        {
            path: "/pricing",
            name: "Pricing",
            component: Pricing
        }
    ]
};


const pageRoutes = {
    path: "/project",
    name: "Project",
    icon: LayoutIcon,
    children: [
        {
            path: "/project/clients",
            name: "Clients",
            component: Clients,
            badgeColor: "primary",
            badgeText: "New"
        },
        {
            path: "/project/timeline",
            name: "Timeline Page",
            component: Timeline
        },
        {
            path: "/project/work",
            name: "List work Page",
            component: Work
        },
        {
            path: "/project/work/detail",
            name: "Work detail Page",
            component: WorkDetail
        },
        {
            path: "/project/work/detail/activities",
            name: "Work detail Activities Page",
            component: WorkDeTailActivities
        },
        {
            path: "/project/work/detail/comment",
            name: "Work detail Comment Page",
            component: WorkDeTailComment
        },
        {
            path: "/project/work/task",
            name: "Task Page",
            component: Task
        },
        {
            path: "/project/wiki",
            name: "Wiki Page",
            component: Wiki
        },
        {
            path: "/project/storage",
            name: "Storage Page",
            component: Storage
        },
        {
            path: "/project/report",
            name: "Report Page",
            component: Report
        },
        {
            path: "/project/admin",
            name: "Admin Page",
            component: Admin
        },
        {
            path: "/project/epic",
            name: "Epic Page",
            component: Epic
        },
        {
            path: "/project/issue",
            name: "Issue Page",
            component: Issue
        }
    ]
};

const authRoutes = {
    path: "/auth",
    name: "Auth",
    icon: UsersIcon,
    badgeColor: "secondary",
    badgeText: "12/24",
    children: [
        {
            path: "/auth/sign-in",
            name: "Sign In",
            component: SignIn
        },
        {
            path: "/auth/sign-up",
            name: "Sign Up",
            component: SignUp
        },
        {
            path: "/auth/reset-password",
            name: "Reset Password",
            component: ResetPassword
        },
        {
            path: "/auth/404",
            name: "404 Page",
            component: Page404
        },
        {
            path: "/auth/500",
            name: "500 Page",
            component: Page500
        },
        {
            path: "/auth/sign-up-successfully",
            name: "Sign Up Successfully Page",
            component: SignUpSuccessfully
        },
        {
            path: "/auth/create-new-pass",
            name: "Create New Password Page",
            component: CreateNewPassword
        }

    ]
};

const landingRoutes = {
    path: "/",
    name: "Landing Page",
    children: [
        {
            path: "/root",
            name: "Root Page",
            component: Root
        },
        {
            path: "/term",
            name: "Term Page",
            component: Term
        },
        {
            path: "/discover",
            name: "Discover page",
            component: Discover
        }
    ]
};
export const landing = [landingRoutes];
// Dashboard specific routes
export const dashboard = [
    pageRoutes,
];

// Auth specific routes
export const page = [authRoutes];

export const dashboardWithoutSidebar = [dashboardWithoutSidebarRoutes];

// All routes
export default [
    dashboardWithoutSidebarRoutes,
    pageRoutes,
    authRoutes,
];
