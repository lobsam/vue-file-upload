<template v-if="">
    <button class="btn btn-primary btn-sm " data-bs-target="#dictionaryModal" data-bs-toggle="modal"> View </button>
    <div class="modal fade" id="dictionaryModal">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Dictionaries</h5>
                    <div class="ms-3 ">
                        <AddDictionary
                            :org_id="org_id"
                        />
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col p-1">
                            <table  class="table table-hover dictionary-table shadow-sm" >
                                <thead class="table-primary">
                                    <tr class="table-primary ">
                                        <th scope="col">Name</th>
                                        <th scope="col">Target</th>
                                        <th scope="col" >Source</th>
                                        <th scope="col" >Access Mode</th>
                                        <th scope="col" >Teams</th>
                                        <th scope="col" >Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(dictionary, index) in dictionaryList" 
                                        :key="index"
                                        :class="{ 'table-success': selectedRowIndex === index}"
                                        @click="activeRow(index, dictionary)"
                                    >
                                        <td>{{ dictionary.name }}</td>
                                        <td>{{ dictionary.target }}</td>
                                        <td>{{ dictionary.source }}</td>
                                        <td>{{ dictionary.access_mode }}</td>
                                        <td>
                                            <span class="badge bg-success">
                                                
                                                {{ dictionary.dictionary_permissions.length }}
                                            </span>
                                        </td>
                                        <td>
                                            <UpdateDictionary :key="dictionary.id" :dictionaryData="dictionary"/>
                                            <i 
                                                class="bi bi-trash" 
                                                style="font-size: 20px; color:red"
                                                @click="onDeleteDictionary(dictionary)"
                                            >
                                            </i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col border shadow p-3"> 
                           <AddWords :dictionary="selectedDictionary" />
                        </div>
                        <div class="col border p-2">
                            <h6 style="color: green">Dictionary Teams :</h6>
                            <table  class="table table-hover dictionary-table shadow-sm" >
                                <thead class="table-primary">
                                    <tr class="table-primary ">
                                        <th scope="col">Logo</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Admin</th>
                                        <th scope="col" >Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(team, index) in teamList" 
                                        :key="index"
                                    >
                                        <td>{{ team.logo }}</td>
                                        <td>{{ team.name }}</td>
                                        <td>{{ team.admin.name }}</td>
                                        <td>
                                            <button 
                                                class="btn btn-sm btn-danger" 
                                                @click="deletePermission(team.id, team.dictionary_permission)"
                                            >Remove
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr>
                            <div class="p-5">
                                <h6 style="color: green">Assign Team to Dictionary :  {{ selectedDictionary.name }}</h6>
                              <label for="org_logo" class="form-label">Select Team</label>
                              <select 
                                class="form-select " 
                                v-model="selectedTeam" 
                                aria-label=".form-select-sm example" 
                                :disabled="selectedRowIndex == -1"
                                >
                                <option 
                                    v-for="team in teamNameList" 
                                    :key="team.name" 
                                    :value="team.id"
                                >
                                    {{team.name}}
                                </option>
                              </select>
                            </div>
                            <div class="d-flex justify-content-end pt-3">
                                <button 
                                    :disabled="selectedRowIndex == -1" 
                                    class="btn btn-success btn-sm" 
                                    @click="addPermission">
                                        Add Team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import 'bootstrap';
import { GET_DICTIONARIES, GET_USER_TEAM, GET_TEAM_BY_PK } from '@/components/graphql/quries.js'
import {ADD_DICTIONARY_PERMISSION, DELETE_DICTIONARY_PERMISSION, DELETE_DICTIONARY } from "@/components/graphql/mutation.js"
import { useQuery, useMutation } from '@vue/apollo-composable';
import UpdateDictionary from './UpdateDictionary.vue';
import AddDictionary from './AddDictionary.vue';
import AddWords from './AddWords.vue'


export default {
  name: 'dictionaryModal',
  components: {
    AddDictionary,
    UpdateDictionary,
    AddWords,
  },
  props: {
    org_admin: {
           type: String,
           required: true
       },
    org_id: {
        type: String,
        required: true
    }
  },
  provide() {
    return {
        reloadData: this.loadData
    }
  },
  data() {
    return {
        iserror: false,
        errorMessage: "",
        selectedRowIndex: -1,
        selectedDictionary: {},
        selectedTeam: "",
        dictionaryList: [],
        teamNameList: [],
        team: {},
        teamList: [],
        permissionTeam: {}
    }
  },
  watch: {
    selectedRowIndex() {
        this.teamList = []
        this.getTeamByPk()
    }
  },
  mounted() {
    this.loadData();
    this.getTeamList();
  },
  methods: {
    loadData() {
        const {result, onResult, onError, error, refetch} = useQuery(GET_DICTIONARIES);
        onResult(() => {
            this.dictionaryList = result.value.data_dictionary
        })
        onError(() => {
            console.log("Error: ", error)
        })
        refetch();
    },

    updateDictionaryTable() {
        console.log("hello")
    },

    async getTeamList() {
        const {result, onResult, onError, error} = await useQuery(GET_USER_TEAM);
        onResult(() => {
            this.teamNameList = result.value.team
        })
        onError(() => {
            console.log("Error: ", error)
        })
    },
    
    async addPermission() {
        let team_permission = {
            team_id: this.selectedTeam,
            dictionary_id: this.selectedDictionary.id
        }
        const { mutate: addDictionaryPermission, onDone, onError, error } = await useMutation(ADD_DICTIONARY_PERMISSION);
        addDictionaryPermission({ team_permission })
        onDone(() => {
            console.log(" update Done ");
            this.loadData();
            this.getTeamByPk();
        })
        onError(() => {
            alert(`${error.value}`)
        })
    
    },
    getTeamByPk() {
        
        this.selectedDictionary.dictionary_permissions.forEach((team) => {
            const {result, onResult, onError, error } = useQuery(GET_TEAM_BY_PK, {team_id: team.team_id}, {fetchPolicy: 'no-cache'});
            onResult(() => {
                this.permissionTeam = result.value.team_by_pk
                if(!this.teamList.includes(this.permissionTeam)) {
                    this.teamList.push(this.permissionTeam)
                }
            })
            onError(() => {
                alert(`${error.value}`)
            })
        })
        
    },
    async deletePermission(id, dictionary_permission) {
        
        dictionary_permission.forEach(async (permission) => {
            if(this.selectedDictionary.id == permission.dictionary_id) {
                const { mutate: addDictionaryPermission, onDone, onError, error } = await useMutation(DELETE_DICTIONARY_PERMISSION);
                addDictionaryPermission({ id: permission.id })
                onDone(() => {
                    console.log(" update Done ");
                    this.loadData();
                    alert(`Team ID :${id} : Dictionary Permission removed`)
                })
                onError(() => {
                    alert(`${error.value}`)
                })
            }
        })
        
    },
    async onDeleteDictionary(dictionary) {
        const { mutate: DeleteDictionary, onDone, onError, error } = await useMutation(DELETE_DICTIONARY);
        DeleteDictionary({ id: dictionary.id })
        onDone(() => {
            this.loadData();
            alert(` Dictionary '${dictionary.name}' is deleted`)
        })
        onError(() => {
            alert(`${error.value}`)
        })
    },
    activeRow(index, dictionary) {
        this.selectedRowIndex = index
        this.selectedDictionary = dictionary
    }
  }
}

</script>
<style scoped >
.error-text {
  color: red;
}
.dictionary-table tbody tr {
    cursor: pointer;
}
</style>