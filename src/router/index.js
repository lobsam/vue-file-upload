
import { createWebHistory, createRouter } from "vue-router";
import Organization from "@/components/OrganizationList.vue";
import HomePage from "@/components/SearchInput.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage
  },
  {
    path: "/organization",
    name: "organization",
    component: Organization,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;