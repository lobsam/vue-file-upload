<template>
   <button class="btn btn-primary btn-sm " :data-bs-target="target" data-bs-toggle="modal"> view </button>
        <div class="modal fade" :id="modalID">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Organization Members</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <table class="table" >
                                  <thead class="table-primary">
                                    <tr>
                                        <th scope="col" >Admin</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col" >Action</th>
                                    </tr>
                                  </thead>
                                    <tbody>
                                        <tr
                                          :class="{ 'table-success': org_admin === member.user.id}"
                                          v-for="(member, index) in memberList" 
                                          :key="index"
                                        >
                                            <td>
                                                <input 
                                                    class="form-check-input" 
                                                    type="checkbox" 
                                                    v-if="currentUserEmail === member.user.email"
                                                    :checked="currentUserEmail === member.user.email" 
                                                    id="flexCheckDefault"
                                                    disabled
                                                />
                                            </td>
                                            <td>{{member.user.name}}</td>
                                            <td>{{ member.user.email }}</td>
                                            <td>
                                              <button 
                                                  class="btn btn-danger btn-sm me-2" 
                                                  @click="deleteMember(member.user.id)"
                                                  :disabled="currentUserEmail === member.user.email"
                                                  v-if="currentUserEmail === org_admin.email"
                                              >
                                                  Remove
                                              </button>
                                            </td>
                                        </tr>
                                    </tbody> 
                                </table>
                            </div>
                           
                            <div class="col">
                                <div class="card">
                                  <div class="card-body">
                                    <form @submit.prevent="onSubmit">
                                        <h5>Add Members to the Organization</h5>
                                        <div v-for="(member, index) in memberData" :key="index" class="d-flex ">
                                            <input 
                                                class="m-2" 
                                                @input="inputData(member.user_id)" 
                                                type="text" 
                                                v-model="member.user_id" 
                                                placeholder="Enter User ID" 
                                                required
                                            />
                                            <button 
                                                class="btn btn-danger btn-sm m-2 " 
                                                v-if="index === memberData.length - 1" 
                                                @click="removeInputField" 
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <button @click="addInputForm"  class="btn btn-success btn-sm m-2">+</button>
                                        <div class="d-flex justify-content-end">
                                            <button 
                                                type="submit" 
                                                class="btn btn-primary btn-sm mt-5 d-flex justify-content-end">
                                                    Add
                                            </button>
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
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GET_ORG_MEMBERS } from '@/components/graphql/quries.js'
import { ADD_ORG_MEMBER, DELETE_ORG_MEMBER } from "@/components/graphql/mutation.js"
import { useAuth0 } from '@auth0/auth0-vue';
export default {
    name: "organization_member",
    props: {
        members: { 
            type: Array,
            required: true
        },
        org_admin: {
            type: String,
            required: true
        },
        org_id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentUserEmail: "",
            modalID: "",
            target: "",
            inputID: "",
            memberList: [],
            memberData: [
                {
                    user_id: "",
                    organization_id: this.org_id
                }
            ],
            Error: {
                isError: false,
                errorMessage: ""
            }
        }
    },
    async mounted() {
        const { user } = useAuth0()
        const currentUser = await user;
        this.currentUserEmail = currentUser.value.email
        this.modalID = `modal-${this.org_id}`
        this.target = `#modal-${this.org_id}`
        this.loadData();
    },
    methods: {
        async loadData() {
            const { result, error, onResult, onError, refetch } = await useQuery(GET_ORG_MEMBERS,{org_id: this.org_id});
            onResult(() => {
                this.memberList = result.value.organization_member
            })
            onError(() => {
                console.log("error : ", error)
            })
            refetch()
        },

        inputData(id) {
            this.inputID = id
        },

        addInputForm() {
            this.loadData();
            this.memberData.push({
                user_id: "",
                organization_id: this.org_id
            })   
        },

        removeInputField() {
            this.memberData.pop()
        },

        async deleteMember(id) {
            const {mutate: deleteUser, onDone, onError, error} = useMutation(DELETE_ORG_MEMBER);
            deleteUser({user_id: id,org_id: this.org_id})
            
            onDone(() => {
                this.loadData()
            })
            onError(() => {
                console.log("Error : ", error)
            })

        },

        async onSubmit() {
            try {
                const { mutate:addMemberMutation, onDone, error, onError } = await useMutation(ADD_ORG_MEMBER)
                addMemberMutation({users: this.memberData});
                onDone(() => {
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
