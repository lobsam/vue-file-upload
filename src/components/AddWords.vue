<template >
    
    <form>
        <div class="row">
            <h6 class="m-2" style="color:green">Add word and its Description</h6>
            <div class="col">
                <div class="form-floating mb-3">
                  <input type="text" required v-model="addWordObject.word" class="form-control" id="floatingInput" :disabled="isDisable">
                  <label for="floatingInput">Enter word</label>
                </div>
            </div>
            <div class="col">
                <div class="mb-3 form-floating">
                    <textarea class="form-control" v-model="addWordObject.descriptions.data.description"  :disabled="isDisable" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Enter Description</label>
                </div>
                
            </div>
            <div class="d-flex justify-content-end">
                <button class="btn btn-sm btn-success" @click.prevent="onAddWord" :disabled="isDisable">Add</button>
            </div>
        </div>
    </form>
    <hr class="mb-5">
    <div class="col">
        <h6 class="m-2" style="color:blue">Search Word to Update</h6>
        <div class="form-floating mb-3">
          <input 
            type="text" 
            required 
            v-model="searchWord" 
            class="form-control" 
            id="floatingInput" 
            :disabled="isDisable"
            >
          <label for="floatingInput">Enter word</label>
        </div>
        <div class="d-flex justify-content-end"> 
            <button 
                class="btn btn-primary btn-sm" 
                type="button" data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasScrolling" 
                aria-controls="offcanvasScrolling"
                @click="onSearchWord"
            >
                Search
            </button>
            <div 
                class="offcanvas offcanvas-end shadow-lg" 
                data-bs-scroll="true" 
                data-bs-backdrop="false" 
                tabindex="-1" 
                id="offcanvasScrolling" 
                aria-labelledby="offcanvasScrollingLabel"
            >
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Word and its Description</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body">
                <table  class="table table-hover dictionary-table shadow-sm" >
                    <thead class="table-primary">
                        <tr class="table-primary ">
                            <th scope="col">word</th>
                            <th scope="col">Descriptons</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(word, index) in searchResult" 
                            :key="index"
                            :class="{ 'table-danger': selectedRowIndex === index}"
                        >
                            <td>{{ word.word }}</td>
                            <td>{{ word.descriptions[0].description }}</td>
                            <td>
                                <button 
                                    class="btn btn-primary btn-sm" 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#collapseExample" 
                                    aria-expanded="false" 
                                    aria-controls="collapseExample"
                                    @click="onSelectUpdate(word)"
                                >
                                  Update
                                </button>
                            </td>
                            <td>
                                <UpdateDictionary :key="dictionary.id" :dictionaryData="dictionary"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr>
                <div class="collapse" id="collapseExample">
                    <h6>Update word and its Description</h6>
                  <div class="card card-body">
                    <form>
                        <div class="mb-3">
                          <label for="exampleFormControlInput1" class="form-label">Word</label>
                          <input type="text" v-model="updateObject.word" class="form-control" id="exampleFormControlInput1">
                        </div>
                        <div class="mb-3">
                          <label for="exampleFormControlInput1" class="form-label">Description</label>
                          <input type="text" v-model="updateObject.description" class="form-control" id="exampleFormControlInput1">
                        </div>
                        <div class="mb-3 d-flex justify-content-end">
                            <button class="btn btn-success btn-sm" @click.prevent="onUpdateSubmit">submit</button>
                        </div>
                    </form>
                </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    <hr class="mb-5">
    <div class="col">
        <h6 class="m-2" style="color:red">Delete Word</h6>
        <div class="form-floating mb-3">
          <input type="text" required v-model="wordID" class="form-control" id="floatingInput" :disabled="isDisable">
          <label for="floatingInput">Enter word's ID</label>
        </div>
        <div class="d-flex justify-content-end"> 
            <button class="btn btn-sm btn-danger" @click="onDeleteWord">Delete</button>
        </div>
    </div>
</template>
<script>
import { headers } from "@/headerSession/headers"
import { EXACT_SEARCH, GET_USER_BY_EMAIL } from '@/components/graphql/quries.js'
import { ADD_WORDS, DELETE_WORD, UPDATE_WORD, UPDATE_DESCRIPTIONS_BY_WORD_ID } from "@/components/graphql/mutation.js"
import { useMutation, useQuery  } from '@vue/apollo-composable'
import { useAuth0 } from '@auth0/auth0-vue';
export default {
    name: 'addWords',
    props: {
        dictionary: {
            type: Object
        },
    },
    data() {
        return {
            currentUserID: "",
            languages: [],
            isDisable: true,
            wordID: "",
            searchWord: "",
            searchResult: [],
            updateObject: {},
            addWordObject: {
                word: "",
                language: "",
                descriptions: {
                    data: {
                        description: "",
                        language: "",
                        dictionary_id: "",
                        last_updated_by: ""
                    }
                }
            }
        }
    },
    async mounted() {
        const { user } = useAuth0();
        const currentUser = await user;
        const currentUserEmail = currentUser.value.email
        const { result, onResult, onError, error, refetch } = await useQuery(GET_USER_BY_EMAIL, { email : currentUserEmail});
            
            onResult(() => {
                this.currentUserID = result.value.user[0].id
            })
            onError(() => {
                alert(`${error.value}`)
                this.isError = true;
                this.errorMessage = error.value
            })

    },
    watch: {
        dictionary() {
            this.addWordObject.language = this.dictionary.source
            this.addWordObject.descriptions.data.language = this.dictionary.target
            this.addWordObject.descriptions.data.dictionary_id = this.dictionary.id
            this.addWordObject.descriptions.data.last_updated_by = this.currentUserID
            this.isDisable = false
        }
    },
    methods: {
        async onSearchWord() {
            const { result, onResult, onError, error, refetch } = await useQuery(EXACT_SEARCH, { word : this.searchWord});
            
            onResult(() => {
                this.searchResult = result.value.data_words
            })
            onError(() => {
                alert(`${error.value}`)
                this.isError = true;
                this.errorMessage = error.value
            })
            refetch()
        },
        async onAddWord() {
            console.log("ord : ", this.addWordObject)
            const { mutate: addword, onDone, onError, error } = await useMutation(ADD_WORDS);
            addword( 
                {
                    objects: [this.addWordObject] 
                }
            )
            onDone(() => {
                console.log(" word has been uploaded ");
            })
            onError(() => {
                alert(`${error.value}`)
                this.isError = true;
                this.errorMessage = error.value
            })
        },
        async onSelectUpdate(word) {
            this.updateObject = {
                id: word.id,
                word: word.word,
                description: word.descriptions[0].description

            }
        },
        async onUpdateSubmit() {
            //update word
            const { mutate: updateWord, onDone, onError, error } = await useMutation(UPDATE_WORD);
            updateWord( 
                {
                    id: this.updateObject.id,
                    object: {
                        word: this.updateObject.word
                    }
                }
            )
            onDone(() => {
                console.log(" word has been updated ");
            })
            onError(() => {
                alert(`word : ${error.value}`)
                this.isError = true;
                this.errorMessage = error.value
            })

            //update Description
            const UpdateDesc = await useMutation(UPDATE_DESCRIPTIONS_BY_WORD_ID);
            UpdateDesc.mutate( 
                {
                    id: this.updateObject.id,
                    object : {
                        description: this.updateObject.description,
                        last_updated_by: this.currentUser
                    }
                    

                }
            )
            UpdateDesc.onDone(() => {
                console.log(" description is updated ");
            })
            UpdateDesc.onError(() => {
                alert(`Description : ${UpdateDesc.error.value}`)
                this.isError = true;
                this.errorMessage = UpdateDesc.error.value
            })
            this.onSearchWord()

        },
        async onDeleteWord() {
            const { mutate: deleteWord, onDone, onError, error } = useMutation(DELETE_WORD);
            let word  = deleteWord({id: this.wordID})
            
            onDone(async () => {
                let w = await word
                if (w.data.delete_data_words_by_pk !== null) {
                    alert(`${w.data.delete_data_words_by_pk.word} is delete`)
                } else {
                    alert(`Please Enver valid ID`)
                }
            })
            onError(() => {
                alert(`${error.value}`)
                this.isError = true;
                this.errorMessage = error.value
            })
        }
    }
}
</script>