<template v-if="">
    <button class="btn btn-success btn-sm mb-2" data-bs-target="#addOrgModal" data-bs-toggle="modal"> Create organization </button>
    <div class="modal fade" id="addOrgModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Create organization</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
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
                          <label for="org_logo" class="form-label">Same as Team</label>
                          <select class="form-select " v-model="object.same_as_team" aria-label=".form-select-sm example">
                            <option value="true">True</option>
                            <option selected value="false">False</option>
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
</template>

<script >

import { useMutation, useQuery } from '@vue/apollo-composable'
import { ADD_ORG } from "@/components/graphql/mutation.js"
import { getUserOrganization } from '@/components/graphql/quries.js'
import { reactive } from 'vue'
import 'bootstrap';

export default {
  name: 'Add_organization',
  setup () {
    let Error = reactive({
      isError: false,
      errorMessage: ""
    })
    const object = reactive({
       name: "",
       logo: "",
       same_as_team: ""
    })
    async function onSubmit() {

      try {
        const {mutate:addOrganization, error } = await useMutation(ADD_ORG)
        const a = await addOrganization({object})
        if(a) {
         const getOrg = await useQuery( getUserOrganization, {fetchPolicy:'no-cache'});
         getOrg.refetch();
         getOrg.onError(() => {
          Error.isError = true;
          Error.errorMessage = error.value;
         })
         console.log("data ", a.data)
        }
      } catch(error) {
        Error.isError = true;
        Error.errorMessage = error;
        console.log("error: ", error)
      }
      
    }  
    return {
      onSubmit,
      object,
      Error
    }
  }
}

</script>
<style scoped>
.error-text {
  color: red;
}
</style>