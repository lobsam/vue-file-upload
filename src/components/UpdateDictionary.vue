<template>
    <i 
        class="bi bi-pencil-square me-2"
        data-bs-toggle="offcanvas" 
        @click="loadData"
        :data-bs-target="currentOffCanvasBtn" 
        :aria-controls="currentOffCanvasBtn"
        style="font-size: 20px;"
    >
    </i>
    <div style="z-index: 2;" class="offcanvas offcanvas-end shadow-lg" data-bs-backdrop="false" tabindex="-1" :id="currentOffCanvasTarget" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Update Dictionary</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <form class="m-3">
                <div class="mb-3">
                  <label for="org_name" class="form-label">Name</label>
                  <input type="Text" v-model="updateObject.name" class="form-control" id="org_name" >
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Source</label>
                  <select class="form-select " v-model="updateObject.source" aria-label=".form-select-sm example">
                    <option v-for="mode in languages" :key="mode.value" :value="mode.value">{{mode.value}}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Target</label>
                  <select class="form-select " v-model="updateObject.target" aria-label=".form-select-sm example">
                    <option v-for="mode in languages" :key="mode.value" :value="mode.value">{{mode.value}}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Organization ID</label>
                  <input type="text" v-model="updateObject.organization_id" class="form-control" id="org_logo" disabled>
                </div>
                <div class="mb-3">
                  <label for="org_logo" class="form-label">Access mode</label>
                  <select class="form-select " v-model="updateObject.access_mode" aria-label=".form-select-sm example">
                    <option v-for="mode in accessMode" :key="mode.value" :value="mode.value">{{mode.value}}</option>
                  </select>
                </div>
                
                <div class="modal-footer">
                  <button type="submit"  @click.prevent="onUpdate" class="btn btn-primary btn-sm ">Update</button>
                </div>
                <div v-if="isError" class="error-text">
                     ERROR: {{ errorMessage }}
                  </div>
            </form>
        </div>
    </div>
</template>

<script>
import { GET_DICTIONARY_ACCESS_MODE, GET_LANGUAGES } from '@/components/graphql/quries.js'
import {UPDATE_DICTIONARY } from "@/components/graphql/mutation.js"
import { useMutation, useQuery } from '@vue/apollo-composable';
export default {
    name: "updateDictionary",
    props: {
        dictionaryData: {
        type: Object
        }
    },
    data () {
        return {
            dictionary: {},
            currentOffCanvasBtn: "",
            currentOffCanvasTarget: "",
            accessMode: [],
            languages: [],
            updateObject: {
                name: "",
                target: "",
                source: "",
                organization_id: "",
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
        loadData() {
            this.dictionary = this.dictionaryData;
            this.updateObject.name = this.dictionaryData.name,
            this.updateObject.target = this.dictionaryData.target,
            this.updateObject.source = this.dictionaryData.source,
            this.updateObject.organization_id = this.dictionaryData.organization_id,
            this.updateObject.access_mode = this.dictionaryData.access_mode

            this.currentOffCanvasBtn = `#${this.dictionary.name}-offcanvas`
            this.currentOffCanvasTarget = `${this.dictionary.name}-offcanvas`
            
            //get access_mode options
            const { result, onResult, onError, error , refetch} = useQuery(GET_DICTIONARY_ACCESS_MODE);
            onResult(() => {
                this.accessMode = result.value.data_access_mode;
            })
            onError(() => {
                alert(`${error.value}`)
            })
            refetch()
            //get languages
            const get_language = useQuery(GET_LANGUAGES);
            get_language.onResult(() => {
                this.languages = get_language.result.value.data_language;
            })
            get_language.onError(() => {
                alert(`${get_language.error.value}`)
            })
            get_language.refetch
        },
        async onUpdate() {
            const { mutate: updateDictionary, onDone, onError, error } = await useMutation(UPDATE_DICTIONARY);
            updateDictionary({ id: this.dictionary.id, data: this.updateObject })
            onDone(() => {
                console.log(" update Done");
                this.$parent.loadData();
            })
            onError(() => {
                alert(`${error.value}`)
            })
        }
    }
    
}
</script>