<template>
  <div class="m-3">
    <button class="btn btn-primary btn-sm mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Upload Dictionary File
    </button>
    <div class="collapse" id="collapseExample">
      <div class="card card-body">
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
          <label for="org_logo" class="form-label">Access mode</label>
          <select class="form-select " v-model="addObject.access_mode" aria-label=".form-select-sm example" >
            <option v-for="mode in accessMode" :key="mode.value" :value="mode.value">{{mode.value}}</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="file1" class="form-label">Upload Dictionary CSV file: </label>
          <input class="form-control" ref="inputFile" type="file" name="dictionaryFile" id="file1" accept=".csv" />
        </div>
        <button class="btn btn-sm btn-success" @click="uploadFile">Upload</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, reactive, inject } from "vue";
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'


const QUERY = gql`
    query LoadFile($file: file!) {
      add_dictionary_file(file: $file) {
        result
      }
    }
  `
const inputFile = ref(null);
let isloading = ref(false)
let addObject = reactive({
  access_mode: "",
  source: "",
  target: ""
})

const loadDictionaryTable = inject('reloadData')
const props = defineProps({
  organization_id: {
    type: String,
    required: true
  },
  accessMode: {
    type: Array,
    required: true
  },
  languages: {
    type: Array,
    required: true
  }
})

const propsData = computed({
  get() {
    return { 
      organization_id: props.organization_id,
      accessMode: props.accessMode,
      languages: props.languages
    }
  }
})
async function uploadFile() {
  const reader = new FileReader();
  const f = inputFile.value.files[0]
  if (!f) return; 
  reader.readAsBinaryString(f)

  reader.onload = async function() {
    const b = btoa(reader.result)
    const variables = {
    file: {
      name: f.name,
      source: "Tibetan",
      target: "Tibetan",
      access_mode: "Custom",
      organization_id: propsData.value.organization_id,
      file_type: f.type,
      base64str: b
    } 
  }
  const { loading,onResult, onError, error } = await useQuery( QUERY, variables);
  if(loading) {
    isloading.value = true
  }
  onResult(() => {
    isloading.value = false;
    loadDictionaryTable()
  })
  onError(() => {
    isloading.value = false;
    alert(`${error.value}`)
  })

  }
}
</script>