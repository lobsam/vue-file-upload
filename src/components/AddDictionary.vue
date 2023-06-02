<template>
    <button 
        class="btn btn-primary btn-sm" 
        type="button" 
        data-bs-toggle="offcanvas" 
        @click="loadData"
        :data-bs-target="currentOffCanvasBtn" 
        :aria-controls="currentOffCanvasBtn"
    >
        Add Dictionary
    </button>
    <div style="z-index: 2;" class="offcanvas offcanvas-end shadow-lg" data-bs-backdrop="false" tabindex="-1" :id="currentOffCanvasTarget" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Create Dictionary</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <form class="m-3">
                <div class="mb-3">
                  <label for="org_name" class="form-label">Name</label>
                  <input type="Text" v-model="addObject.name" class="form-control" id="org_name" required>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Source</label>
                  <select class="form-select " v-model="addObject.source" aria-label=".form-select-sm example " >
                    <option v-for="mode in languages" :key="mode.value" :value="mode.value">{{mode.value}}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Target</label>
                  <select class="form-select " v-model="addObject.target" aria-label=".form-select-sm example">
                    <option v-for="mode in languages" :key="mode.value" :value="mode.value">{{mode.value}}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Organization ID</label>
                  <input type="text" v-model="addObject.organization_id" class="form-control" id="org_logo" disabled>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Access mode</label>
                  <select class="form-select " v-model="addObject.access_mode" aria-label=".form-select-sm example" >
                    <option v-for="mode in accessMode" :key="mode.value" :value="mode.value">{{mode.value}}</option>
                  </select>
                </div>
                
                <div class="modal-footer">
                    <p v-if="loading">Loading.......</p>
                    <button type="submit"  @click.prevent="onAddDictionaryAPI" class="btn btn-success btn-sm ">Upload via API</button>
                    <button type="submit"  @click.prevent="onCreateDictionary" class="btn btn-primary btn-sm ">Create Dictionary</button>
                </div>
                <div v-if="isError" class="error-text">
                     ERROR: {{ errorMessage }}
                  </div>
            </form>
            <hr class="mb-5">
            <hr>
            <AddDictionaryFile 
                :organization_id="org_id"
                :accessMode="accessMode"
                :languages="languages"
            />
        </div>
    </div>
</template>

<script>
import { inject } from "vue";
import { GET_DICTIONARY_ACCESS_MODE, GET_LANGUAGES } from '@/components/graphql/quries.js'
import {ADD_DICTIONARY,ADD_DICTIONARY_API } from "@/components/graphql/mutation.js"
import { useMutation, useQuery } from '@vue/apollo-composable';
import AddDictionaryFile from "@/components/AddDictionaryFile.vue";
export default {
    name: "update-dictionary",
    props: {
        org_id: {
            type: String,
            required: true
        }
    },
    components: {
        AddDictionaryFile
    },
    setup() {
        const loadDictionaryTable = inject('reloadData')
        return {
            loadDictionaryTable
        }
    },
    data () {
        return {
            loading: false,
            dictionary: {},
            currentOffCanvasBtn: "",
            currentOffCanvasTarget: "",
            accessMode: [],
            languages: [],
            addObject: {
                name: "",
                target: "",
                source: "",
                organization_id: this.org_id,
                access_mode: ""
            },
            isError: false,
            errorMessage: ""

        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadData() {
            this.currentOffCanvasBtn = `#canvas${this.org_id}`
            this.currentOffCanvasTarget = `canvas${this.org_id}`
            
            //get access_mode options
            const { result, onResult, onError, error } = await useQuery(GET_DICTIONARY_ACCESS_MODE);
            onResult(() => {
                this.accessMode = result.value.data_access_mode;
            })
            onError(() => {
                alert(`${error.value}`)
            })
            //get languages
            const get_language = await useQuery(GET_LANGUAGES);
            get_language.onResult(() => {
                this.languages = get_language.result.value.data_language;
            })
            get_language.onError(() => {
                alert(`${get_language.error.value}`)
            })
        },
        onAddDictionaryAPI() {
            let variables = {
                dictionary: {
                    organization_id: this.addObject.organization_id,
                    name: this.addObject.name,
                    access_mode: this.addObject.access_mode,
                    target: this.addObject.target,
                    source: this.addObject.source
                }
            }
            this.onSubmit(ADD_DICTIONARY_API, variables)
        },
        onCreateDictionary() {
            let variables = {   
                organization_id: this.addObject.organization_id,
                name: this.addObject.name,
                access_mode: this.addObject.access_mode,
                target: this.addObject.target,
                source: this.addObject.source
            }
            this.onSubmit(ADD_DICTIONARY, variables)
        },
        async onSubmit(add_dictionary, variables) {
            const { mutate: addDictionary, onDone, loading, onError, error } = await useMutation(add_dictionary);
            addDictionary( variables )
            if(loading) {
                this.loading = loading
            }
            onDone(() => {
                this.loadDictionaryTable()
                this.loading = false;
                console.log("update Done");
                this.$parent.loadData()
            })
            onError(() => {
                this.isError = true;
                this.errorMessage = error.value
            })
            this.$parent.loadData();
        }
    }
    
}
</script>
<style scoped>
.error-text {
    color: red
}
</style>,