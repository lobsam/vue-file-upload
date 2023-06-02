import gql from 'graphql-tag'


//Create operation
export const ADD_ORG = gql`mutation addOrganization($object: organization_insert_input!) {
    insert_organization_one(object: $object) {
      id
      name
      logo
      same_as_team
    }
  }
`

  //Update Organization
export const UPDATE_ORG = gql`
mutation updateOganization($org_id: uuid!, $object: organization_set_input) {
  update_organization_by_pk(pk_columns: {id: $org_id}, _set: $object) {
    id
  }
}

`

  // Delete Organization
export const DELETE_ORG = gql`
  mutation deleteOrganization($id: uuid!) {
    delete_organization_by_pk(id: $id) {
      id
      name
    }
  }
`

  // Add Organization Members
export const ADD_ORG_MEMBER = gql`
  mutation addOrgMembers($users: [organization_member_insert_input!]!) {
    insert_organization_member(objects: $users) {
      affected_rows
    }
  }
`

// Delete Organization Members
export const DELETE_ORG_MEMBER = gql`
  mutation removeOrgMember($user_id: uuid!, $org_id: uuid!) {
    delete_organization_member(where: {_and: {user_id: {_eq:$user_id}}, organization_id: {_eq: $org_id}}) {
      affected_rows
    }
  }
`

  //Add Team
export const ADD_TEAM = gql`
  mutation addTeam($team: team_insert_input!) {
    insert_team_one(object: $team) {
      name
      logo
      organization_id
    }
  }
`

// Update team
export const UPDATE_TEAM = gql`
  mutation updateTeam($team_id: uuid, $data: team_set_input) {
    update_team(where: {id: {_eq: $team_id}}, _set: $data) {
      affected_rows
    }
  }
`

//Delete Team
export const DELETE_TEAM = gql`
  mutation DeleteTeamByPk($team_id: uuid!) {
    delete_team_by_pk(id: $team_id) {
      id
    }
  }
`

// Add Team Members
export const ADD_TEAM_MEMBERS = gql`
  mutation addTeamMember($team_member: [team_member_insert_input!]!) {
    insert_team_member(objects: $team_member) {
      affected_rows
    }
  }
`

// Delete Team Members
export const DELETE_TEAM_MEMBERS = gql`
  mutation deleteTeamMember($team_id: uuid!, $user_id: uuid!) {
    delete_team_member_by_pk(team_id: $team_id, user_id: $user_id) {
      team_id
      user_id
    }
  }
`

// Create Dictionary 
export const ADD_DICTIONARY = gql`
  mutation addDictionary($organization_id: uuid, $name: String, $access_mode: data_access_mode_enum, $source: data_language_enum, $target:data_language_enum) {
    insert_data_dictionary_one(object: {organization_id: $organization_id, name: $name, access_mode: $access_mode, source: $source, target: $target }) {
      id
      name
      target
      source
      access_mode
    }
  }
`

// Create Dictionary 
export const ADD_DICTIONARY_API = gql`
  query HasuraActionAddDictionary( $dictionary: DictionaryObj!) {
    addDictionaryAPI( dictionary: $dictionary) {
      result
    }
  }

`

// Update Dictionary
export const UPDATE_DICTIONARY = gql`
  mutation updateDictionary($id: uuid!, $data: data_dictionary_set_input) {
    update_data_dictionary_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
      name
      organization_id
    }
  }
`

// Delete Dictionary

export const DELETE_DICTIONARY = gql`
  mutation DeleteDictionaryByPK($id: uuid!) {
    delete_data_dictionary_by_pk(id: $id) {
      id
      name
    }
    delete_data_words(where: {descriptions: {dictionary_id: {_eq: $id}}}) {
      affected_rows
    }
  }
`
// Dictionary Permission

export const ADD_DICTIONARY_PERMISSION = gql`
  mutation addDictionaryPermission($team_permission: dictionary_permission_insert_input!) {
    insert_dictionary_permission_one(object: $team_permission) {
      team_id
      dictionary_id
    }
  }
`

// Dictionary Permission

export const DELETE_DICTIONARY_PERMISSION = gql`
  mutation deleteDictionPermission($id: uuid!) {
    delete_dictionary_permission_by_pk(id: $id) {
      team_id
      dictionary_id
    }
  }
`

// Add words 
export const ADD_WORDS = gql`
  mutation addWords($objects: [data_words_insert_input!]!) {
    insert_data_words(objects: $objects) {
      affected_rows
    }
  }
`

//Delete word: 
export const  DELETE_WORD = gql`
  mutation deleteWord($id: Int!) {
    delete_data_words_by_pk(id: $id) {
      word
    }
  }
`
//Update word: 
export const UPDATE_WORD = gql`
  mutation updateWord($id: Int!,  $object: data_words_set_input) {
    update_data_words_by_pk(pk_columns: {id: $id}, _set: $object) {
      word
    }
  }
` 

//Delete Descriptions: 
export const  UPDATE_DESCRIPTIONS_BY_WORD_ID = gql`
  mutation updateDescription($id: Int!, $object: data_descriptions_set_input!) {
  update_data_descriptions(where: {word_id: {_eq: $id}}, _set: $object) {
    affected_rows
  }
}

`

