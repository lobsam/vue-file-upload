<template v-if="">
    <button class="btn btn-primary btn-sm " data-bs-target="#updateOrgModal" data-bs-toggle="modal"> Edit </button>
    <div class="modal fade" id="updateOrgModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update organization</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   <form>
                        <div class="mb-3">
                          <label for="org_name" class="form-label">Name</label>
                          <input type="Text" v-model="orgObject.name" class="form-control" id="org_name" >
                        </div>
                        <div class="mb-3">
                          <label for="org_logo" class="form-label">Logo url</label>
                          <input type="text" v-model="orgObject.logo" class="form-control" id="org_logo">
                        </div>
                        <div class="mb-3">
                          <label for="org_logo" class="form-label">Same as Team</label>
                          <select class="form-select " v-model="orgObject.same_as_team" aria-label=".form-select-sm example">
                            <option value="true">True</option>
                            <option selected value="false">False</option>
                          </select>
                        </div>
                        
                        <div class="modal-footer">
                          <button type="submit"  @click.prevent="onUpdate" class="btn btn-primary btn-sm ">Update</button>
                        </div>
                        <div v-if="iserror" class="error-text">
                             ERROR: {{ errorMessage }}
                          </div>
                    </form>
                </div>
               
            </div>
        </div>
    </div>
</template>

<script >

import { useMutation, useQuery } from '@vue/apollo-composable'
import { UPDATE_ORG } from "@/components/graphql/mutation.js"
import { getUserOrganization } from '@/components/graphql/quries.js'
import 'bootstrap';

export default {
  name: 'Update_organization',
  props: {
    orgData: {
        type: Object,
        required: true
    }
  },
  data() {
    return {
        iserror: false,
        errorMessage: "",
        orgObject: {}
    }
  },
  created() {
    this.orgObject = {
        id: this.orgData.id,
        name: this.orgData.name,
        logo: this.orgData.logo,
        same_as_team: this.orgData.same_as_team
    }
  },
  methods: {
    async loadData() {
        const {refetch} = await useQuery( getUserOrganization);
        refetch();
    },
    onUpdate() {
        try {
            let variables = {
                org_id: this.orgObject.id,
                object: {
                  name: this.orgObject.name,
                  logo: this.orgObject.logo,
                  same_as_team: this.orgObject.same_as_team
                }
            }

            const { mutate:updateOrganization, onDone , onError, error} = useMutation(UPDATE_ORG);
            updateOrganization(variables)
            onDone(() => {
                this.loadData();
            })
            onError(() => {
                this.iserror = true;
                this.errorMessage = error;
            })
        } catch (error) {
                this.iserror = true;
                this.errorMessage = error;
                console.log("error: ", error)
            }
    },
  }
}

</script>
<style scoped>
.error-text {
  color: red;
}
</style>