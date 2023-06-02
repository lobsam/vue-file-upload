<template>
  <button class="btn btn-primary btn-sm  " :data-bs-target="target" data-bs-toggle="modal"> view </button>
       <div class="modal fade" :id="modalID">
           <div class="modal-dialog modal-fullscreen">
               <div class="modal-content">
                   <div class="modal-header">
                       <h5 class="modal-title">Teams: </h5>
                       <button 
                          class="ms-3 btn btn-primary btn-sm"
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#CreateTeamCollpse" 
                          aria-expanded="false" 
                          aria-controls="CreateTeamCollpse"
                        > Create Team
                        </button>
                       <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
                   <div class="modal-body">
                       <div class="row">
                           <div class="col">
                              
                               <table class="table" >
                                 <thead class="table-primary">
                                   <tr>
                                       <th scope="col" >ID</th>
                                       <th scope="col">Name</th>
                                       <th scope="col">Logo</th>
                                       <th scope="col">Members</th>
                                       <th scope="col" >Action</th>
                                   </tr>
                                 </thead>
                                   <tbody>
                                       <tr
                                       :class="{ 'table-success': team.id === selectedTeam.id}"
                                         v-for="(team, index) in teams" 
                                         :key="index"
                                       >
                                           <td>{{team.id}}</td>
                                           <td>{{ team.name }}</td>
                                           <td>{{ team.logo }}</td>
                                           <td>
                                              <i 
                                                class="bi bi-eye-fill ms-3"
                                                @click="getTeamMembers(team)"
                                                style="font-size: 25px; color:green"
                                              ></i>
                                            
                                          </td>
                                           <td>
                                            <i 
                                              class="bi bi-pencil-square me-3"
                                              style="font-size: 20px;"
                                              data-bs-toggle="collapse" 
                                              data-bs-target="#collapseExample" 
                                              aria-expanded="false" 
                                              aria-controls="collapseExample"
                                              @click="loadUpdateMember(team)"
                                            ></i>
                                            <i 
                                              v-if="currentUserEmail === org_admin.admin.email"
                                              class="bi bi-trash"
                                              style="font-size: 20px; color:red"
                                              @click="onDeleteTeam(team.id)"
                                            >
                                            </i>
                                          </td>
                                       </tr>
                                   </tbody> 
                               </table>
                           </div>
                          

                           <div class="col border">
                              <div class="d-flex justify-content-between">
                                <h6 class="pt-4">Team : {{ currentTeam }}</h6> 
                                <button 
                                  class=" m-3 btn btn-success btn-sm"
                                  @click="getTeamMembers(selectedTeam)"
                                >
                                  <i class="bi bi-arrow-clockwise" style="font-size: 10px;" ></i>
                                </button>
                              </div>
                              
                              <table class="table" >
                                <thead class="table-primary">
                                  <tr>
                                      <th scope="col">Admin</th>
                                      <th scope="col">Name</th>
                                      <th scope="col">Email</th>
                                      <th scope="col" >Action</th>
                                  </tr>
                                </thead>
                                  <tbody>
                                      <tr
                                        :class="{ 'table-success': teamAdmin === member.user.id}"
                                        v-for="(member, index) in teamMembers" 
                                        :key="index"
                                      >
                                          <td>
                                              <input 
                                                  class="form-check-input" 
                                                  type="checkbox"  
                                                  id="flexCheckDefault"
                                                  :checked="teamAdmin === member.user.id"
                                                  disabled
                                              />
                                          </td>
                                          <td>{{member.user.name}}</td>
                                          <td>{{ member.user.email }}</td>
                                          <td>
                                            <button 
                                                :disabled=" teamAdmin === member.user.id"
                                                class="btn btn-danger btn-sm me-2" 
                                                @click="ondeleteTeamMember(member.user.id)"
                                                v-if="org_admin.admin.email === currentUserEmail || selectedTeam.admin.email === currentUserEmail"
                                            >
                                                Remove
                                            </button>
                                          </td>
                                      </tr>
                                  </tbody> 
                              </table>
                              <button 
                                  class="m-3 btn btn-primary btn-sm d-flex justify-content-end"
                                  type="button" 
                                  data-bs-toggle="collapse" 
                                  data-bs-target="#AddTeamMemberCollapse" 
                                  aria-expanded="false" 
                                  aria-controls="AddTeamMemberCollapse"
                                  :disabled="isAddBtn"
                                > Add
                                </button>
                           </div>


                           <div class="col">
                            <div class="collapse mb-4" style="box-shadow: 1px 1px 10px lightblue;" id="CreateTeamCollpse">
                                <div class="card card-body">
                                  <h6>Create Team: </h6>
                                  <form @submit.prevent="onSubmit" >
                                      <div class="mb-3">
                                        <label for="org_name" class="form-label">Name</label>
                                        <input type="Text" v-model="object.name" class="form-control" id="org_name" >
                                      </div>
                                      <div class="mb-3">
                                        <label for="org_logo" class="form-label">Logo url</label>
                                        <input type="text" v-model="object.logo" class="form-control" id="org_logo">
                                      </div>
                                      <div class="mb-3">
                                        <label for="org_logo" class="form-label">Admin User</label>
                                        <select class="form-select " v-model="object.admin_id" aria-label=".form-select-sm example">
                                          <option v-for="member in orgMembers" :value="member.user.id" :key="member.user.id">
                                            {{ member.user.name }}
                                          </option>
                                        </select>
                                      </div>
                                      
                                      <div class="modal-footer">
                                        <button type="submit" class="btn btn-primary">submit</button>
                                        <div v-if="Error.isError" class="error-text">
                                           ERROR: {{ Error.errorMessage }}
                                        </div>
                                      </div>
                                  </form>
                                </div>
                              </div>
                              <div class="collapse mt-4" style="box-shadow: 1px 1px 10px  lightblue;" id="AddTeamMemberCollapse">
                                <div class="card card-body">
                                  <h6>Add Team Members: </h6>
                                  <form @submit.prevent="onAddMembers">
                                    <div class="mb-3">
                                          <label for="org_logo" class="form-label">List of Organization members</label>
                                          <select class="form-select " multiple v-model="selectOrgMember" aria-label=".form-select-sm example">
                                            <option v-for="member in orgMembers" :value="member.user.id" :key="member.user.id">
                                              {{ member.user.name }}
                                            </option>
                                          </select>
                                        </div>
                                      <div class="d-flex justify-content-end">
                                          <button 
                                              type="submit" 
                                              class="btn btn-primary btn-sm mt-2 d-flex justify-content-end">
                                                  Add
                                          </button>
                                      </div>
                                  </form>
                                </div>
                              </div>
                               <div class="collapse mt-4" id="collapseExample">
                                <div class="card card-body">
                                  <h6>Edit Team: </h6>
                                  <form @submit.prevent="onUpdate" >
                                      <div class="mb-3">
                                        <label for="org_name" class="form-label">Name</label>
                                        <input type="Text" v-model="object.name" class="form-control" id="org_name" >
                                      </div>
                                      <div class="mb-3">
                                        <label for="org_logo" class="form-label">Logo url</label>
                                        <input type="text" v-model="object.logo" class="form-control" id="org_logo">
                                      </div>
                                      <div class="mb-3">
                                        <label for="org_logo" class="form-label">Admin User</label>
                                        <select class="form-select " v-model="object.admin_id" aria-label=".form-select-sm example">
                                          <option v-for="member in orgMembers" :value="member.user.id" :key="member.user.id">
                                            {{ member.user.name }}
                                          </option>
                                        </select>
                                      </div>
                                      
                                      <div class="modal-footer">
                                        <button type="submit" class="btn btn-primary">submit</button>
                                        <div v-if="Error.isError" class="error-text">
                                           ERROR: {{ Error.errorMessage }}
                                        </div>
                                      </div>
                                  </form>
                                </div>
                              </div>
                           </div> 
                       </div>
                   </div>
               </div>
           </div>
       </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GET_TEAM_BY_ORG_PK,GET_TEAM_MEMBER_BY_TEAM_PK } from '@/components/graphql/quries.js'
import { ADD_TEAM, UPDATE_TEAM, ADD_TEAM_MEMBERS, DELETE_TEAM_MEMBERS, DELETE_TEAM } from "@/components/graphql/mutation.js"
export default {
   name: "organization_member",
   props: {
    orgMembers: { 
            type: Array,
            required: true
        },
       org_admin: {
           type: Object,
           required: true
       },
       org_id: {
           type: String,
           required: true
       }
   },
   data() {
       return {
          modalID: "",
          target: "",
          currentUserEmail: "",
           inputID: "",
           teams: [],
           teamAdmin: "",
           currentTeam: "",
           selectedTeam: {},
           selectOrgMember: [],
           teamMembers: [],
           memberData: [],
           isAddBtn: true,
           object: {
            name: "",
            logo: "",
            admin_id: "",
            organization_id: this.org_id
           },
           Error: {
               isError: false,
               errorMessage: ""
           }
       }
   },
   async mounted() {
      this.modalID = `modal-${this.org_id}-team`
      this.target = `#modal-${this.org_id}-team`
      const { user }= useAuth0()
      const currentUser = await user;
      this.currentUserEmail = currentUser.value.email;
      this.loadData();
   },
   methods: {
       async loadData() {
           const { result, error, onResult, onError, refetch } = await useQuery(GET_TEAM_BY_ORG_PK, {org_id: this.org_id});
           onResult(() => {
               this.teams = result.value.team
           })
           onError(() => {
              alert(`${error.value}`)
           })
           refetch()
       },
       async getTeamMembers(team) {
        this.isAddBtn = false;
        this.selectedTeam = team;
        this.teamAdmin = team.admin.id
        const { result, error, onResult, onError, refetch } = await useQuery(GET_TEAM_MEMBER_BY_TEAM_PK, {team_id: team.id});
           onResult(() => {
            this.teamMembers = result.value.team_member
            this.currentTeam = team.name
           })
           onError(() => {
               console.log("error : ", error)
           })
           refetch();
       },
       loadUpdateMember(team) {
        this.selectedTeam = team;
        this.object.name  = team.name;
        this.object.logo  = team.logo;
        this.object.admin_id  = team.admin.id;
        delete this.object.organization_id;
       },
       async onSubmit() {
        console.log("object : ", this.object)
          try {
            const { mutate:addMemberMutation, onDone, error, onError } = await useMutation(ADD_TEAM)
            addMemberMutation({team: this.object});
            onDone(() => {
                this.loadData()
            })
            onError(() => {
                alert(`${error.value}`)
            })
          } catch (error) {
            console.log(error)
          }
       },
       async onUpdate() {
        try {  
          const { mutate:addMemberMutation, onDone, error, onError } = await useMutation(UPDATE_TEAM)
          addMemberMutation({
            team_id: this.selectedTeam.id,
            data: this.object
          });
          onDone(() => {
              this.loadData()
          })
          onError(() => {
              alert(`${error.value}`)
          })
        } catch (error) {
          console.log(error)
        }
       },
       async onAddMembers() {
        Object.values(this.selectOrgMember).forEach((id) => {
          this.memberData.push({
            user_id: id,
            team_id: this.selectedTeam.id
          })
        })
        console.log("MEMber : ", this.memberData)
        try {
          const { mutate:addMemberMutation, onDone, error, onError } = await useMutation(ADD_TEAM_MEMBERS)
          addMemberMutation({team_member: this.memberData});
          onDone(() => {
              alert("Added Team members (refresh team Member table)")
              this.loadData()
          })
          onError(() => {
              alert(`${error.value}`)
          })
        } catch (error) {
          console.log(error)
        }

       },


       async onDeleteTeam(team_id) {
        try {
          const { mutate:addMemberMutation, onDone, error, onError } = await useMutation(DELETE_TEAM)
          addMemberMutation({team_id});
          onDone(() => {
              this.loadData()
          })
          onError(() => {
              alert(`${error.value}`)
          })
        } catch (error) {
          console.log(error)
        }
       },


       async ondeleteTeamMember(id) {
        try {
          const { mutate:addMemberMutation, onDone, error, onError } = await useMutation(DELETE_TEAM_MEMBERS)
          addMemberMutation({
            team_id: this.selectedTeam.id,
            user_id: id
          });
          onDone(() => {
              console.log("done")
              this.loadData()
          })
          onError(() => {
              alert(`${error.value}`)
          })
        } catch (error) {
          console.log(error)
        }
       }

   }
}
</script>
