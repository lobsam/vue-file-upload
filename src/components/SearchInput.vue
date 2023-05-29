<template>
    <div class="mt-4 mb-5">
        <span style="font-weight: lighter; color: red;">search word</span>
        <input 
            class="form-control"  
            type="text" 
            @keypress="searchWord" 
            v-model="word"
            />
    </div>
    <hr>
    <span style="font-weight: bold;">Result : {{ searchResult.length }}</span>
    <div class="mt-2" v-for="result in searchResult" :key="result.id">
        <div class="card">
          <div class="card-body">
            <h6 style="font-size: 40px; color: brown; ">{{result.word}}</h6>
            <p v-for="desc in result.descriptions" :key="desc" style="font-size: 20px; ">
             {{ desc.description }}
            </p>
          </div>
        </div>
    </div>
</template>
<script>
import { PARTIAL_SEARCH } from '@/components/graphql/quries.js'
// import {  } from "@/components/graphql/mutation.js"
import { useQuery } from '@vue/apollo-composable'
export default {
    name: "searchWord",
    data() {
        return {
            word: '',
            searchResult: []
        }
    },
    methods: {
        searchWord() {
            const partialSearch = useQuery(PARTIAL_SEARCH, { word: `${this.word}%`}, {fetchPolicy: 'no-cache'})
            partialSearch.onResult(() => {
                this.searchResult = partialSearch.result.value.data_words
            })
            partialSearch.onError(() => {
                alert(`${partialSearch.error.value}`)
            })
        }
    }
}
</script>