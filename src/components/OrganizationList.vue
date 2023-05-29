<template>
   <div v-if="!AuthState.loading">
      <div v-if="!AuthState.isAuthenticated">
         <button @click="login()" class="btn btn-primary btn-sm">Login</button>
      </div>

      <div v-else>
         <p> Welcome <strong>{{ AuthState.user.nickname }}</strong></p>
         <button @click="logout()" class="btn btn-danger btn-sm">Logout</button>
         <h1>Organization</h1>
         <AddOrganization />
         <table class="table" >
           <thead class="table-primary">
             <tr>
               <th scope="col">id</th>
               <th scope="col">Logo</th>
               <th scope="col">Name</th>
               <th scope="col">Same as Team</th>
               <th scope="col">Members</th>
               <th scope="col">Teams</th>
               <th scope="col">Dictionaries</th>
               <th scope="col" >Action</th>
             </tr>
           </thead>
           <tbody>
            <tr 
               v-for="(info, index) in data.orgData" 
               :class="{ 'table-danger': data.currentUser === info.admin_id}"
               :key="index"
            >
               <th scope="row">{{ info.id }}</th>
               <td>{{info.logo}}</td>
               <td>{{ info.name }}</td>
               <td>{{ info.same_as_team }}</td>
               <td>
                  <MemberList 
                     :key="index"
                     :members="info.organization_members" 
                     :org_admin="info.admin_id" 
                     :org_id="info.id"
                  />
               </td>
               <td> 
                  <TeamList 
                     :orgMembers="info.organization_members"
                     :org_id="info.id"
                     :org_admin="info.admin_id"
                  />
               </td>
               <td>
                  <Dictionaries 
                     :org_id="info.id"
                     :org_admin="info.admin_id"
                  />
               </td>
               <td v-if="info.admin_id === data.currentUser">
                  <button class="btn btn-danger btn-sm me-2" @click="deleteOrg" :disabled="info.same_as_team"> Delete </button>
                  <UpdateOrganization :orgData="data.orgData[0]"/>
               </td>
             </tr>
           </tbody>  
         </table>
      </div>
   </div>
   
</template>
<script>
import { onMounted, reactive } from 'vue';
import MemberList from "@/components/MemberList.vue"
import TeamList from "@/components/TeamList.vue"
import AddOrganization from "@/components/AddOrganization.vue"
import UpdateOrganization from "@/components/UpdateOrganization.vue"
import Dictionaries from './Dictionaries.vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { getUserOrganization } from '@/components/graphql/quries.js'
import {DELETE_ORG } from "@/components/graphql/mutation.js"
import { useAuth0, AuthState } from "../utils/useAuth0";

export default {
   name: "OrgList",
   components: {
      MemberList,
      TeamList,
      AddOrganization,
      UpdateOrganization,
      Dictionaries
   },
   setup() {
      //state
      const data = reactive({
         orgData: [],
         currentUser: ""
      });
      const { login, logout, initAuth } = useAuth0(AuthState);
      onMounted(() => {
         initAuth();
         loadData();
      })
      function loadData() {
         const { result, error, onError, onResult, refetch} = useQuery( getUserOrganization);
         //success
         onResult(() => {
            data.orgData = result.value.organization
         })
         //error
         onError(() => {
            console.log("Error: ", error)
         })
         refetch()
      }
      async function deleteOrg() {
         let id = data.orgData[0].id
         const { mutate: orgDeleted, onError, onDone, error } = await useMutation(DELETE_ORG, {variables: {id}})
         orgDeleted()
         onDone(async () => {
            console.log("deleted Done")
         })
         onError(() => {
            alert(`${error.value}`)
         })
         loadData()
      }
      async function updateOrg() {

      }

      return {
         data,
         onMounted,
         updateOrg,
         deleteOrg,
         login,
         logout,
         initAuth,
         AuthState
      }
   },
}
</script>