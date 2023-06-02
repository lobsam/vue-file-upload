
import { createWebHistory, createRouter } from "vue-router";
import Organization from "@/components/OrganizationList.vue";
import HomePage from "@/components/SearchInput.vue";

const routes = [
  {
    path: "/vue-file-upload",
    name: "home",
    component: HomePage
  },
  {
    path: "/vue-file-upload/organization",
    name: "organization",
    component: Organization,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;