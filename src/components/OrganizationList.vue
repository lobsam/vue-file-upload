<template>
   <div>
      <div v-if="!isAuthenticated">
         <button @click="login()" class="btn btn-primary btn-sm mt-4">Login</button>
      </div>

      <div v-else>
         <h6> Welcome <strong>{{ user.nickname }}</strong></h6>
         <div class="d-flex justify-content-end">
            <button @click="logoutUser()" class="btn btn-danger btn-sm">Logout</button>
         </div>
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
               :class="{ 'table-danger': data.currentUserEmail === info.admin.email}"
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
                     :org_admin="info.admin" 
                     :org_id="info.id"
                  />
               </td>
               <td> 
                  <TeamList 
                     :orgMembers="info.organization_members"
                     :org_id="info.id"
                     :org_admin="info"
                  />
               </td>
               <td>
                  <Dictionaries 
                     :org_id="info.id"
                     :org_admin="info.admin_id"
                  />
               </td>
               <td v-if="user.email === info.admin.email">
                  <button class="btn btn-danger btn-sm me-2" @click="deleteOrg"> Delete </button>
                  <UpdateOrganization :orgData="info"/>
               </td>
             </tr>
           </tbody>  
         </table>
         <button class="btn btn-primary btn-sm" @click="loadData()"> refresh </button>
         <p>NOTE : After SIGN IN click the "refresh button"</p>
      </div>
   </div>
   
</template>
<script>
import { onMounted, reactive, watch } from 'vue';
import MemberList from "@/components/MemberList.vue"
import TeamList from "@/components/TeamList.vue"
import AddOrganization from "@/components/AddOrganization.vue"
import UpdateOrganization from "@/components/UpdateOrganization.vue"
import Dictionaries from './Dictionaries.vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { getUserOrganization } from '@/components/graphql/quries.js'
import {DELETE_ORG } from "@/components/graphql/mutation.js"
import { useAuth0 } from '@auth0/auth0-vue';

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
      const { loginWithRedirect, user, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();
      //state
      const data = reactive({
         orgData: [],
         currentUserEmail: ""
      });
      onMounted(() => {
         loadData()
         setToken();
      })
      watch(isAuthenticated.value ,(nVal, oVal) => {
         loadData();
         setToken();
      })
      function login() {
         loginWithRedirect();
      }
      async function setToken() {
         const token = await getAccessTokenSilently();
         sessionStorage.setItem("token", token) 
      }
      function logoutUser() {
         logout({ logoutParams: { returnTo:"http://localhost:5173/organization" } });
      }
      function loadData() {
         setToken();
         if(isAuthenticated.value) {
            const { result, error, onError, onResult, refetch} = useQuery(getUserOrganization, {'fetchPolicy': 'no-cache'});
            //success
            onResult(async () => {
               data.orgData = result.value.organization
               const currentUser = await user
               if(currentUser.value) {
                  data.currentUserEmail = currentUser.value.email
               }
            })
            //error
            onError(() => {
               alert(error)
            })
            refetch()
         } else {
            data.orgData = []
         }
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
         login,
         user, 
         isAuthenticated,
         updateOrg,
         deleteOrg,
         login,
         logoutUser,
         loadData
      }
   },
}
</script>